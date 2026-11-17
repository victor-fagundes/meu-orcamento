"use server";

import { revalidatePath } from "next/cache";
import {
  createLancamentos,
  deleteLancamentos,
  restoreLancamentos,
  updateLancamento,
} from "@/application/lancamentos";
import type { DeleteScope } from "@/domain/delete-lancamento";
import type { EditScope } from "@/domain/edit-lancamento";
import { requireSessionOrcamento } from "@/lib/session";
import { track } from "@/lib/telemetry";

function revalidateLanc() {
  revalidatePath("/app/lancamentos");
  revalidatePath("/app/orcamento");
  revalidatePath("/app/resumo");
}

export async function criarLancamentoAction(input: {
  itemId: string;
  descricao?: string;
  valorBRL: string;
  dataISO: string;
  pagamento: string;
  parcelas?: number;
}): Promise<{ ok: true; count: number } | { ok: false; error: string }> {
  try {
    const { db, orcamento } = await requireSessionOrcamento();
    const res = await createLancamentos(db, orcamento.id, input);
    if (res.ok) {
      revalidateLanc();
      track("lancamento_criado", { quantidade: res.count });
    }
    return res;
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Falha ao salvar" };
  }
}

export async function editarLancamentoAction(input: {
  id: string;
  itemId: string;
  descricao?: string;
  valorBRL: string;
  dataISO: string;
  pagamento: string;
  scope: EditScope;
}): Promise<{ ok: true; affected: number } | { ok: false; error: string }> {
  try {
    const { db, orcamento } = await requireSessionOrcamento();
    const res = await updateLancamento(db, orcamento.id, input);
    if (res.ok) {
      revalidateLanc();
      track("lancamento_editado", { quantidade: res.affected });
    }
    return res;
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Falha ao editar" };
  }
}

export type RemovedLancamentoDTO = {
  id: string;
  orcamentoId: string;
  itemId: string;
  cartaoId: string | null;
  descricao: string;
  valorCentavos: number;
  dataTransacao: string;
  competencia: string;
  meio: string;
  parcelaN: number | null;
  parcelaTotal: number | null;
  grupoParcelaId: string | null;
  createdAt: string;
};

export async function excluirLancamentoAction(input: {
  id: string;
  scope: DeleteScope;
}): Promise<{ ok: true; count: number; removed: RemovedLancamentoDTO[] } | { ok: false; error: string }> {
  try {
    const { db, orcamento } = await requireSessionOrcamento();
    const res = await deleteLancamentos(db, orcamento.id, input);
    if (!res.ok) return res;
    revalidateLanc();
    track("lancamento_excluido", { quantidade: res.count });
    return {
      ok: true,
      count: res.count,
      removed: res.removed.map((r) => ({
        id: r.id,
        orcamentoId: r.orcamentoId,
        itemId: r.itemId,
        cartaoId: r.cartaoId,
        descricao: r.descricao,
        valorCentavos: r.valorCentavos,
        dataTransacao: r.dataTransacao,
        competencia: r.competencia,
        meio: r.meio,
        parcelaN: r.parcelaN,
        parcelaTotal: r.parcelaTotal,
        grupoParcelaId: r.grupoParcelaId,
        createdAt: r.createdAt.toISOString(),
      })),
    };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Falha ao excluir" };
  }
}

export async function desfazerExclusaoAction(
  removed: RemovedLancamentoDTO[],
): Promise<{ ok: true; count: number } | { ok: false; error: string }> {
  try {
    const { db, orcamento } = await requireSessionOrcamento();
    const rows = removed.map((r) => ({
      id: r.id,
      orcamentoId: r.orcamentoId,
      itemId: r.itemId,
      cartaoId: r.cartaoId,
      descricao: r.descricao,
      valorCentavos: r.valorCentavos,
      dataTransacao: r.dataTransacao,
      competencia: r.competencia,
      meio: r.meio,
      parcelaN: r.parcelaN,
      parcelaTotal: r.parcelaTotal,
      grupoParcelaId: r.grupoParcelaId,
      createdAt: new Date(r.createdAt),
      updatedAt: new Date(),
    }));
    const res = await restoreLancamentos(db, orcamento.id, rows);
    if (res.ok) revalidateLanc();
    return res;
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Falha ao desfazer" };
  }
}
