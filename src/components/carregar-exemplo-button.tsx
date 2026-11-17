"use client";

import { useState, useTransition } from "react";
import { carregarExemploAction } from "@/app/actions/catalog";
import { MdOutlinedButton } from "@/components/material/ui";

export function CarregarExemploButton() {
  const [pending, start] = useTransition();
  const [arm, setArm] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <div className="aj-block">
      <h2 className="aj-h2">Dados de exemplo</h2>
      <p className="aj-help">
        Preenche o planejamento de alguns itens com valores ilustrativos. Não cria lançamentos. Só
        roda se você confirmar.
      </p>
      <div className="aj-actions">
      <MdOutlinedButton
        disabled={pending}
        onClick={() => {
          if (!arm) {
            setArm(true);
            setMsg("Toque de novo para confirmar.");
            return;
          }
          start(async () => {
            const res = await carregarExemploAction();
            setArm(false);
            if (res.ok) setMsg(`${res.updated} itens atualizados com plano de exemplo.`);
            else setMsg(res.error);
          });
        }}
      >
        {pending ? "Carregando…" : arm ? "Confirmar exemplo?" : "Carregar exemplo"}
      </MdOutlinedButton>
      </div>
      {msg ? <p className="aj-msg">{msg}</p> : null}
    </div>
  );
}
