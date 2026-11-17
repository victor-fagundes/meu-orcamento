"use client";

import Link from "next/link";
import { track } from "@/lib/telemetry";
import { useMemo, useState } from "react";
import { TIPOS_LABEL, type TipoOrcamento } from "@/domain/catalog";
import { formatBRL } from "@/domain/money";
import { MdFilledButton, MdOption, MdSelect } from "@/components/material/ui";
import { collapseDonutGroups } from "@/components/resumo-donut";
import { labelCompetencia, shiftCompetencia } from "@/lib/competencia-nav";

export type ResumoItem = {
  id: string;
  tipo: string;
  grupo: string;
  nome: string;
  planoMes: number;
};

export type ResumoLanc = {
  id: string;
  itemId: string;
  valorCentavos: number;
  meio: string;
  cartaoId: string | null;
  competencia: string;
  itemTipo: string;
  itemGrupo: string;
};

export type ResumoCartao = { id: string; apelido: string };

const TIPOS: TipoOrcamento[] = ["R", "F", "V", "E"];
const CHIP: Record<TipoOrcamento, string> = {
  R: "Receitas",
  F: "Fixas",
  V: "Variáveis",
  E: "Anuais",
};
const COLORS = [
  "var(--mo-chart-1)",
  "var(--mo-chart-2)",
  "var(--mo-chart-3)",
  "var(--mo-chart-4)",
  "var(--mo-chart-5)",
];

export function ResumoDashboard({
  competencia,
  itens,
  lancamentos,
  cartoes,
}: {
  competencia: string;
  itens: ResumoItem[];
  lancamentos: ResumoLanc[];
  cartoes: ResumoCartao[];
}) {
  const [pg, setPg] = useState("*");
  const [cg, setCg] = useState("*");

  const grupos = useMemo(
    () => [...new Set(itens.map((i) => i.grupo))].sort((a, b) => a.localeCompare(b, "pt-BR")),
    [itens],
  );

  const filteredLanc = useMemo(() => {
    return lancamentos.filter((l) => {
      if (cg !== "*" && l.itemGrupo !== cg) return false;
      if (pg === "*") return true;
      if (pg === "deb" || pg === "pix" || pg === "din") return l.meio === pg;
      return l.cartaoId === pg;
    });
  }, [lancamentos, pg, cg]);

  const pgAll = pg === "*";

  const planoDespesas = itens
    .filter((i) => i.tipo !== "R")
    .reduce((s, i) => s + i.planoMes, 0);

  const gasto = filteredLanc
    .filter((l) => l.itemTipo !== "R")
    .reduce((s, l) => s + l.valorCentavos, 0);

  const saldo = planoDespesas - gasto;
  const pctOrcado = planoDespesas > 0 ? Math.round((gasto / planoDespesas) * 100) : null;

  const porTipo = TIPOS.map((t) => {
    const plano = itens.filter((i) => i.tipo === t).reduce((s, i) => s + i.planoMes, 0);
    const real = filteredLanc
      .filter((l) => l.itemTipo === t)
      .reduce((s, l) => s + l.valorCentavos, 0);
    return { t, plano, real };
  });

  const donut = useMemo(() => {
    const map = new Map<string, number>();
    filteredLanc
      .filter((l) => l.itemTipo !== "R")
      .forEach((l) => map.set(l.itemGrupo, (map.get(l.itemGrupo) ?? 0) + l.valorCentavos));
    const entries = collapseDonutGroups([...map.entries()]);
    const tot = entries.reduce((s, [, v]) => s + v, 0);
    return { entries, tot };
  }, [filteredLanc]);

  const hoje = new Date();
  const mesAtual = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}`;
  const isMesCorrente = competencia === mesAtual;
  const dia = hoje.getDate();
  const dim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();
  const media = isMesCorrente && dia > 0 ? Math.round(gasto / dia) : null;
  const restam = isMesCorrente ? dim - dia : null;

  const prev = shiftCompetencia(competencia, -1);
  const next = shiftCompetencia(competencia, 1);

  function limpar() {
    setPg("*");
    setCg("*");
  }

  const C = 2 * Math.PI * 38;
  const donutSegs = (() => {
    let off = 0;
    return donut.entries.map(([name, val], i) => {
      const len = donut.tot > 0 ? (val / donut.tot) * C : 0;
      const seg = { name, val, len, off, color: COLORS[i % COLORS.length]! };
      off += len;
      return seg;
    });
  })();

  return (
    <div className="resumo-page">
      <div className="lanc-head">
        <div>
          <h1 className="orc-title">Resumo</h1>
          <p className="orc-month">Visão do mês selecionado</p>
        </div>
      </div>

      <div className="orc-mes-nav">
        <Link href={`/app/resumo?mes=${prev}`} className="orc-mes-btn" aria-label="Mês anterior" onClick={() => track("navegacao_mes", { destino: prev })}>
          ‹
        </Link>
        <p className="orc-month" style={{ margin: 0 }}>
          {labelCompetencia(competencia)}
        </p>
        <Link href={`/app/resumo?mes=${next}`} className="orc-mes-btn" aria-label="Próximo mês" onClick={() => track("navegacao_mes", { destino: next })}>
          ›
        </Link>
      </div>

      <div className="resumo-filters">
        <MdSelect label="Pagamento" value={pg} onChange={setPg}>
          <MdOption value="*">Todas</MdOption>
          <MdOption value="deb">Débito</MdOption>
          <MdOption value="pix">PIX</MdOption>
          <MdOption value="din">Dinheiro</MdOption>
          {cartoes.map((c) => (
            <MdOption key={c.id} value={c.id}>
              {c.apelido}
            </MdOption>
          ))}
        </MdSelect>
        <MdSelect label="Categoria" value={cg} onChange={setCg}>
          <MdOption value="*">Todas</MdOption>
          {grupos.map((g) => (
            <MdOption key={g} value={g}>
              {g}
            </MdOption>
          ))}
        </MdSelect>
        {pg !== "*" || cg !== "*" ? <MdFilledButton onClick={limpar}>Limpar filtros</MdFilledButton> : null}
      </div>

      {isMesCorrente ? (
        <div className="resumo-ritmo">
          <span>
            Média diária: <b>{formatBRL(media ?? 0)}</b>
          </span>
          <span>
            Restam <b>{restam}</b> dias no mês
          </span>
        </div>
      ) : null}

      <div className="resumo-g3">
        <Link href={`/app/orcamento?mes=${competencia}`} className="resumo-kb resumo-hero">
          <div className="sp resumo-eye">Ainda pode gastar</div>
          <div className={`am${pgAll && saldo < 0 ? " er" : ""}`}>{pgAll ? formatBRL(saldo) : "—"}</div>
          <div className="sp">
            {pgAll
              ? saldo >= 0
                ? `${pctOrcado ?? 0}% do orçado de despesas neste mês`
                : "orçado menos gasto · passou do orçado"
              : "não se aplica ao filtro de pagamento"}
          </div>
          {pgAll && pctOrcado != null ? (
            <div className="resumo-track">
              <i style={{ width: `${Math.min(100, pctOrcado)}%` }} />
            </div>
          ) : null}
        </Link>
        <Link href={`/app/orcamento?mes=${competencia}`} className="resumo-kb">
          <div className="sp">Total orçado</div>
          <div className="am">{pgAll ? formatBRL(planoDespesas) : "—"}</div>
          <div className="sp">{pgAll ? "despesas previstas no mês" : "não se aplica ao filtro de pagamento"}</div>
        </Link>
        <Link href="/app/lancamentos" className="resumo-kb">
          <div className="sp">Total gasto</div>
          <div className={`am${pgAll && gasto > planoDespesas ? " er" : ""}`}>{formatBRL(gasto)}</div>
          <div className="sp">
            {pgAll && pctOrcado != null
              ? `${pctOrcado}% do orçado`
              : `${filteredLanc.filter((l) => l.itemTipo !== "R").length} lançamentos`}
          </div>
        </Link>
      </div>

      <div className="resumo-tipos">
        {porTipo.map(({ t, plano, real }) => (
          <div key={t} className="resumo-kb">
            <div className="sp">{TIPOS_LABEL[t]}</div>
            <div className="am">{formatBRL(real)}</div>
            <div className="sp">{pgAll ? `planejado ${formatBRL(plano)}` : "—"}</div>
            <Link href={`/app/orcamento?mes=${competencia}&tipo=${t}`} className="resumo-det">
              Ver detalhes
            </Link>
          </div>
        ))}
      </div>

      <div className="resumo-charts">
        <div className="resumo-kb">
          <h3 className="aj-h2" style={{ marginTop: 0 }}>
            Gastos por categoria
          </h3>
          {cg !== "*" ? (
            <p className="aj-help">Rosca oculta com filtro de categoria. Limpe o filtro para ver a composição.</p>
          ) : donut.tot === 0 ? (
            <p className="aj-help">Sem despesas no período.</p>
          ) : (
            <div className="resumo-donut">
              <svg viewBox="0 0 120 120" role="img" aria-label="Gastos por categoria">
                {donutSegs.map((s) => (
                  <circle
                    key={s.name}
                    cx="60"
                    cy="60"
                    r="38"
                    fill="none"
                    stroke={s.color}
                    strokeWidth="24"
                    strokeDasharray={`${s.len} ${C - s.len}`}
                    strokeDashoffset={-s.off}
                    transform="rotate(-90 60 60)"
                  >
                    <title>{`${s.name}: ${formatBRL(s.val)}`}</title>
                  </circle>
                ))}
              </svg>
              <div className="resumo-legend">
                {donutSegs.map((s) => (
                  <div key={s.name}>
                    <span>
                      <i style={{ background: s.color }} />
                      {s.name}
                    </span>
                    <b>{Math.round((s.val / donut.tot) * 100)}%</b>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="resumo-kb">
          <h3 className="aj-h2" style={{ marginTop: 0 }}>
            Planejado × realizado
          </h3>
          <BarsChart porTipo={porTipo} showPlano={pgAll} />
        </div>
      </div>
    </div>
  );
}

function BarsChart({
  porTipo,
  showPlano,
}: {
  porTipo: { t: TipoOrcamento; plano: number; real: number }[];
  showPlano: boolean;
}) {
  const vals = porTipo.flatMap((x) => (showPlano ? [x.plano, x.real] : [x.real]));
  const m0 = Math.max(...vals, 1);
  const mx = Math.ceil(m0 / 100) * 100;
  const W = 520;
  const H = 220;
  const l0 = 48;
  const pb = 28;
  const pt = 8;
  const bw = 18;
  const gw = (W - l0 - 8) / porTipo.length;

  return (
    <>
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Planejado e realizado por tipo">
      {[0, 1, 2, 3, 4].map((g) => {
        const y = H - pb - ((H - pb - pt) * g) / 4;
        return (
          <g key={g}>
            <line x1={l0} x2={W - 8} y1={y} y2={y} stroke="currentColor" opacity={0.12} />
            <text x={l0 - 6} y={y + 4} textAnchor="end" fontSize="10" fill="currentColor">
              {Math.round((mx * g) / 4 / 100)}
            </text>
          </g>
        );
      })}
      {porTipo.map((row, i) => {
        const x0 = l0 + gw * i + (gw - bw * 2 - 4) / 2;
        const hP = ((H - pb - pt) * row.plano) / mx;
        const hR = ((H - pb - pt) * row.real) / mx;
        return (
          <g key={row.t}>
            {showPlano ? (
              <rect x={x0} y={H - pb - hP} width={bw} height={hP} rx={3} fill="var(--md-sys-color-primary)">
                <title>{`${TIPOS_LABEL[row.t]} · Planejado: ${formatBRL(row.plano)}`}</title>
              </rect>
            ) : null}
            <rect
              x={showPlano ? x0 + bw + 4 : x0 + bw / 2}
              y={H - pb - hR}
              width={bw}
              height={hR}
              rx={3}
              fill="var(--mo-mark-realizado)"
            >
              <title>{`${TIPOS_LABEL[row.t]} · Realizado: ${formatBRL(row.real)}`}</title>
            </rect>
            <text x={l0 + gw * i + gw / 2} y={H - 8} textAnchor="middle" fontSize="11" fill="currentColor">
              {CHIP[row.t]}
            </text>
          </g>
        );
      })}
    </svg>
    <div className="bars-legend">
      <span>
        <i style={{ background: "var(--md-sys-color-primary)" }} /> Planejado
      </span>
      <span>
        <i style={{ background: "var(--mo-mark-realizado)" }} /> Realizado
      </span>
    </div>
    </>
  );
}
