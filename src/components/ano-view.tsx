"use client";

import Link from "next/link";
import { Fragment, useMemo, useState } from "react";
import { TIPOS_LABEL, type TipoOrcamento } from "@/domain/catalog";
import { formatBRL } from "@/domain/money";
import { MESES_LABEL } from "@/domain/plano";
import { MdFilterChip } from "@/components/material/ui";

export type AnoCell = {
  tipo: TipoOrcamento;
  grupo: string;
  /** 12 months cents */
  valores: number[];
};

export function AnoView({
  ano,
  planejado,
  realizado,
}: {
  ano: string;
  planejado: AnoCell[];
  realizado: AnoCell[];
}) {
  const [real, setReal] = useState(false);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const data = real ? realizado : planejado;

  const byTipo = useMemo(() => {
    const map = new Map<TipoOrcamento, AnoCell[]>();
    for (const t of ["R", "F", "V", "E"] as TipoOrcamento[]) map.set(t, []);
    for (const row of data) map.get(row.tipo)?.push(row);
    return map;
  }, [data]);

  function sumTipo(t: TipoOrcamento): number[] {
    const rows = byTipo.get(t) ?? [];
    const out = Array(12).fill(0) as number[];
    for (const r of rows) {
      for (let i = 0; i < 12; i++) out[i]! += r.valores[i] ?? 0;
    }
    return out;
  }

  function sumGrupos(t: TipoOrcamento): { grupo: string; valores: number[] }[] {
    const rows = byTipo.get(t) ?? [];
    const m = new Map<string, number[]>();
    for (const r of rows) {
      const cur = m.get(r.grupo) ?? (Array(12).fill(0) as number[]);
      for (let i = 0; i < 12; i++) cur[i]! += r.valores[i] ?? 0;
      m.set(r.grupo, cur);
    }
    return [...m.entries()]
      .map(([grupo, valores]) => ({ grupo, valores }))
      .sort((a, b) => a.grupo.localeCompare(b.grupo, "pt-BR"));
  }

  const receitas = sumTipo("R");
  const desp = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(
    (i) => (sumTipo("F")[i] ?? 0) + (sumTipo("V")[i] ?? 0) + (sumTipo("E")[i] ?? 0),
  );
  const saldo = receitas.map((r, i) => r - (desp[i] ?? 0));

  const prevAno = String(Number(ano) - 1);
  const nextAno = String(Number(ano) + 1);

  return (
    <div className="ano-page">
      <div className="lanc-head">
        <div>
          <h1 className="orc-title">Ano</h1>
          <p className="orc-month">Tabela anual · {ano}</p>
        </div>
        <div className="ano-toggle">
          <MdFilterChip label="Planejado" selected={!real} onClick={() => setReal(false)} />
          <MdFilterChip label="Realizado" selected={real} onClick={() => setReal(true)} />
        </div>
      </div>

      <div className="orc-mes-nav">
        <Link href={`/app/ano?ano=${prevAno}`} className="orc-mes-btn" aria-label="Ano anterior">
          ‹
        </Link>
        <p className="orc-month" style={{ margin: 0 }}>
          {ano}
        </p>
        <Link href={`/app/ano?ano=${nextAno}`} className="orc-mes-btn" aria-label="Próximo ano">
          ›
        </Link>
      </div>

      <div className="ano-scroll">
        <table className="ano-table">
          <thead>
            <tr>
              <th>Tipo / categoria</th>
              {MESES_LABEL.map((m) => (
                <th key={m}>{m}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(["R", "F", "V", "E"] as TipoOrcamento[]).map((t) => {
              const vals = sumTipo(t);
              const isOpen = !!open[t];
              const grupos = sumGrupos(t);
              return (
                <Fragment key={t}>
                  <tr className="ano-tipo">
                    <td>
                      <button
                        type="button"
                        className="ano-exp"
                        onClick={() => setOpen((o) => ({ ...o, [t]: !o[t] }))}
                      >
                        {isOpen ? "▾" : "▸"} {TIPOS_LABEL[t]}
                      </button>
                    </td>
                    {vals.map((v, i) => (
                      <td key={i} className={v < 0 ? "neg" : undefined}>
                        {formatBRL(v)}
                      </td>
                    ))}
                  </tr>
                  {isOpen
                    ? grupos.map((g) => (
                        <tr key={`${t}-${g.grupo}`} className="ano-cat">
                          <td>{g.grupo}</td>
                          {g.valores.map((v, i) => (
                            <td key={i} className={v < 0 ? "neg" : undefined}>
                              {formatBRL(v)}
                            </td>
                          ))}
                        </tr>
                      ))
                    : null}
                </Fragment>
              );
            })}
            <tr className="ano-total">
              <td>Total despesas</td>
              {desp.map((v, i) => (
                <td key={i}>{formatBRL(v)}</td>
              ))}
            </tr>
            <tr className="ano-saldo">
              <td>Saldo final (R − despesas)</td>
              {saldo.map((v, i) => (
                <td key={i} className={v < 0 ? "neg" : undefined}>
                  {formatBRL(v)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
