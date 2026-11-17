"use client";

import { useEffect, useState } from "react";
import type { AlertaMes } from "@/domain/alertas";
import { bannerFromAlertas } from "@/domain/alertas";
import { MaterialSheet } from "@/components/material/sheet";
import { MdFilledButton } from "@/components/material/ui";
import { track } from "@/lib/telemetry";

export function AlertBanner({ alertas }: { alertas: AlertaMes[] }) {
  const [open, setOpen] = useState(false);
  const banner = bannerFromAlertas(alertas);
  useEffect(() => {
    if (alertas.length === 0) return;
    track("alerta_acionado", { quantidade: alertas.length });
  }, [alertas.length]);
  if (!banner) return null;

  return (
    <>
      <div className={`alert-banner${banner.nivel === "er" ? " er" : ""}`}>
        <span aria-hidden>⚠</span>
        <div>
          <b>{banner.msg}</b>
          {banner.more > 0 ? (
            <div className="sp">
              +{banner.more} outro{banner.more > 1 ? "s" : ""} alerta{banner.more > 1 ? "s" : ""} ·
              veja o sininho
            </div>
          ) : null}
        </div>
        <button type="button" className="alert-bell" onClick={() => setOpen(true)} aria-label="Alertas">
          🔔{alertas.length > 0 ? <em>{alertas.length}</em> : null}
        </button>
      </div>

      <MaterialSheet open={open} onClose={() => setOpen(false)} title="Alertas do mês">
        {alertas.length === 0 ? (
          <p className="aj-help">Nenhum alerta no mês atual.</p>
        ) : (
          <ul className="notif-list">
            {alertas.map((a, i) => (
              <li key={`${a.msg}-${i}`} className="notif-item">
                <div className="lb">
                  {a.nivel === "er" ? "Estouro" : "Atenção"} · {a.msg}
                </div>
                <div className="sp">{a.escopo === "total" ? "Total do mês" : `Categoria · ${a.cat}`}</div>
              </li>
            ))}
          </ul>
        )}
        <MdFilledButton onClick={() => setOpen(false)} sheetFocus>Fechar</MdFilledButton>
      </MaterialSheet>
    </>
  );
}
