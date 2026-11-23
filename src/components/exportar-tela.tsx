"use client";

import { useState } from "react";
import { Botao } from "@meu-orcamento/design-system";
import { exportCsvAction, exportJsonAction } from "@/app/actions/export-orcamento";

function baixar(nome: string, conteudo: string, mime: string) {
  const blob = new Blob([conteudo], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = nome;
  link.click();
  URL.revokeObjectURL(url);
}

export function ExportarTela() {
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [pendente, setPendente] = useState(false);

  async function exportar(formato: "csv" | "json") {
    setPendente(true);
    setMensagem(null);
    const res = formato === "csv" ? await exportCsvAction() : await exportJsonAction();
    setPendente(false);
    if (!res.ok) {
      setMensagem(res.error);
      return;
    }
    baixar(res.filename, res.content, formato === "csv" ? "text/csv;charset=utf-8" : "application/json");
  }

  return (
    <section>
      <h2>Exportar</h2>
      <p>O arquivo é gerado no seu navegador e você escolhe onde salvar.</p>
      <p className="mo-ajustes__apoio">Orçamento e lançamentos, para abrir no Excel ou no Planilhas Google.</p>
      <Botao variante="secundario" disabled={pendente} onPress={() => void exportar("csv")}>
        Exportar CSV
      </Botao>
      <p className="mo-ajustes__apoio">Cópia completa para backup ou análise.</p>
      <Botao variante="secundario" disabled={pendente} onPress={() => void exportar("json")}>
        Exportar JSON
      </Botao>
      {mensagem ? <p role="alert">{mensagem}</p> : null}
    </section>
  );
}
