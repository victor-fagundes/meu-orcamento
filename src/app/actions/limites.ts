"use server";

import { revalidatePath } from "next/cache";
import { saveLimites } from "@/application/limites";
import { requireSessionOrcamento } from "@/lib/session";

export async function salvarLimitesAction(input: {
  globalPct: number;
  cats: Record<string, number | null>;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const { db, orcamento } = await requireSessionOrcamento();
    const cats: Record<string, number> = {};
    for (const [k, v] of Object.entries(input.cats)) {
      if (v == null) continue;
      cats[k] = v;
    }
    const saved = await saveLimites(db, orcamento.id, { globalPct: input.globalPct, cats });
    if (!saved.ok) return saved;
    revalidatePath("/app/ajustes");
    revalidatePath("/app/resumo");
    revalidatePath("/app/orcamento");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Falha ao salvar limites" };
  }
}
