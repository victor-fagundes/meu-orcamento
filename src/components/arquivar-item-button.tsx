"use client";

import { useState, useTransition } from "react";
import { arquivarItemAction } from "@/app/actions/itens";

export function ArquivarItemButton({ itemId, nome }: { itemId: string; nome: string }) {
  const [arm, setArm] = useState(false);
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      className="orc-arch"
      disabled={pending}
      title={`Arquivar ${nome}`}
      onClick={(e) => {
        e.stopPropagation();
        if (!arm) {
          setArm(true);
          return;
        }
        start(async () => {
          await arquivarItemAction(itemId);
          setArm(false);
        });
      }}
    >
      {pending ? "…" : arm ? "Confirmar?" : "Arquivar"}
    </button>
  );
}
