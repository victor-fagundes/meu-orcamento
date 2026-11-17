"use client";

import { useState, useTransition } from "react";
import { salvarLimitesAction } from "@/app/actions/limites";
import { MdFilledButton, MdTextField } from "@/components/material/ui";

export function LimitesPanel({
  globalPct,
  cats,
  grupos,
}: {
  globalPct: number;
  cats: Record<string, number>;
  grupos: string[];
}) {
  const [global, setGlobal] = useState(String(globalPct));
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() => {
    const o: Record<string, boolean> = {};
    for (const g of grupos) o[g] = cats[g] != null;
    return o;
  });
  const [vals, setVals] = useState<Record<string, string>>(() => {
    const o: Record<string, string> = {};
    for (const g of grupos) o[g] = String(cats[g] ?? globalPct);
    return o;
  });
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <section className="aj-block" style={{ marginTop: 16 }}>
      <h2 className="aj-h2">Alertas de limite</h2>
      <p className="aj-help">
        Quando o gasto atingir o percentual do planejado, o app destaca visualmente. 100% = orçamento
        atingido.
      </p>

      <MdTextField
        label="Limite global (todas as categorias)"
        type="number"
        value={global}
        onChange={setGlobal}
      />

      <h3 className="aj-h2">
        Limites por categoria (opcional · sobrescreve o global)
      </h3>
      <ul className="lim-list">
        {grupos.map((g) => (
          <li key={g} className="lim-row">
            <label className="lim-check">
              <input
                type="checkbox"
                checked={!!enabled[g]}
                onChange={(e) => setEnabled((x) => ({ ...x, [g]: e.target.checked }))}
              />
              <span>{g}</span>
            </label>
            <input
              type="number"
              min={1}
              max={100}
              disabled={!enabled[g]}
              value={vals[g] ?? "80"}
              onChange={(e) => setVals((x) => ({ ...x, [g]: e.target.value }))}
            />
            <span className="orc-item-sub">%</span>
          </li>
        ))}
      </ul>

      {msg ? <p className="aj-msg">{msg}</p> : null}

      <div className="aj-actions">
      <MdFilledButton
        disabled={pending}
        onClick={() => {
          start(async () => {
            const catsOut: Record<string, number | null> = {};
            for (const g of grupos) {
              catsOut[g] = enabled[g] ? Number(vals[g]) : null;
            }
            // only send enabled
            const catsFiltered: Record<string, number | null> = {};
            for (const [k, v] of Object.entries(catsOut)) {
              if (v != null) catsFiltered[k] = v;
            }
            const res = await salvarLimitesAction({
              globalPct: Number(global),
              cats: catsFiltered,
            });
            setMsg(res.ok ? "Limites salvos." : res.error);
          });
        }}
      >
        {pending ? "Salvando…" : "Salvar limites"}
      </MdFilledButton>
      </div>
    </section>
  );
}
