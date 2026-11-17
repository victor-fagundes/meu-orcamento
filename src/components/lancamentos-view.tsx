"use client";

import Link from "next/link";
import { track } from "@/lib/telemetry";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  desfazerExclusaoAction,
  type RemovedLancamentoDTO,
} from "@/app/actions/lancamentos";
import { formatBRL } from "@/domain/money";
import { shiftCompetencia } from "@/lib/competencia-nav";
import { MdFilledButton, MdOption, MdSelect, MdTextField } from "@/components/material/ui";
import { EditarLancamentoSheet } from "./editar-lancamento-sheet";
import type { CartaoOpt, ItemOpt } from "./novo-lancamento-sheet";

export type LancRow = {
  id: string;
  itemId: string;
  cartaoId: string | null;
  descricao: string;
  valorCentavos: number;
  dataTransacao: string;
  competencia: string;
  meio: string;
  parcelaN: number | null;
  parcelaTotal: number | null;
  grupoParcelaId: string | null;
  itemNome: string;
  itemGrupo: string;
  itemTipo: string;
  cartaoApelido: string | null;
};

function meioLabel(row: LancRow): string {
  if (row.meio === "cartao") return row.cartaoApelido ?? "Cartão";
  if (row.meio === "deb") return "Débito";
  if (row.meio === "pix") return "PIX";
  if (row.meio === "din") return "Dinheiro";
  return row.meio;
}

function parcelaLabel(row: LancRow): string | null {
  if (!row.parcelaN || !row.parcelaTotal) return null;
  const restam = Math.max(0, row.parcelaTotal - row.parcelaN);
  return `Parcela ${row.parcelaN} de ${row.parcelaTotal} · restam ${restam}`;
}

export function LancamentosView({
  competencia,
  mesLabel,
  rows,
  itens,
  cartoes,
}: {
  competencia: string;
  mesLabel: string;
  rows: LancRow[];
  itens: ItemOpt[];
  cartoes: CartaoOpt[];
}) {
  const prev = shiftCompetencia(competencia, -1);
  const next = shiftCompetencia(competencia, 1);
  const [editRow, setEditRow] = useState<LancRow | null>(null);
  const [q, setQ] = useState("");
  const [filtroMeio, setFiltroMeio] = useState("todos");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [undo, setUndo] = useState<{ removed: RemovedLancamentoDTO[]; count: number } | null>(
    null,
  );
  const [undoLeft, setUndoLeft] = useState(0);
  const [pendingUndo, startUndo] = useTransition();

  useEffect(() => {
    if (!undo) return;
    setUndoLeft(10);
    const tick = setInterval(() => {
      setUndoLeft((s) => {
        if (s <= 1) {
          clearInterval(tick);
          setUndo(null);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [undo]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows.filter((r) => {
      if (filtroTipo === "R" && r.itemTipo !== "R") return false;
      if (filtroTipo === "D" && r.itemTipo === "R") return false;
      if (filtroMeio !== "todos") {
        if (filtroMeio === "cartao") {
          if (r.meio !== "cartao") return false;
        } else if (r.meio !== filtroMeio) return false;
      }
      if (!needle) return true;
      return (
        r.descricao.toLowerCase().includes(needle) ||
        r.itemNome.toLowerCase().includes(needle) ||
        r.itemGrupo.toLowerCase().includes(needle)
      );
    });
  }, [rows, q, filtroMeio, filtroTipo]);

  const total = filtered.reduce((s, r) => s + r.valorCentavos, 0);
  const hasFilters = q.trim() !== "" || filtroMeio !== "todos" || filtroTipo !== "todos";

  function limpar() {
    setQ("");
    setFiltroMeio("todos");
    setFiltroTipo("todos");
  }

  return (
    <div className="orc-page">
      <div className="lanc-head">
        <div>
          <h1 className="orc-title">Lançamentos</h1>
          <div className="orc-mes-nav">
            <Link
              href={`/app/lancamentos?mes=${prev}`}
              onClick={() => track("navegacao_mes", { destino: prev })}
              className="orc-mes-btn"
              aria-label="Mês anterior"
            >
              ‹
            </Link>
            <p className="orc-month" style={{ margin: 0 }}>
              {mesLabel}
            </p>
            <Link
              href={`/app/lancamentos?mes=${next}`}
              onClick={() => track("navegacao_mes", { destino: next })}
              className="orc-mes-btn"
              aria-label="Próximo mês"
            >
              ›
            </Link>
          </div>
        </div>
      </div>

      <div className="lanc-filters">
        <MdTextField label="Buscar no mês" value={q} onChange={setQ} />
        <div className="r2">
          <MdSelect label="Tipo" value={filtroTipo} onChange={setFiltroTipo}>
            <MdOption value="todos">Todos</MdOption>
            <MdOption value="D">Despesas</MdOption>
            <MdOption value="R">Receitas</MdOption>
          </MdSelect>
          <MdSelect label="Pagamento" value={filtroMeio} onChange={setFiltroMeio}>
            <MdOption value="todos">Todos</MdOption>
            <MdOption value="deb">Débito</MdOption>
            <MdOption value="pix">PIX</MdOption>
            <MdOption value="din">Dinheiro</MdOption>
            <MdOption value="cartao">Cartão</MdOption>
          </MdSelect>
        </div>
      </div>

      <div className="orc-total">
        <span>
          {filtered.length} de {rows.length}
        </span>
        <strong>{formatBRL(total)}</strong>
      </div>

      {filtered.length === 0 ? (
        <div className="lanc-empty">
          <p className="aj-help">
            {rows.length === 0
              ? "Nenhum lançamento nesta competência. Toque em Novo lançamento para registrar."
              : "Nenhum resultado com a busca/filtros atuais."}
          </p>
          {hasFilters ? (
            <MdFilledButton onClick={limpar}>Limpar busca e filtros</MdFilledButton>
          ) : null}
        </div>
      ) : (
        <ul className="lanc-list">
          {filtered.map((r) => {
            const parc = parcelaLabel(r);
            return (
              <li key={r.id}>
                <button type="button" className="lanc-row-btn" onClick={() => setEditRow(r)}>
                  <div>
                    <div className="orc-item-name">{r.descricao}</div>
                    <div className="orc-item-sub">
                      {r.dataTransacao} · {r.itemGrupo} · {r.itemNome} · {meioLabel(r)}
                      {parc ? ` · ${parc}` : ""}
                    </div>
                  </div>
                  <strong>{formatBRL(r.valorCentavos)}</strong>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <EditarLancamentoSheet
        row={editRow}
        itens={itens}
        cartoes={cartoes}
        open={!!editRow}
        onClose={() => setEditRow(null)}
        onDeleted={(removed, count) => setUndo({ removed, count })}
      />

      {undo ? (
        <div className="undo-toast" role="status">
          <span>
            {undo.count} excluído{undo.count > 1 ? "s" : ""} · {undoLeft}s
          </span>
          <MdFilledButton
            disabled={pendingUndo}
            onClick={() => {
              startUndo(async () => {
                await desfazerExclusaoAction(undo.removed);
                setUndo(null);
              });
            }}
          >
            Desfazer
          </MdFilledButton>
        </div>
      ) : null}
    </div>
  );
}
