"use server";

import { exportOrcamentoCsv, exportOrcamentoJson } from "@/application/export-orcamento";
import { MSG_ARQUIVO_INCOMPLETO } from "@/domain/export-orcamento";
import { requireSessionOrcamento } from "@/lib/session";
import { track } from "@/lib/telemetry";

export async function exportJsonAction(): Promise<
  { ok: true; filename: string; content: string } | { ok: false; error: string }
> {
  try {
    const { db, orcamento } = await requireSessionOrcamento();
    const arquivo = await exportOrcamentoJson(db, orcamento.id);
    if (!arquivo.ok) return arquivo;
    const day = new Date().toISOString().slice(0, 10);
    track("export_iniciado", { format: "json" });
    return { ok: true, filename: `meu-orcamento-${day}.json`, content: arquivo.content };
  } catch {
    return { ok: false, error: MSG_ARQUIVO_INCOMPLETO };
  }
}

export async function exportCsvAction(): Promise<
  { ok: true; filename: string; content: string } | { ok: false; error: string }
> {
  try {
    const { db, orcamento } = await requireSessionOrcamento();
    const arquivo = await exportOrcamentoCsv(db, orcamento.id);
    if (!arquivo.ok) return arquivo;
    const day = new Date().toISOString().slice(0, 10);
    track("export_iniciado", { format: "csv" });
    return { ok: true, filename: `meu-orcamento-${day}.csv`, content: arquivo.content };
  } catch {
    return { ok: false, error: MSG_ARQUIVO_INCOMPLETO };
  }
}
