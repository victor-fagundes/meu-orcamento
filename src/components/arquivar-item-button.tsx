"use client";

import { useTransition } from "react";
import { arquivarItemAction } from "@/app/actions/itens";
import { nomeAnunciadoArquivar, textoVisivelArquivar, type PassoArquivar } from "@/components/arquivar-rotulo";

export function ArquivarItemButton({
  itemId,
  nome,
  armed,
  onArm,
}: {
  itemId: string;
  nome: string;
  armed: boolean;
  onArm: () => void;
}) {
  const [pending, start] = useTransition();
  const passo: PassoArquivar = pending ? "gravando" : armed ? "armado" : "repouso";

  return (
    <button
      type="button"
      className="orc-arch"
      disabled={pending}
      aria-label={nomeAnunciadoArquivar(nome, passo)}
      onClick={(e) => {
        e.stopPropagation();
        if (pending) return;
        if (!armed) {
          onArm();
          return;
        }
        start(async () => {
          await arquivarItemAction(itemId);
        });
      }}
    >
      {textoVisivelArquivar(nome, passo)}
    </button>
  );
}
