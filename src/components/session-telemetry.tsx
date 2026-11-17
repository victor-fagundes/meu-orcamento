"use client";

import { useEffect } from "react";
import { track } from "@/lib/telemetry";

/** Envia a duração da sessão ao sair da aba. Sem identificador de usuário. */
export function SessionTelemetry() {
  useEffect(() => {
    const start = Date.now();
    const send = () => {
      const segundos = Math.round((Date.now() - start) / 1000);
      if (segundos > 0) track("sessao_duracao", { segundos });
    };
    window.addEventListener("pagehide", send);
    return () => window.removeEventListener("pagehide", send);
  }, []);
  return null;
}
