"use client";

import { useMemo, useState } from "react";
import {
  competenciaCartao,
  competenciasParcelas,
  formatCompetenciaBR,
} from "@/domain/competencia";
import { MdOption, MdSelect, MdTextField } from "@/components/material/ui";

export function CompetenciaSimulador({
  cartoes,
}: {
  cartoes: { id: string; apelido: string; diaFechamento: number | null }[];
}) {
  const [cartaoId, setCartaoId] = useState(cartoes[0]?.id ?? "");
  const [data, setData] = useState("2026-05-26");
  const [parcelas, setParcelas] = useState("3");

  const cartao = useMemo(
    () => cartoes.find((c) => c.id === cartaoId) ?? null,
    [cartoes, cartaoId],
  );

  const comps = useMemo(() => {
    if (!cartao) return null;
    const n = Math.max(1, Math.min(60, parseInt(parcelas, 10) || 1));
    return competenciasParcelas(data, n, cartao.diaFechamento);
  }, [cartao, data, parcelas]);

  const primeira = cartao ? competenciaCartao(data, cartao.diaFechamento) : null;

  return (
    <section className="aj-block" style={{ marginTop: 16 }}>
      <h2 className="aj-h2">Simulador de competência</h2>
      <p className="aj-help">
        Prévia da regra de fatura (MO-302). Compra no dia do fechamento ou depois vai para a fatura
        seguinte.
      </p>

      {cartoes.length === 0 ? (
        <p className="aj-msg">Cadastre um cartão ativo para simular.</p>
      ) : (
        <>
          <MdSelect label="Cartão" value={cartaoId} onChange={setCartaoId}>
            {cartoes.map((c) => (
              <MdOption key={c.id} value={c.id}>
                {c.apelido}
                {c.diaFechamento != null ? ` · fecha ${c.diaFechamento}` : " · sem fechamento"}
              </MdOption>
            ))}
          </MdSelect>
          <div className="r2">
            <MdTextField label="Data da compra" type="date" value={data} onChange={setData} />
            <MdTextField label="Parcelas" type="number" value={parcelas} onChange={setParcelas} />
          </div>
          {primeira ? (
            <p className="aj-msg">
              1ª competência: <strong>{formatCompetenciaBR(primeira)}</strong> ({primeira})
            </p>
          ) : null}
          {comps ? (
            <ul className="aj-arch-list">
              {comps.map((c, i) => (
                <li key={`${c}-${i}`}>
                  Parcela {i + 1}/{comps.length} · {formatCompetenciaBR(c)}
                </li>
              ))}
            </ul>
          ) : null}
        </>
      )}
    </section>
  );
}
