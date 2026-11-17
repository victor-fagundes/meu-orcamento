"use client";

import { useState, useTransition } from "react";
import { exportCsvAction, exportJsonAction } from "@/app/actions/export-orcamento";
import { MdOutlinedButton } from "@/components/material/ui";

function download(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ExportPanel() {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <section className="aj-block" style={{ marginTop: 16 }}>
      <h2 className="aj-h2">Exportar dados</h2>
      <p className="aj-help">
        Backup do orçamento com valores em centavos (itens, planejamento, cartões e lançamentos).
      </p>
      <div className="aj-actions">
        <MdOutlinedButton
          disabled={pending}
          onClick={() => {
            start(async () => {
              setError(null);
              const res = await exportJsonAction();
              if (!res.ok) {
                setError(res.error);
                return;
              }
              download(res.filename, res.content, "application/json");
              setMsg(`Baixado ${res.filename}`);
            });
          }}
        >
          Exportar JSON
        </MdOutlinedButton>
        <MdOutlinedButton
          disabled={pending}
          onClick={() => {
            start(async () => {
              setError(null);
              const res = await exportCsvAction();
              if (!res.ok) {
                setError(res.error);
                return;
              }
              download(res.filename, res.content, "text/csv;charset=utf-8");
              setMsg(`Baixado ${res.filename}`);
            });
          }}
        >
          Exportar CSV
        </MdOutlinedButton>
      </div>
      {msg ? <p className="aj-msg">{msg}</p> : null}
      {error ? <p className="sheet-error" role="alert">{error}</p> : null}
    </section>
  );
}
