"use server";

import { revalidatePath } from "next/cache";
import {
  arquivarCategoria,
  criarCategoria,
  listarCategorias,
  renomearCategoria,
} from "@/application/categorias";
import { requireSessionOrcamento } from "@/lib/session";

const ERRO_SALVAR = "Não foi possível salvar. Os campos continuam preenchidos.";

function revalidarCategorias() {
  revalidatePath("/app/orcamento");
  revalidatePath("/app/ajustes", "layout");
}

export async function listarCategoriasAction(incluirArquivadas = false) {
  try {
    const { db, orcamento } = await requireSessionOrcamento();
    const lista = await listarCategorias(db, orcamento.id, { incluirArquivadas });
    return { ok: true as const, categorias: lista };
  } catch {
    return { ok: false as const, error: "Não foi possível carregar." };
  }
}

export async function criarCategoriaAction(input: { tipo: string; nome: string }) {
  try {
    const { db, orcamento } = await requireSessionOrcamento();
    const res = await criarCategoria(db, orcamento.id, input);
    if (res.ok) revalidarCategorias();
    return res;
  } catch {
    return { ok: false as const, code: "validacao" as const, error: ERRO_SALVAR };
  }
}

export async function renomearCategoriaAction(categoriaId: string, nome: string) {
  try {
    const { db, orcamento } = await requireSessionOrcamento();
    const res = await renomearCategoria(db, orcamento.id, categoriaId, nome);
    if (res.ok) revalidarCategorias();
    return res;
  } catch {
    return { ok: false as const, code: "validacao" as const, error: ERRO_SALVAR };
  }
}

export async function arquivarCategoriaAction(categoriaId: string) {
  try {
    const { db, orcamento } = await requireSessionOrcamento();
    const res = await arquivarCategoria(db, orcamento.id, categoriaId);
    if (res.ok) revalidarCategorias();
    return res;
  } catch {
    return { ok: false as const, code: "validacao" as const, error: ERRO_SALVAR };
  }
}
