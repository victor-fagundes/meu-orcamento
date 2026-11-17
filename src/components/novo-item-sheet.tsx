"use client";

import { useState, useTransition } from "react";
import { criarItemAction } from "@/app/actions/itens";
import { TIPOS_LABEL, type TipoOrcamento } from "@/domain/catalog";
import { MaterialSheet } from "@/components/material/sheet";
import { MdFilledButton, MdTextButton, MdTextField } from "@/components/material/ui";

export function NovoItemSheet({
  tipo,
  grupos,
  open,
  onClose,
}: {
  tipo: TipoOrcamento;
  grupos: string[];
  open: boolean;
  onClose: () => void;
}) {
  const [grupo, setGrupo] = useState("");
  const [nome, setNome] = useState("");
  const [plano, setPlano] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  if (!open) return null;

  function resetAndClose() {
    setGrupo("");
    setNome("");
    setPlano("");
    setError(null);
    onClose();
  }

  return (
    <MaterialSheet open={open} onClose={resetAndClose} title="Novo item">
        <p className="sheet-sub">{TIPOS_LABEL[tipo]}</p>

        <MdTextField label="Categoria" value={grupo} onChange={setGrupo} />
        {grupos.length ? <p className="sheet-sub">Existentes: {grupos.join(", ")}</p> : null}
        <MdTextField label="Nome do item" value={nome} onChange={setNome} />
        <MdTextField
          label="Valor planejado por mês (R$)"
          type="number"
          value={plano}
          onChange={setPlano}
          inputMode="decimal"
        />

        {error ? <p className="sheet-error" role="alert">{error}</p> : null}

        <div className="sheet-actions">
          <MdTextButton onClick={resetAndClose} disabled={pending}>
            Cancelar
          </MdTextButton>
          <MdFilledButton
            disabled={pending}
            onClick={() => {
              start(async () => {
                const planoMensalBRL = plano.trim() === "" ? undefined : Number(plano.replace(",", "."));
                const res = await criarItemAction({
                  tipo,
                  grupo,
                  nome,
                  planoMensalBRL,
                });
                if (!res.ok) {
                  setError(res.error);
                  return;
                }
                resetAndClose();
              });
            }}
          >
            {pending ? "Salvando…" : "Salvar"}
          </MdFilledButton>
        </div>
    </MaterialSheet>
  );
}
