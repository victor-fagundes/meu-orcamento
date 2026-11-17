"use server";

import { revalidatePath } from "next/cache";
import { updateItemPlano } from "@/application/plano";
import { requireSessionOrcamento } from "@/lib/session";

export async function salvarPlanoAction(input: {
  itemId: string;
  mesesBRL: string[];
}): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const { db, orcamento } = await requireSessionOrcamento();
    const res = await updateItemPlano(db, orcamento.id, input.itemId, input.mesesBRL);
    if (res.ok) {
      revalidatePath("/app/orcamento");
      revalidatePath("/app/resumo");
    }
    return res;
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Falha ao salvar plano" };
  }
}
