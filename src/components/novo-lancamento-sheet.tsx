"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { criarLancamentoAction } from "@/app/actions/lancamentos";
import { TIPOS_LABEL, type TipoOrcamento } from "@/domain/catalog";
import { formatBRL } from "@/domain/money";
import { buildLancamentoDraft } from "@/domain/lancamentos";
import { formatCompetenciaBR } from "@/domain/competencia";
import { normalizeHeader } from "@/domain/import-planilha";
import { preferirItem } from "@/domain/item-unico";
import { MaterialSheet } from "@/components/material/sheet";
import { MdFilledButton, MdOption, MdSelect, MdTextButton, MdTextField } from "@/components/material/ui";

export type ItemOpt = {
  id: string;
  tipo: string;
  grupo: string;
  nome: string;
  plano: number[];
};

export type CartaoOpt = {
  id: string;
  apelido: string;
  diaFechamento: number | null;
};

export function NovoLancamentoSheet({
  itens,
  cartoes,
  competencia,
  open,
  onClose,
}: {
  itens: ItemOpt[];
  cartoes: CartaoOpt[];
  competencia: string;
  open: boolean;
  onClose: () => void;
}) {
  const [kind, setKind] = useState<"D" | "R">("D");
  const [itemId, setItemId] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState(() => new Date().toISOString().slice(0, 10));
  const [pagamento, setPagamento] = useState("pix");
  const [parcelas, setParcelas] = useState("1");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  useEffect(() => {
    if (open) return;
    setKind("D");
    setItemId("");
    setDescricao("");
    setValor("");
    setData(new Date().toISOString().slice(0, 10));
    setPagamento("pix");
    setParcelas("1");
    setError(null);
  }, [open]);

  const itensFiltrados = useMemo(() => {
    return itens.filter((i) => (kind === "R" ? i.tipo === "R" : i.tipo !== "R"));
  }, [itens, kind]);

  const preferred = useMemo(() => {
    const first = itensFiltrados[0];
    if (!first) return undefined;
    const key = normalizeHeader(first.nome);
    const siblings = itensFiltrados.filter((i) => normalizeHeader(i.nome) === key);
    const month = Number(competencia.slice(5, 7)) - 1;
    return preferirItem(siblings, Number.isFinite(month) ? month : 0);
  }, [itensFiltrados, competencia]);

  const item = itensFiltrados.find((i) => i.id === itemId) ?? preferred;
  const effectiveItemId = item?.id ?? "";

  const isCartao = pagamento !== "deb" && pagamento !== "pix" && pagamento !== "din";
  const cartao = cartoes.find((c) => c.id === pagamento);

  const preview = useMemo(() => {
    if (!item) return null;
    return buildLancamentoDraft({
      itemId: item.id,
      itemNome: item.nome,
      itemTipo: item.tipo,
      descricao,
      valorBRL: valor,
      dataISO: data,
      pagamento,
      parcelas: Number(parcelas) || 1,
      diaFechamentoCartao: cartao?.diaFechamento ?? null,
    });
  }, [item, descricao, valor, data, pagamento, parcelas, cartao]);

  if (!open) return null;

  return (
    <MaterialSheet open={open} onClose={onClose} title="Novo lançamento">
        <MdSelect
          label="Tipo"
          value={kind}
          onChange={(v) => {
            setKind(v as "D" | "R");
            setItemId("");
          }}
        >
          <MdOption value="D">Despesa</MdOption>
          <MdOption value="R">Receita</MdOption>
        </MdSelect>

        <MdSelect label="Item do orçamento" value={effectiveItemId} onChange={setItemId}>
          {itensFiltrados.map((i) => (
            <MdOption key={i.id} value={i.id}>
              {TIPOS_LABEL[i.tipo as TipoOrcamento] ?? i.tipo} · {i.grupo} · {i.nome}
            </MdOption>
          ))}
        </MdSelect>

        <MdTextField label="Descrição (opcional)" value={descricao} onChange={setDescricao} />

        <div className="r2">
          <MdTextField label="Valor total (R$)" value={valor} onChange={setValor} inputMode="decimal" />
          <MdTextField label="Data" type="date" value={data} onChange={setData} />
        </div>

        <div className="r2">
          <MdSelect
            label="Pagamento"
            value={pagamento}
            onChange={(v) => {
              setPagamento(v);
              if (v === "deb" || v === "pix" || v === "din") setParcelas("1");
            }}
          >
            <MdOption value="deb">Débito</MdOption>
            <MdOption value="pix">PIX</MdOption>
            <MdOption value="din">Dinheiro</MdOption>
            {cartoes.map((c) => (
              <MdOption key={c.id} value={c.id}>
                {c.apelido}
              </MdOption>
            ))}
          </MdSelect>
          <MdTextField
            label="Parcelas"
            type="number"
            value={parcelas}
            disabled={!isCartao}
            onChange={setParcelas}
          />
        </div>

        {preview?.ok ? (
          <div className="nl-prev">
            <p className="aj-msg">
              {preview.descricao} · total {formatBRL(preview.valorTotalCentavos)}
            </p>
            {preview.parcelas.length > 1 ? (
              <ul className="aj-arch-list">
                {preview.parcelas.map((p) => (
                  <li key={p.n}>
                    {p.n}/{p.total} · {formatBRL(p.valorCentavos)} ·{" "}
                    {formatCompetenciaBR(p.competencia)}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="orc-item-sub">
                Competência {formatCompetenciaBR(preview.parcelas[0].competencia)}
              </p>
            )}
          </div>
        ) : preview && !preview.ok && valor ? (
          <p className="sheet-error" role="alert">{preview.error}</p>
        ) : null}

        {error ? <p className="sheet-error" role="alert">{error}</p> : null}

        <div className="sheet-actions">
          <MdTextButton onClick={onClose} disabled={pending}>
            Cancelar
          </MdTextButton>
          <MdFilledButton
            disabled={pending || !effectiveItemId}
            onClick={() => {
              start(async () => {
                const res = await criarLancamentoAction({
                  itemId: effectiveItemId,
                  descricao,
                  valorBRL: valor,
                  dataISO: data,
                  pagamento,
                  parcelas: Number(parcelas) || 1,
                });
                if (!res.ok) {
                  setError(res.error);
                  return;
                }
                onClose();
              });
            }}
          >
            {pending ? "Salvando…" : "Salvar"}
          </MdFilledButton>
        </div>
    </MaterialSheet>
  );
}
