"use client";

import { useState, useTransition } from "react";
import { confirmPdfImportAction, parsePdfFaturaAction } from "@/app/actions/import-pdf";
import type { PdfPreviewRow } from "@/domain/import-pdf";
import { formatBRL } from "@/domain/money";
import { FileField } from "@/components/file-field";
import { MdFilledButton, MdOption, MdOutlinedButton, MdSelect } from "@/components/material/ui";

type CartaoOpt = { id: string; apelido: string };

export function ImportPdfPanel({ cartoes }: { cartoes: CartaoOpt[] }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [cartaoId, setCartaoId] = useState(cartoes[0]?.id ?? "");
  const [estornoMode, setEstornoMode] = useState<"R" | "ignore">("ignore");
  const [issuer, setIssuer] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [preview, setPreview] = useState<PdfPreviewRow[] | null>(null);
  const [report, setReport] = useState<string | null>(null);

  function reset() {
    setPreview(null);
    setIssuer(null);
    setConfidence(null);
    setReport(null);
    setError(null);
  }

  function updateRow(n: number, patch: Partial<PdfPreviewRow>) {
    setPreview((prev) => prev?.map((r) => (r.n === n ? { ...r, ...patch } : r)) ?? null);
  }

  return (
    <section className="aj-block" style={{ marginTop: 16 }}>
      <h2 className="aj-h2">Importar fatura (PDF)</h2>
      <p className="aj-help">
        PDF com texto selecionável. Processado em memória — o arquivo não é guardado.
      </p>

      {!cartoes.length ? (
        <p className="sheet-error">Cadastre um cartão acima antes de importar a fatura.</p>
      ) : (
        <>
          <MdSelect label="Cartão destino *" value={cartaoId} onChange={setCartaoId}>
            {cartoes.map((c) => (
              <MdOption key={c.id} value={c.id}>
                {c.apelido}
              </MdOption>
            ))}
          </MdSelect>

          <FileField
            label="Escolher PDF"
            accept=".pdf,application/pdf"
            disabled={pending || !cartaoId}
            onFile={(file) => {
              const fd = new FormData();
              fd.set("file", file);
              start(async () => {
                setError(null);
                setReport(null);
                const res = await parsePdfFaturaAction(fd);
                if (!res.ok) {
                  setError(res.error);
                  setPreview(null);
                  return;
                }
                setIssuer(res.issuer);
                setConfidence(res.confidence);
                setPreview(res.preview);
              });
            }}
          />
        </>
      )}

      {preview ? (
        <div style={{ marginTop: 12 }}>
          <p className="aj-msg">
            Emissor: {issuer} · confiança {confidence}% ·{" "}
            {preview.filter((r) => r.ok && !r.ignore).length} linha(s) ativas
          </p>
          {(confidence ?? 100) < 70 ? (
            <p className="sheet-error" role="alert">
              Confiança baixa — revise cada linha antes de confirmar.
            </p>
          ) : null}

          <MdSelect
            label="Estornos"
            value={estornoMode}
            onChange={(v) => setEstornoMode(v as "R" | "ignore")}
          >
            <MdOption value="ignore">Ignorar</MdOption>
            <MdOption value="R">Importar como receita</MdOption>
          </MdSelect>

          <div className="ano-scroll">
            <table className="imp-tbl imp-tbl-pdf">
              <thead>
                <tr>
                  <th></th>
                  <th>Data</th>
                  <th>Descrição</th>
                  <th>Valor</th>
                  <th>Parc.</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {preview.slice(0, 100).map((r) => (
                  <tr key={r.n} className={r.ok && !r.ignore ? "ok" : "er"}>
                    <td>
                      <input
                        type="checkbox"
                        title="Importar"
                        checked={!r.ignore && r.ok}
                        disabled={!r.ok}
                        onChange={(e) => updateRow(r.n, { ignore: !e.target.checked })}
                      />
                    </td>
                    <td>
                      <input
                        className="imp-inline"
                        type="date"
                        value={r.dt || ""}
                        onChange={(e) =>
                          updateRow(r.n, {
                            dt: e.target.value || null,
                            ok: !!e.target.value && r.valCents > 0,
                          })
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="imp-inline"
                        value={r.desc}
                        title={r.desc}
                        onChange={(e) => updateRow(r.n, { desc: e.target.value })}
                      />
                      <span className="aj-help">{r.itemHint}</span>
                    </td>
                    <td>
                      <input
                        className="imp-inline"
                        value={(r.valCents / 100).toFixed(2)}
                        onChange={(e) => {
                          const n = Number(e.target.value.replace(",", "."));
                          const cents = Number.isFinite(n) ? Math.round(Math.abs(n) * 100) : 0;
                          updateRow(r.n, {
                            valCents: cents,
                            totalCents: cents,
                            ok: !!r.dt && cents > 0,
                            why: cents > 0 ? undefined : "Valor inválido",
                          });
                        }}
                      />
                    </td>
                    <td>
                      {r.parcelaN && r.parcelaTotal
                        ? `${r.parcelaN}/${r.parcelaTotal}`
                        : "—"}
                      {r.estorno ? " · estorno" : ""}
                    </td>
                    <td>{!r.ok ? r.why : r.ignore ? "Ignorada" : formatBRL(r.valCents)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <MdFilledButton
            style={{ marginTop: 12 }}
            disabled={
              pending ||
              !cartaoId ||
              ((confidence ?? 100) < 70 &&
                preview.some((r) => r.ok && !r.ignore && !r.dt))
            }
            onClick={() => {
              start(async () => {
                const res = await confirmPdfImportAction({
                  cartaoId,
                  preview,
                  estornoMode,
                });
                if (!res.ok) {
                  setError(res.error);
                  return;
                }
                setReport(
                  `PDF: importados ${res.imported} · ignorados ${res.skipped} · rejeitados ${res.rejected}`,
                );
                setPreview(null);
              });
            }}
          >
            Confirmar importação do PDF
          </MdFilledButton>
        </div>
      ) : null}

      {report ? <p className="aj-msg">{report}</p> : null}
      {error ? <p className="sheet-error" role="alert">{error}</p> : null}
      {preview ? (
        <MdOutlinedButton style={{ marginTop: 8 }} onClick={reset}>
          Limpar
        </MdOutlinedButton>
      ) : null}
    </section>
  );
}
