"use server";

import { revalidatePath } from "next/cache";
import { applyExamplePlans } from "@/application/catalog";
import { requireSessionOrcamento } from "@/lib/session";

export async function carregarExemploAction(): Promise<{ ok: true; updated: number } | { ok: false; error: string }> {
  try {
    const { db, orcamento } = await requireSessionOrcamento();
    const updated = await applyExamplePlans(db, orcamento.id);
    revalidatePath("/app/orcamento");
    revalidatePath("/app/ajustes");
    revalidatePath("/app/resumo");
    return { ok: true, updated };
  } catch {
    return { ok: false, error: "Não foi possível aplicar o exemplo." };
  }
}
