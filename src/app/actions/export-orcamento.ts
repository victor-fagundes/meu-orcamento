"use server";

import { exportOrcamentoCsv, exportOrcamentoJson } from "@/application/export-orcamento";
import { requireSessionOrcamento } from "@/lib/session";
import { track } from "@/lib/telemetry";

export async function exportJsonAction(): Promise<
  { ok: true; filename: string; content: string } | { ok: false; error: string }
> {
  try {
    const { db, orcamento } = await requireSessionOrcamento();
    const content = await exportOrcamentoJson(db, orcamento.id);
    const day = new Date().toISOString().slice(0, 10);
    track("export_iniciado", { format: "json" });
    return { ok: true, filename: `meu-orcamento-${day}.json`, content };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Falha no export" };
  }
}

export async function exportCsvAction(): Promise<
  { ok: true; filename: string; content: string } | { ok: false; error: string }
> {
  try {
    const { db, orcamento } = await requireSessionOrcamento();
    const content = await exportOrcamentoCsv(db, orcamento.id);
    const day = new Date().toISOString().slice(0, 10);
    track("export_iniciado", { format: "csv" });
    return { ok: true, filename: `meu-orcamento-${day}.csv`, content };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Falha no export" };
  }
}
