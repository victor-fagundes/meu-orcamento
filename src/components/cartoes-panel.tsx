"use client";

import { useState, useTransition } from "react";
import { criarCartaoAction, inativarCartaoAction } from "@/app/actions/cartoes";
import { cartaoSemFechamento } from "@/domain/cartoes";
import { MdFilledButton, MdTextField } from "@/components/material/ui";

export type CartaoView = {
  id: string;
  apelido: string;
  diaFechamento: number | null;
  diaVencimento: number | null;
  instituicao: string | null;
  ultimos4: string | null;
  ativo: number;
};

export function CartoesPanel({ cartoes }: { cartoes: CartaoView[] }) {
  const [apelido, setApelido] = useState("");
  const [fechamento, setFechamento] = useState("");
  const [vencimento, setVencimento] = useState("");
  const [instituicao, setInstituicao] = useState("");
  const [ultimos4, setUltimos4] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const ativos = cartoes.filter((c) => c.ativo === 1);
  const inativos = cartoes.filter((c) => c.ativo !== 1);

  return (
    <section className="aj-block" style={{ marginTop: 16 }}>
      <h2 className="aj-h2">Cartões</h2>
      <p className="aj-help">
        Apelido obrigatório. Dia de fechamento recomendado — sem ele, a competência usa o mês da
        compra.
      </p>

      <ul className="aj-arch-list">
        {ativos.map((c) => (
          <li key={c.id} className="cartao-row">
            <div>
              <strong>{c.apelido}</strong>
              {c.ultimos4 ? <span className="orc-tag">•••• {c.ultimos4}</span> : null}
              <div className="orc-item-sub">
                {c.instituicao ? `${c.instituicao} · ` : ""}
                {c.diaFechamento != null
                  ? `Fecha dia ${c.diaFechamento}`
                  : "Sem dia de fechamento"}
                {c.diaVencimento != null ? ` · Vence dia ${c.diaVencimento}` : ""}
              </div>
              {cartaoSemFechamento(c.diaFechamento) ? (
                <p className="cartao-warn">
                  Sem fechamento: competência = mês da compra. Alguns bancos tratam o dia do
                  fechamento de forma diferente — confira no app do cartão.
                </p>
              ) : null}
            </div>
            <button
              type="button"
              className="text-btn"
              disabled={pending}
              onClick={() =>
                start(async () => {
                  await inativarCartaoAction(c.id);
                })
              }
            >
              Inativar
            </button>
          </li>
        ))}
        {ativos.length === 0 ? <li className="aj-msg">Nenhum cartão ativo.</li> : null}
      </ul>

      {inativos.length > 0 ? (
        <>
          <h3 className="aj-h2">
            Inativos
          </h3>
          <ul className="aj-arch-list">
            {inativos.map((c) => (
              <li key={c.id}>
                {c.apelido}
                <span className="orc-item-sub"> · não aparece em novos lançamentos</span>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <h3 className="aj-h2">
        Novo cartão
      </h3>
      <div className="cartao-form">
        <MdTextField label="Apelido *" value={apelido} onChange={setApelido} />
        <div className="r2">
          <MdTextField label="Fechamento (1–28)" type="number" value={fechamento} onChange={setFechamento} />
          <MdTextField label="Vencimento (1–28)" type="number" value={vencimento} onChange={setVencimento} />
        </div>
        <div className="r2">
          <MdTextField label="Instituição" value={instituicao} onChange={setInstituicao} />
          <MdTextField label="Últimos 4" value={ultimos4} onChange={setUltimos4} inputMode="numeric" />
        </div>
        {error ? <p className="sheet-error" role="alert">{error}</p> : null}
        <div className="aj-actions">
        <MdFilledButton
          disabled={pending}
          onClick={() => {
            start(async () => {
              const res = await criarCartaoAction({
                apelido,
                diaFechamento: fechamento,
                diaVencimento: vencimento,
                instituicao,
                ultimos4,
              });
              if (!res.ok) {
                setError(res.error);
                return;
              }
              setApelido("");
              setFechamento("");
              setVencimento("");
              setInstituicao("");
              setUltimos4("");
              setError(null);
            });
          }}
        >
          {pending ? "Salvando…" : "Adicionar cartão"}
        </MdFilledButton>
        </div>
      </div>
    </section>
  );
}
