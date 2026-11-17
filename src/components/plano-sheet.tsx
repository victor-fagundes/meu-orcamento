"use client";

import { useState, useTransition } from "react";
import { salvarPlanoAction } from "@/app/actions/plano";
import { TIPOS_LABEL, type TipoOrcamento } from "@/domain/catalog";
import { fromCents, toCents } from "@/domain/money";
import {
  MESES_LABEL,
  aplicarATodos,
  copiarAnoAnterior,
  copiarMesAnterior,
  parsePlanoFromJson,
} from "@/domain/plano";
import { indiceMesAberto } from "@/components/arquivar-rotulo";
import { MaterialSheet } from "@/components/material/sheet";
import { MdFilledButton, MdOutlinedButton, MdTextButton, MdTextField } from "@/components/material/ui";

function centsToInput(cents: number): string {
  return fromCents(cents).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function inputsToCents(valores: string[]): number[] {
  return valores.map((s) => toCents(s));
}

export function PlanoSheet({
  item,
  open,
  onClose,
  competencia,
}: {
  item: {
    id: string;
    nome: string;
    tipo: string;
    grupo: string;
    planoJson: string;
  } | null;
  open: boolean;
  onClose: () => void;
  competencia: string;
}) {
  const [valores, setValores] = useState<string[]>(Array(12).fill("0,00"));
  const [bulk, setBulk] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const [aberto, setAberto] = useState<string | null>(null);
  const chave = item && open ? item.id : null;
  if (chave !== aberto) {
    setAberto(chave);
    if (item && open) {
      setValores(parsePlanoFromJson(item.planoJson).map(centsToInput));
      setBulk("");
      setMsg(null);
      setError(null);
    }
  }

  if (!open || !item) return null;

  const mesCorrente = new Date().getMonth();
  const mesAberto = indiceMesAberto(competencia);

  return (
    <MaterialSheet open={open} onClose={onClose} title={item.nome}>
        <p className="sheet-sub">
          {TIPOS_LABEL[item.tipo as TipoOrcamento] ?? item.tipo} · {item.grupo} · valor planejado por
          mês
        </p>

        <div className="plano-bulk">
          <MdTextField label="Mesmo valor todo mês" value={bulk} onChange={setBulk} inputMode="decimal" />
          <MdOutlinedButton
            onClick={() => {
              setValores(aplicarATodos(toCents(bulk)).map(centsToInput));
              setMsg("Valor aplicado aos 12 meses (ainda não salvo).");
            }}
          >
            Aplicar a todos
          </MdOutlinedButton>
        </div>

        <div className="plano-grid">
          {MESES_LABEL.map((m, n) => (
            <MdTextField
              key={m}
              label={m}
              value={valores[n] ?? ""}
              inputMode="decimal"
              sheetFocus={n === mesAberto}
              onChange={(v) => {
                const next = [...valores];
                next[n] = v;
                setValores(next);
              }}
            />
          ))}
        </div>

        <div className="plano-copy">
          <MdOutlinedButton
            onClick={() => {
              setValores(copiarMesAnterior(inputsToCents(valores), mesCorrente).map(centsToInput));
              setMsg(
                mesCorrente === 0
                  ? "Janeiro não tem mês anterior neste ano."
                  : `Copiado ${MESES_LABEL[mesCorrente - 1]} → ${MESES_LABEL[mesCorrente]}.`,
              );
            }}
          >
            Copiar mês anterior
          </MdOutlinedButton>
          <MdOutlinedButton
            onClick={() => {
              copiarAnoAnterior(inputsToCents(valores));
              setMsg("Ainda não há histórico do ano anterior neste MVP.");
            }}
          >
            Copiar ano anterior
          </MdOutlinedButton>
        </div>

        {msg ? <p className="aj-msg">{msg}</p> : null}
        {error ? <p className="sheet-error" role="alert">{error}</p> : null}

        <div className="sheet-actions">
          <MdTextButton onClick={onClose} disabled={pending}>
            Cancelar
          </MdTextButton>
          <MdFilledButton
            disabled={pending}
            onClick={() => {
              start(async () => {
                const res = await salvarPlanoAction({ itemId: item.id, mesesBRL: valores });
                if (!res.ok) {
                  setError(res.error);
                  return;
                }
                onClose();
              });
            }}
          >
            {pending ? "Salvando…" : "Salvar"}
          </MdFilledButton>
        </div>
    </MaterialSheet>
  );
}
