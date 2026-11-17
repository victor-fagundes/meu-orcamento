"use server";

import { revalidatePath } from "next/cache";
import { archiveItem, createItem } from "@/application/itens";
import type { TipoOrcamento } from "@/domain/catalog";
import { requireSessionOrcamento } from "@/lib/session";

function revalidateItens() {
  revalidatePath("/app/orcamento");
  revalidatePath("/app/ajustes");
  revalidatePath("/app/resumo");
}

export async function criarItemAction(input: {
  tipo: TipoOrcamento;
  grupo: string;
  nome: string;
  planoMensalBRL?: number;
}): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  try {
    const { db, orcamento } = await requireSessionOrcamento();
    const res = await createItem(db, orcamento.id, input);
    if (res.ok) revalidateItens();
    return res;
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Falha ao criar item" };
  }
}

export async function arquivarItemAction(
  itemId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const { db, orcamento } = await requireSessionOrcamento();
    const res = await archiveItem(db, orcamento.id, itemId);
    if (res.ok) revalidateItens();
    return res;
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Falha ao arquivar" };
  }
}
