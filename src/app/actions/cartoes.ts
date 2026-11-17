"use server";

import { revalidatePath } from "next/cache";
import { createCartao, inativarCartao } from "@/application/cartoes";
import { requireSessionOrcamento } from "@/lib/session";

function revalidate() {
  revalidatePath("/app/ajustes");
}

export async function criarCartaoAction(input: {
  apelido: string;
  diaFechamento?: string;
  diaVencimento?: string;
  instituicao?: string;
  ultimos4?: string;
}): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  try {
    const { db, orcamento } = await requireSessionOrcamento();
    const diaFechamento =
      input.diaFechamento && input.diaFechamento.trim() !== ""
        ? Number(input.diaFechamento)
        : null;
    const diaVencimento =
      input.diaVencimento && input.diaVencimento.trim() !== ""
        ? Number(input.diaVencimento)
        : null;

    const res = await createCartao(db, orcamento.id, {
      apelido: input.apelido,
      diaFechamento,
      diaVencimento,
      instituicao: input.instituicao,
      ultimos4: input.ultimos4,
    });
    if (res.ok) revalidate();
    return res;
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Falha ao criar cartão" };
  }
}

export async function inativarCartaoAction(
  cartaoId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const { db, orcamento } = await requireSessionOrcamento();
    const res = await inativarCartao(db, orcamento.id, cartaoId);
    if (res.ok) revalidate();
    return res;
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Falha ao inativar" };
  }
}
