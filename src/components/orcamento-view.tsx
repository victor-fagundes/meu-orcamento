"use client";

import Link from "next/link";
import { track } from "@/lib/telemetry";
import { useEffect, useMemo, useState } from "react";
import { TIPOS_LABEL, type TipoOrcamento } from "@/domain/catalog";
import { ordenarGrupos } from "@/domain/item-unico";
import type { AlertaMes, LimitesConfig } from "@/domain/alertas";
import { limiteDaCategoria } from "@/domain/alertas";
import {
  barraPctVisual,
  estadoConsumo,
  textoConsumoDespesa,
  textoConsumoReceita,
} from "@/domain/consumo";
import { formatBRL } from "@/lib/money-format";
import { shiftCompetencia } from "@/lib/competencia-nav";
import { MdFilterChip, MdOutlinedButton, MdProgress } from "@/components/material/ui";
import { AlertBanner } from "./alert-banner";
import { ArquivarItemButton } from "./arquivar-item-button";
import { NovoItemSheet } from "./novo-item-sheet";
import { PlanoSheet } from "./plano-sheet";

export type OrcamentoItemView = {
  id: string;
  tipo: string;
  grupo: string;
  nome: string;
  planoMes: number;
  realizadoMes: number;
  divida: boolean;
  planoJson: string;
};

const TIPOS: TipoOrcamento[] = ["R", "F", "V", "E"];

const CHIP: Record<TipoOrcamento, string> = {
  R: "Receitas",
  F: "Fixas",
  V: "Variáveis",
  E: "Anuais",
};

export function OrcamentoView({
  itens,
  mesLabel,
  competencia,
  limites,
  alertas,
  initialTipo = "F",
}: {
  itens: OrcamentoItemView[];
  mesLabel: string;
  competencia: string;
  limites: LimitesConfig;
  alertas: AlertaMes[];
  initialTipo?: TipoOrcamento;
}) {
  const [tipo, setTipo] = useState<TipoOrcamento>(initialTipo);
  useEffect(() => {
    setTipo(initialTipo);
  }, [initialTipo]);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [sheetOpen, setSheetOpen] = useState(false);
  const [planoItem, setPlanoItem] = useState<OrcamentoItemView | null>(null);

  const prev = shiftCompetencia(competencia, -1);
  const next = shiftCompetencia(competencia, 1);

  const filtered = useMemo(() => itens.filter((i) => i.tipo === tipo), [itens, tipo]);
  const grupos = useMemo(() => {
    const names = [...new Set(filtered.map((i) => i.grupo))];
    const rows = names.map((grupo) => {
      const li = filtered.filter((i) => i.grupo === grupo);
      return {
        grupo,
        plano: li.reduce((s, i) => s + i.planoMes, 0),
        realizado: li.reduce((s, i) => s + i.realizadoMes, 0),
      };
    });
    return ordenarGrupos(rows).map((row) => row.grupo);
  }, [filtered]);
  const gruposAllTipo = useMemo(
    () =>
      [...new Set(itens.filter((i) => i.tipo === tipo).map((i) => i.grupo))].sort((a, b) =>
        a.localeCompare(b, "pt-BR"),
      ),
    [itens, tipo],
  );

  const totalP = filtered.reduce((s, i) => s + i.planoMes, 0);
  const totalR = filtered.reduce((s, i) => s + i.realizadoMes, 0);

  return (
    <div className="orc-page">
      <h1 className="orc-title">Orçamento</h1>
      <div className="orc-mes-nav">
        <Link href={`/app/orcamento?mes=${prev}`} className="orc-mes-btn" aria-label="Mês anterior" onClick={() => track("navegacao_mes", { destino: prev })}>
          ‹
        </Link>
        <p className="orc-month" style={{ margin: 0 }}>
          {mesLabel}
        </p>
        <Link href={`/app/orcamento?mes=${next}`} className="orc-mes-btn" aria-label="Próximo mês" onClick={() => track("navegacao_mes", { destino: next })}>
          ›
        </Link>
      </div>

      <AlertBanner alertas={alertas} />

      <div className="orc-chips" role="tablist" aria-label="Tipo">
        {TIPOS.map((t) => (
          <MdFilterChip key={t} label={CHIP[t]} selected={tipo === t} onClick={() => setTipo(t)} />
        ))}
      </div>

      <div className="orc-total">
        <span>{TIPOS_LABEL[tipo]}</span>
        <strong>
          {formatBRL(totalR)} <span className="muted">/ {formatBRL(totalP)}</span>
        </strong>
      </div>

      <div className="orc-list">
        {grupos.map((g) => {
          const li = filtered.filter((i) => i.grupo === g);
          const p = li.reduce((s, i) => s + i.planoMes, 0);
          const r = li.reduce((s, i) => s + i.realizadoMes, 0);
          const isOpen = !!open[g];
          const lim = tipo === "R" ? 80 : limiteDaCategoria(limites, g);
          const pct = barraPctVisual(r, p);
          const est = estadoConsumo(r, p, lim);
          const hint =
            tipo === "R"
              ? textoConsumoReceita(r, p, formatBRL)
              : textoConsumoDespesa(r, p, formatBRL, lim);
          return (
            <div key={g} className={`orc-cat est-${est}`}>
              <button
                type="button"
                className="orc-cat-head"
                onClick={() => setOpen((o) => ({ ...o, [g]: !o[g] }))}
              >
                <span>{g}</span>
                <span>
                  {formatBRL(r)} <span className="muted">/ {formatBRL(p)}</span> {isOpen ? "▴" : "▾"}
                </span>
              </button>
              <div className="orc-bar">
                <MdProgress
                  value={pct / 100}
                  tone={est === "estourado" || est === "atingido" ? "over" : est === "preventivo" ? "warn" : "ok"}
                />
              </div>
              <p className={`orc-hint est-${est}`}>{hint}</p>
              {isOpen
                ? li.map((i) => {
                    const iEst = estadoConsumo(i.realizadoMes, i.planoMes);
                    return (
                      <div
                        key={i.id}
                        className={`orc-item${iEst === "sem_planejado" ? " sem-plan" : ""}`}
                      >
                        <button
                          type="button"
                          className="orc-item-main"
                          onClick={() => setPlanoItem(i)}
                        >
                          <div className="orc-item-name">
                            {i.nome}
                            {i.divida ? <span className="orc-tag">dívida</span> : null}
                          </div>
                          <div className="orc-item-sub">
                            {iEst === "sem_planejado"
                              ? "Gasto sem orçamento planejado"
                              : `planejado ${formatBRL(i.planoMes)} · toque para editar`}
                          </div>
                        </button>
                        <div className="orc-item-right">
                          <strong>{formatBRL(i.realizadoMes)}</strong>
                          <ArquivarItemButton itemId={i.id} nome={i.nome} />
                        </div>
                      </div>
                    );
                  })
                : null}
            </div>
          );
        })}
      </div>

      <MdOutlinedButton onClick={() => setSheetOpen(true)}>Novo item em {TIPOS_LABEL[tipo]}</MdOutlinedButton>

      <NovoItemSheet
        tipo={tipo}
        grupos={gruposAllTipo}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />

      <PlanoSheet
        item={
          planoItem
            ? {
                id: planoItem.id,
                nome: planoItem.nome,
                tipo: planoItem.tipo,
                grupo: planoItem.grupo,
                planoJson: planoItem.planoJson,
              }
            : null
        }
        open={!!planoItem}
        onClose={() => setPlanoItem(null)}
      />
    </div>
  );
}
