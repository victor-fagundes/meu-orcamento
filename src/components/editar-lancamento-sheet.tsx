"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { editarLancamentoAction, excluirLancamentoAction } from "@/app/actions/lancamentos";
import type { DeleteScope } from "@/domain/delete-lancamento";
import type { EditScope } from "@/domain/edit-lancamento";
import { fromCents } from "@/domain/money";
import { TIPOS_LABEL, type TipoOrcamento } from "@/domain/catalog";
import type { CartaoOpt, ItemOpt } from "./novo-lancamento-sheet";
import type { LancRow } from "./lancamentos-view";
import type { RemovedLancamentoDTO } from "@/app/actions/lancamentos";
import { MaterialSheet } from "@/components/material/sheet";
import { MdFilledButton, MdOption, MdSelect, MdTextButton, MdTextField } from "@/components/material/ui";

function centsToInput(cents: number): string {
  return fromCents(cents).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function EditarLancamentoSheet({
  row,
  itens,
  cartoes,
  open,
  onClose,
  onDeleted,
}: {
  row: LancRow | null;
  itens: ItemOpt[];
  cartoes: CartaoOpt[];
  open: boolean;
  onClose: () => void;
  onDeleted: (removed: RemovedLancamentoDTO[], count: number) => void;
}) {
  const [itemId, setItemId] = useState("");
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState("");
  const [pagamento, setPagamento] = useState("pix");
  const [scope, setScope] = useState<EditScope>("one");
  const [delScope, setDelScope] = useState<DeleteScope>("one");
  const [confirmEdit, setConfirmEdit] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  useEffect(() => {
    if (!row || !open) return;
    setItemId(row.itemId);
    setDescricao(row.descricao);
    setValor(centsToInput(row.valorCentavos));
    setData(row.dataTransacao);
    setPagamento(row.meio === "cartao" ? (row.cartaoId ?? "pix") : row.meio);
    setScope("one");
    setDelScope("one");
    setConfirmEdit(false);
    setConfirmDel(false);
    setError(null);
  }, [row, open]);

  const isGroup = !!(row?.grupoParcelaId && row.parcelaTotal && row.parcelaTotal > 1);

  const itensOpts = useMemo(() => {
    if (!row) return itens;
    const receita = row.itemTipo === "R";
    return itens.filter((i) => (receita ? i.tipo === "R" : i.tipo !== "R"));
  }, [itens, row]);

  if (!open || !row) return null;

  return (
    <MaterialSheet open={open} onClose={onClose} title="Editar lançamento">
        {isGroup ? (
          <p className="sheet-sub">
            Parcela {row.parcelaN} de {row.parcelaTotal}
          </p>
        ) : null}

        <MdSelect label="Item" value={itemId} onChange={setItemId}>
          {itensOpts.map((i) => (
            <MdOption key={i.id} value={i.id}>
              {TIPOS_LABEL[i.tipo as TipoOrcamento] ?? i.tipo} · {i.grupo} · {i.nome}
            </MdOption>
          ))}
        </MdSelect>

        <MdTextField label="Descrição" value={descricao} onChange={setDescricao} />

        <div className="r2">
          <MdTextField label="Valor (R$ por parcela)" value={valor} onChange={setValor} inputMode="decimal" sheetFocus />
          <MdTextField label="Data" type="date" value={data} onChange={setData} />
        </div>

        <MdSelect label="Pagamento" value={pagamento} onChange={setPagamento}>
          <MdOption value="deb">Débito</MdOption>
          <MdOption value="pix">PIX</MdOption>
          <MdOption value="din">Dinheiro</MdOption>
          {cartoes.map((c) => (
            <MdOption key={c.id} value={c.id}>
              {c.apelido}
            </MdOption>
          ))}
        </MdSelect>

        {isGroup ? (
          <MdSelect label="Escopo da alteração" value={scope} onChange={(v) => setScope(v as EditScope)}>
            <MdOption value="one">Só esta parcela</MdOption>
            <MdOption value="future">Esta e as próximas</MdOption>
          </MdSelect>
        ) : null}

        {error ? <p className="sheet-error" role="alert">{error}</p> : null}

        <div className="sheet-actions">
          <MdTextButton onClick={onClose} disabled={pending}>
            Cancelar
          </MdTextButton>
          <MdFilledButton
            disabled={pending}
            onClick={() => {
              if (isGroup && !confirmEdit) {
                setConfirmEdit(true);
                setError(
                  scope === "one"
                    ? "Confirme: alterar só esta parcela."
                    : "Confirme: alterar esta e as próximas.",
                );
                return;
              }
              start(async () => {
                const res = await editarLancamentoAction({
                  id: row.id,
                  itemId,
                  descricao,
                  valorBRL: valor,
                  dataISO: data,
                  pagamento,
                  scope,
                });
                if (!res.ok) {
                  setError(res.error);
                  setConfirmEdit(false);
                  return;
                }
                onClose();
              });
            }}
          >
            {pending ? "Salvando…" : confirmEdit ? "Confirmar edição" : "Salvar"}
          </MdFilledButton>
        </div>

        <div className="el-danger">
          <h4 className="aj-h2">Excluir</h4>
          {isGroup ? (
            <MdSelect label="Escopo da exclusão" value={delScope} onChange={(v) => setDelScope(v as DeleteScope)}>
              <MdOption value="one">Só esta parcela</MdOption>
              <MdOption value="future">Esta e as próximas</MdOption>
              <MdOption value="all">Todas do grupo</MdOption>
            </MdSelect>
          ) : null}
          <MdFilledButton
            disabled={pending}
            onClick={() => {
              if (!confirmDel) {
                setConfirmDel(true);
                setError("Toque de novo para confirmar a exclusão.");
                return;
              }
              start(async () => {
                const res = await excluirLancamentoAction({
                  id: row.id,
                  scope: isGroup ? delScope : "one",
                });
                if (!res.ok) {
                  setError(res.error);
                  setConfirmDel(false);
                  return;
                }
                onDeleted(res.removed, res.count);
                onClose();
              });
            }}
          >
            {confirmDel ? "Confirmar exclusão" : "Excluir…"}
          </MdFilledButton>
        </div>
    </MaterialSheet>
  );
}
