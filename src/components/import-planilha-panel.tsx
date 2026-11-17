"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import {
  confirmImportAction,
  parseImportFileAction,
  previewImportAction,
  previewPlanoAction,
} from "@/app/actions/import-planilha";
import { TIPOS_LABEL, type TipoOrcamento } from "@/domain/catalog";
import {
  buildPlanoPreview,
  detectLayout,
  emptyMap,
  guessMap,
  pickBestSheet,
  type ColumnMap,
  type LayoutKind,
  type PreviewRow,
} from "@/domain/import-planilha";
import { formatBRL } from "@/domain/money";
import { competenciaDestinoImport, textoDestinoImport } from "@/domain/navegacao-mes";
import { FileField } from "@/components/file-field";
import { MdFilledButton, MdOption, MdOutlinedButton, MdSelect } from "@/components/material/ui";

type CartaoOpt = { id: string; apelido: string };

const MAP_FIELDS: { key: keyof ColumnMap; label: string; required?: boolean }[] = [
  { key: "data", label: "Data *", required: true },
  { key: "valor", label: "Valor *", required: true },
  { key: "desc", label: "Descrição" },
  { key: "cat", label: "Categoria" },
  { key: "item", label: "Item" },
  { key: "tipo", label: "Tipo" },
  { key: "meio", label: "Pagamento" },
];

const HASH_KEY = "mo-import-hashes";

function loadHashes(): string[] {
  try {
    const raw = localStorage.getItem(HASH_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function rememberHash(hash: string) {
  const list = loadHashes().filter((h) => h !== hash);
  list.unshift(hash);
  localStorage.setItem(HASH_KEY, JSON.stringify(list.slice(0, 20)));
}

function kindLabel(kind: LayoutKind) {
  if (kind === "lanc") return "lançamentos";
  if (kind === "vf") return "Vida Financeira";
  return "orçamento mensal";
}

function candidatoLabel(key: string) {
  const [tipo, ...rest] = key.split("|");
  const grupo = rest.join("|");
  const label = TIPOS_LABEL[tipo as TipoOrcamento] ?? tipo;
  return `${label} · ${grupo}`;
}

type Meta = {
  fileHash: string;
  filename: string;
  sheets: string[];
  sheetName: string;
  kind: LayoutKind;
  headers: string[];
  map: ColumnMap;
  rowCount: number;
  rowsJson: string;
  allSheetsJson: string;
};

export function ImportPlanilhaPanel({ cartoes = [] }: { cartoes?: CartaoOpt[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [map, setMap] = useState<ColumnMap | null>(null);
  const [createItems, setCreateItems] = useState(true);
  const [importDuplicates, setImportDuplicates] = useState(false);
  const [reimportOk, setReimportOk] = useState(false);
  const [seenBefore, setSeenBefore] = useState(false);
  const [preview, setPreview] = useState<PreviewRow[] | null>(null);
  const [planoLines, setPlanoLines] = useState<
    {
      n: number;
      ok: boolean;
      why?: string;
      nome: string;
      tipo: TipoOrcamento;
      grupo: string;
      alvo: "catalogo" | "outros" | "escolher";
      candidatos: string[];
    }[]
  >([]);
  const [escolhas, setEscolhas] = useState<Record<number, string>>({});
  const [report, setReport] = useState<string | null>(null);
  const [cartaoId, setCartaoId] = useState(cartoes[0]?.id ?? "");
  const previewReq = useRef(0);

  const defaultMeio = cartaoId || "pix";

  useEffect(() => {
    if (!meta) {
      setSeenBefore(false);
      return;
    }
    setSeenBefore(loadHashes().includes(meta.fileHash));
    setReimportOk(false);
  }, [meta?.fileHash]);

  useEffect(() => {
    if (!meta || (meta.kind !== "vf" && meta.kind !== "plano")) {
      setPlanoLines([]);
      setEscolhas({});
      return;
    }
    let cancelled = false;
    previewPlanoAction({ rowsJson: meta.rowsJson }).then((res) => {
      if (cancelled) return;
      if (!res.ok) {
        setError(res.error);
        setPlanoLines([]);
        return;
      }
      setPlanoLines(res.lines);
      setEscolhas({});
    });
    return () => {
      cancelled = true;
    };
  }, [meta]);

  function reset() {
    previewReq.current += 1;
    setMeta(null);
    setMap(null);
    setPreview(null);
    setReport(null);
    setError(null);
    setReimportOk(false);
    setSeenBefore(false);
  }

  function applySheet(sheetName: string, allSheetsJson: string, base: Omit<Meta, "sheetName" | "kind" | "headers" | "map" | "rowCount" | "rowsJson">) {
    const all = JSON.parse(allSheetsJson) as Record<string, unknown[][]>;
    const rows = all[sheetName];
    if (!rows) return;
    previewReq.current += 1;
    const kind = detectLayout(rows);
    const headers = (rows[0] || []).map((c) => String(c ?? ""));
    const nextMap = kind === "lanc" ? guessMap(headers) : emptyMap();
    setMeta({
      ...base,
      sheetName,
      kind,
      headers,
      map: nextMap,
      rowCount: Math.max(0, rows.length - 1),
      rowsJson: JSON.stringify(rows),
      allSheetsJson,
    });
    setMap(nextMap);
    setPreview(null);
    setReport(null);
    setPreview(null);
    setReport(null);
  }

  const canCommit = !seenBefore || reimportOk;

  return (
    <section className="aj-block" style={{ marginTop: 16 }}>
      <h2 className="aj-h2">Importar planilha</h2>
      <p className="aj-help">
        CSV, XLSX, XLS ou ODS até 4 MB. Prévia obrigatória — nada é gravado sem confirmar.
      </p>

      <FileField
        label="Escolher planilha"
        accept=".csv,.xlsx,.xls,.ods,text/csv"
        disabled={pending}
        onFile={(file) => {
          const fd = new FormData();
          fd.set("file", file);
          start(async () => {
            setError(null);
            setPreview(null);
            setReport(null);
            const res = await parseImportFileAction(fd);
            if (!res.ok) {
              setError(res.error);
              return;
            }
            setMeta(res);
            setMap(res.map);
          });
        }}
      />

      {meta ? (
        <>
          <p className="aj-msg">
            {meta.filename} · {meta.rowCount} linhas · layout <strong>{kindLabel(meta.kind)}</strong> ·
            hash {meta.fileHash}
          </p>

          {meta.sheets.length > 1 ? (
            <>
              <p className="aj-help" style={{ marginBottom: 8 }}>
                Este arquivo tem várias abas. Use <strong>Cartão…</strong> para lançamentos e{" "}
                <strong>Planilhas de Gastos Mensais</strong> para receitas / despesas fixas e
                variáveis (planejamento do Orçamento). Confirmações são independentes.
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                <MdOutlinedButton
                  disabled={pending}
                  onClick={() => {
                    const all = JSON.parse(meta.allSheetsJson) as Record<string, unknown[][]>;
                    const name = pickBestSheet(meta.sheets, all, "lanc");
                    applySheet(name, meta.allSheetsJson, {
                      fileHash: meta.fileHash,
                      filename: meta.filename,
                      sheets: meta.sheets,
                      allSheetsJson: meta.allSheetsJson,
                    });
                    setPreview(null);
                    setReport(null);
                  }}
                >
                  Sugerir cartão/lançamentos
                </MdOutlinedButton>
                <MdOutlinedButton
                  disabled={pending}
                  onClick={() => {
                    const all = JSON.parse(meta.allSheetsJson) as Record<string, unknown[][]>;
                    const name = pickBestSheet(meta.sheets, all, "plano");
                    applySheet(name, meta.allSheetsJson, {
                      fileHash: meta.fileHash,
                      filename: meta.filename,
                      sheets: meta.sheets,
                      allSheetsJson: meta.allSheetsJson,
                    });
                    setPreview(null);
                    setReport(null);
                  }}
                >
                  Sugerir planejamento
                </MdOutlinedButton>
              </div>
              <div className="imp-sheet-chips">
                {meta.sheets.map((s) => {
                  const all = JSON.parse(meta.allSheetsJson) as Record<string, unknown[][]>;
                  const k = detectLayout(all[s] || []);
                  const useful =
                    /cartao|gasto|planilha|mensal|lanc|extrato|orcamento/i.test(s) ||
                    k !== "lanc" ||
                    (guessMap(((all[s] || [])[0] || []).map(String)).data &&
                      guessMap(((all[s] || [])[0] || []).map(String)).valor);
                  if (!useful && /relatorio|dashboard|^sheet/i.test(s)) return null;
                  const pick = () =>
                    applySheet(s, meta.allSheetsJson, {
                      fileHash: meta.fileHash,
                      filename: meta.filename,
                      sheets: meta.sheets,
                      allSheetsJson: meta.allSheetsJson,
                    });
                  return s === meta.sheetName ? (
                    <MdFilledButton key={s} disabled={pending} onClick={pick}>
                      {s}
                      <span className="aj-help"> · {kindLabel(k)}</span>
                    </MdFilledButton>
                  ) : (
                    <MdOutlinedButton key={s} disabled={pending} onClick={pick}>
                      {s}
                      <span className="aj-help"> · {kindLabel(k)}</span>
                    </MdOutlinedButton>
                  );
                })}
              </div>
              <MdSelect
                label="Aba"
                value={meta.sheetName}
                disabled={pending}
                onChange={(name) => {
                  applySheet(name, meta.allSheetsJson, {
                    fileHash: meta.fileHash,
                    filename: meta.filename,
                    sheets: meta.sheets,
                    allSheetsJson: meta.allSheetsJson,
                  });
                }}
              >
                {meta.sheets.map((s) => (
                  <MdOption key={s} value={s}>
                    {s}
                  </MdOption>
                ))}
              </MdSelect>
            </>
          ) : null}

          {seenBefore ? (
            <label className="lim-check" style={{ marginBottom: 12 }}>
              <input
                type="checkbox"
                checked={reimportOk}
                onChange={(e) => setReimportOk(e.target.checked)}
              />
              Este arquivo já foi importado — confirmo reimportação
            </label>
          ) : null}

          {meta.kind === "lanc" && map ? (
            <>
              {cartoes.length ? (
                <MdSelect
                  label="Cartão destino"
                  value={cartaoId}
                  onChange={(id) => {
                      setCartaoId(id);
                      if (!preview || !meta || !map) return;
                      const meio = id || "pix";
                      const req = ++previewReq.current;
                      setPreview(null);
                      start(async () => {
                        const res = await previewImportAction({
                          rowsJson: meta.rowsJson,
                          map,
                          createItems,
                          defaultMeio: meio,
                        });
                        if (req !== previewReq.current) return;
                        if (!res.ok) {
                          setError(res.error);
                          return;
                        }
                        setError(null);
                        setPreview(res.preview);
                      });
                    }}
                  >
                    <MdOption value="">PIX (sem cartão)</MdOption>
                    {cartoes.map((c) => (
                      <MdOption key={c.id} value={c.id}>
                        {c.apelido}
                      </MdOption>
                    ))}
                </MdSelect>
              ) : (
                <p className="aj-help">Sem cartão ativo — importação como PIX.</p>
              )}
              <div className="imp-map">
                {MAP_FIELDS.map((f) => (
                  <MdSelect
                    key={f.key}
                    label={f.label}
                    value={map[f.key]}
                    onChange={(v) => {
                      previewReq.current += 1;
                      setMap({ ...map, [f.key]: v });
                      setPreview(null);
                    }}
                  >
                    <MdOption value="">—</MdOption>
                    {meta.headers.map((h, i) => (
                      <MdOption key={`${h}-${i}`} value={String(i)}>
                        {h || `(col ${i})`}
                      </MdOption>
                    ))}
                  </MdSelect>
                ))}
              </div>
              <label className="lim-check" style={{ marginBottom: 8 }}>
                <input
                  type="checkbox"
                  checked={createItems}
                  onChange={(e) => setCreateItems(e.target.checked)}
                />
                Criar categorias/itens faltantes
              </label>
              <label className="lim-check" style={{ marginBottom: 12 }}>
                <input
                  type="checkbox"
                  checked={importDuplicates}
                  onChange={(e) => setImportDuplicates(e.target.checked)}
                />
                Importar possíveis duplicatas
              </label>
              <MdOutlinedButton
                disabled={pending || !map.data || !map.valor || !canCommit}
                onClick={() => {
                  start(async () => {
                    const res = await previewImportAction({
                      rowsJson: meta.rowsJson,
                      map,
                      createItems,
                      defaultMeio,
                    });
                    if (!res.ok) {
                      setError(res.error);
                      return;
                    }
                    setPreview(res.preview);
                  });
                }}
              >
                Gerar prévia
              </MdOutlinedButton>
            </>
          ) : (
            <>
              <p className="aj-help">
                {meta.kind === "vf"
                  ? "Modelo Vida Financeira detectado (itens T|Grupo|Nome + meses)."
                  : "Layout de orçamento mensal detectado. Confirme para atualizar o planejamento (mês com valor substitui; negativo ou ilegível zera; vazio ou zero não apaga)."}
              </p>
              {(() => {
                const rows = JSON.parse(meta.rowsJson) as unknown[][];
                const cells = buildPlanoPreview(rows).reduce((s, r) => s + r.cellsUpdated, 0);
                if (cells === 0) {
                  return (
                    <p className="sheet-error" role="alert">
                      Nenhum mês de plano utilizável nesta aba (ex.: Relatórios). Use “Sugerir
                      planejamento” ou escolha “Planilhas de Gastos Mensais”.
                    </p>
                  );
                }
                const escolhasPayload = Object.entries(escolhas)
                  .filter(([, grupo]) => grupo)
                  .map(([n, grupo]) => ({ n: Number(n), grupo }));
                return (
                  <>
                    <p className="aj-help">{cells} célula(s) de plano detectada(s) na prévia.</p>
                    {planoLines.length > 0 ? (
                      <ul className="imp-plano-list" style={{ listStyle: "none", padding: 0, margin: "8px 0 12px" }}>
                        {planoLines.map((line) => (
                          <li key={line.n}>
                            <span>
                              {line.nome || `Linha ${line.n}`}
                              {line.ok && line.alvo !== "escolher"
                                ? ` — ${TIPOS_LABEL[line.tipo]} · ${line.grupo}`
                                : ""}
                              {!line.ok ? ` — ${line.why ?? "rejeitada"}` : ""}
                            </span>
                            {line.ok && line.alvo === "escolher" ? (
                              <MdSelect
                                label="Escolha o grupo"
                                value={escolhas[line.n] ?? ""}
                                onChange={(v) =>
                                  setEscolhas((prev) => ({ ...prev, [line.n]: v }))
                                }
                              >
                                <MdOption value="">Selecione</MdOption>
                                {line.candidatos.map((key) => (
                                  <MdOption key={key} value={key}>
                                    {candidatoLabel(key)}
                                  </MdOption>
                                ))}
                              </MdSelect>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="aj-help">Calculando o grupo de cada linha…</p>
                    )}
                    <label className="lim-check" style={{ marginBottom: 12 }}>
                      <input
                        type="checkbox"
                        checked={createItems}
                        onChange={(e) => setCreateItems(e.target.checked)}
                      />
                      Criar itens faltantes
                    </label>
                    <MdFilledButton
                      disabled={pending || !canCommit || cells === 0}
                      onClick={() => {
                        start(async () => {
                          const res = await confirmImportAction({
                            kind: meta.kind,
                            rowsJson: meta.rowsJson,
                            createItems,
                            importDuplicates: false,
                            defaultMeio: "pix",
                            escolhas: escolhasPayload,
                          });
                          if (!res.ok) {
                            setError(res.error);
                            return;
                          }
                          rememberHash(meta.fileHash);
                          setSeenBefore(true);
                          setReport(
                            res.imported === 0
                              ? `Nada importado nesta aba. Troque para “Planilhas de Gastos Mensais” (planejamento) ou “Cartão Inter…” (lançamentos).`
                              : `Planejamento: ${res.imported} célula(s) · itens criados: ${res.itemsCreated} · rejeitados: ${res.rejected}`,
                          );
                          if (res.imported > 0) router.push("/app/orcamento");
                        });
                      }}
                    >
                      Importar planejamento
                    </MdFilledButton>
                  </>
                );
              })()}
            </>
          )}
        </>
      ) : null}

      {preview ? (
        <div style={{ marginTop: 12 }}>
          <p className="aj-msg">
            {preview.filter((r) => r.ok && !r.duplicate).length} válida(s) ·{" "}
            {preview.filter((r) => r.duplicate).length} duplicata(s) ·{" "}
            {preview.filter((r) => !r.ok).length} rejeitada(s)
            {" · "}competência = regra do cartão/meio (não o mês da seção Excel)
          </p>
          <div className="ano-scroll">
            <table className="imp-tbl">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Data</th>
                  <th>Competência</th>
                  <th>Descrição</th>
                  <th>Valor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {preview.slice(0, 80).map((r) => (
                  <tr key={r.n} className={r.ok && !r.duplicate ? "ok" : "er"}>
                    <td>{r.n}</td>
                    <td>{r.dt || "—"}</td>
                    <td>{r.competencia || "—"}</td>
                    <td>{r.desc}</td>
                    <td>{r.valCents ? formatBRL(r.valCents) : "—"}</td>
                    <td>{!r.ok ? r.why : r.duplicate ? "Duplicata" : "OK"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <MdFilledButton
            style={{ marginTop: 12 }}
            disabled={pending || !canCommit}
            onClick={() => {
              if (!meta || !map) return;
              start(async () => {
                const res = await confirmImportAction({
                  kind: "lanc",
                  rowsJson: meta.rowsJson,
                  map,
                  createItems,
                  importDuplicates,
                  defaultMeio,
                });
                if (!res.ok) {
                  setError(res.error);
                  return;
                }
                rememberHash(meta.fileHash);
                setSeenBefore(true);
                const hoje = new Date();
                const mesCivil = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}`;
                const mes = competenciaDestinoImport(res.competencias, mesCivil);
                setReport(
                  `Importados: ${res.imported} · Ignorados: ${res.skipped} · Rejeitados: ${res.rejected} · Itens criados: ${res.itemsCreated}` +
                    (mes ? ` · ${textoDestinoImport(mes, res.competencias.length)}` : ""),
                );
                setPreview(null);
                if (mes) router.push(`/app/lancamentos?mes=${mes}`);
                else router.refresh();
              });
            }}
          >
            Confirmar importação
          </MdFilledButton>
        </div>
      ) : null}

      {report ? <p className="aj-msg">{report}</p> : null}
      {error ? <p className="sheet-error" role="alert">{error}</p> : null}
      {meta || preview ? (
        <MdOutlinedButton style={{ marginTop: 8 }} onClick={reset}>
          Limpar
        </MdOutlinedButton>
      ) : null}
    </section>
  );
}
