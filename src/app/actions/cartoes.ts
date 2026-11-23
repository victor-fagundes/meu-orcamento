"use server";

import { revalidatePath } from "next/cache";
import { atualizarCartao, createCartao, inativarCartao } from "@/application/cartoes";
import { requireSessionOrcamento } from "@/lib/session";

const ERRO_SALVAR = "Não foi possível salvar. Os campos continuam preenchidos.";

function revalidate() {
  revalidatePath("/app/ajustes", "layout");
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
    const res = await createCartao(db, orcamento.id, {
      apelido: input.apelido,
      diaFechamento: diaOuNulo(input.diaFechamento),
      diaVencimento: diaOuNulo(input.diaVencimento),
      instituicao: input.instituicao,
      ultimos4: input.ultimos4,
    });
    if (res.ok) revalidate();
    return res;
  } catch {
    return { ok: false, error: ERRO_SALVAR };
  }
}

export async function atualizarCartaoAction(
  cartaoId: string,
  input: {
    apelido: string;
    diaFechamento?: string;
    diaVencimento?: string;
    instituicao?: string;
    ultimos4?: string;
  },
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  try {
    const { db, orcamento } = await requireSessionOrcamento();
    const res = await atualizarCartao(db, orcamento.id, cartaoId, {
      apelido: input.apelido,
      diaFechamento: diaOuNulo(input.diaFechamento),
      diaVencimento: diaOuNulo(input.diaVencimento),
      instituicao: input.instituicao,
      ultimos4: input.ultimos4,
    });
    if (res.ok) revalidate();
    return res;
  } catch {
    return { ok: false, error: ERRO_SALVAR };
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
  } catch {
    return { ok: false, error: ERRO_SALVAR };
  }
}

function diaOuNulo(valor: string | undefined): number | null {
  if (!valor || valor.trim() === "") return null;
  return Number(valor);
}
