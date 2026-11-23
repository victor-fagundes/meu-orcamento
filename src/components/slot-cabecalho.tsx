"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

const SlotContext = createContext<HTMLDivElement | null>(null);
const DefinirSlotContext = createContext<(elemento: HTMLDivElement | null) => void>(() => {});

export function ProvedorSlotCabecalho({ children }: { children: ReactNode }) {
  const [slot, setSlot] = useState<HTMLDivElement | null>(null);
  return (
    <DefinirSlotContext.Provider value={setSlot}>
      <SlotContext.Provider value={slot}>{children}</SlotContext.Provider>
    </DefinirSlotContext.Provider>
  );
}

export function AncoraCabecalho() {
  const definir = useContext(DefinirSlotContext);
  return <div className="mo-cabecalho__acoes" ref={definir} />;
}

export function AcoesNoCabecalho({ children }: { children: ReactNode }) {
  const slot = useContext(SlotContext);
  if (!slot) return null;
  return createPortal(children, slot);
}
