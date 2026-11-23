"use client";

import { useMemo, useState } from "react";
import { Campo, CampoData, Select } from "@meu-orcamento/design-system";
import { competenciaCartao, competenciasParcelas, formatCompetenciaBR } from "@/domain/competencia";

export type CartaoSimulador = {
  id: string;
  apelido: string;
  diaFechamento: number | null;
};

export function SimuladorTela({ cartoes }: { cartoes: CartaoSimulador[] }) {
  const [cartaoId, setCartaoId] = useState(cartoes[0]?.id ?? "");
  const [data, setData] = useState("2026-05-26");
  const [parcelas, setParcelas] = useState("3");
  const cartao = useMemo(() => cartoes.find((item) => item.id === cartaoId) ?? null, [cartoes, cartaoId]);
  const quantidade = Math.max(1, Math.min(60, parseInt(parcelas, 10) || 1));
  const competencias = cartao ? competenciasParcelas(data, quantidade, cartao.diaFechamento) : null;
  const primeira = cartao ? competenciaCartao(data, cartao.diaFechamento) : null;

  return (
    <section>
      <h2>Simulador de competência</h2>
      <p className="mo-ajustes__apoio">
        Prévia da regra de fatura. Compra no dia do fechamento ou depois vai para a fatura seguinte. Nada é gravado.
      </p>
      {cartoes.length === 0 ? (
        <p>Cadastre um cartão ativo para simular.</p>
      ) : (
        <>
          <Select
            id="simulador-cartao"
            rotulo="Cartão"
            valor={cartaoId}
            onMudar={setCartaoId}
            grupos={[
              {
                rotulo: "Cartões",
                opcoes: cartoes.map((item) => ({
                  valor: item.id,
                  rotulo:
                    item.diaFechamento != null
                      ? `${item.apelido} · fecha ${item.diaFechamento}`
                      : `${item.apelido} · sem fechamento`,
                })),
              },
            ]}
          />
          <div className="mo-simulador__campos">
            <CampoData id="simulador-data" rotulo="Data da compra" valor={data} onMudar={setData} />
            <Campo id="simulador-parcelas" rotulo="Parcelas" valor={parcelas} teclado="numerico" onMudar={setParcelas} />
          </div>
          {primeira ? (
            <p>
              1ª competência: <strong>{formatCompetenciaBR(primeira)}</strong>
            </p>
          ) : null}
          {competencias ? (
            <ul className="mo-ajustes__lista">
              {competencias.map((competencia, indice) => (
                <li key={`${competencia}-${indice}`}>
                  Parcela {indice + 1}/{competencias.length} · {formatCompetenciaBR(competencia)}
                </li>
              ))}
            </ul>
          ) : null}
        </>
      )}
    </section>
  );
}
