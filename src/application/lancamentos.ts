import { and, asc, desc, eq, inArray } from "drizzle-orm";
import type { Db } from "@/db";
import { cartoes, itens, lancamentos } from "@/db/schema";
import { isCartaoAtivo } from "@/domain/cartoes";
import {
  planEditLancamento,
  type EditScope,
  type LancamentoRow,
} from "@/domain/edit-lancamento";
import { isItemAtivoParaLancamento } from "@/domain/itens";
import { buildLancamentoDraft, type NovoLancamentoInput } from "@/domain/lancamentos";
import {
  planDeleteLancamento,
  type DeleteScope,
} from "@/domain/delete-lancamento";

export async function createLancamentos(
  db: Db,
  orcamentoId: string,
  input: Omit<NovoLancamentoInput, "itemNome" | "itemTipo" | "diaFechamentoCartao"> & {
    descricao?: string;
    parcelas?: number;
  },
): Promise<{ ok: true; count: number } | { ok: false; error: string }> {
  const [item] = await db
    .select()
    .from(itens)
    .where(and(eq(itens.id, input.itemId), eq(itens.orcamentoId, orcamentoId)))
    .limit(1);

  if (!item || !isItemAtivoParaLancamento(item.arquivado)) {
    return { ok: false, error: "Item inválido ou arquivado." };
  }

  let diaFechamento: number | null = null;
  const pagamento = input.pagamento;
  if (pagamento !== "deb" && pagamento !== "pix" && pagamento !== "din") {
    const [card] = await db
      .select()
      .from(cartoes)
      .where(and(eq(cartoes.id, pagamento), eq(cartoes.orcamentoId, orcamentoId)))
      .limit(1);
    if (!card || !isCartaoAtivo(card.ativo)) {
      return { ok: false, error: "Cartão inválido ou inativo." };
    }
    diaFechamento = card.diaFechamento;
  }

  const draft = buildLancamentoDraft({
    ...input,
    itemNome: item.nome,
    itemTipo: item.tipo,
    diaFechamentoCartao: diaFechamento,
  });
  if (!draft.ok) return draft;

  const grupoId = draft.parcelas.length > 1 ? crypto.randomUUID() : null;
  const rows = draft.parcelas.map((p) => ({
    id: crypto.randomUUID(),
    orcamentoId,
    itemId: item.id,
    cartaoId: draft.cartaoId,
    descricao: draft.descricao,
    valorCentavos: p.valorCentavos,
    dataTransacao: draft.dataTransacao,
    competencia: p.competencia,
    meio: draft.meio === "cartao" ? "cartao" : draft.meio,
    parcelaN: draft.parcelas.length > 1 ? p.n : null,
    parcelaTotal: draft.parcelas.length > 1 ? p.total : null,
    grupoParcelaId: grupoId,
  }));

  await db.insert(lancamentos).values(rows);
  return { ok: true, count: rows.length };
}

export async function listLancamentosCompetencia(
  db: Db,
  orcamentoId: string,
  competencia: string,
) {
  return db
    .select({
      id: lancamentos.id,
      itemId: lancamentos.itemId,
      cartaoId: lancamentos.cartaoId,
      descricao: lancamentos.descricao,
      valorCentavos: lancamentos.valorCentavos,
      dataTransacao: lancamentos.dataTransacao,
      competencia: lancamentos.competencia,
      meio: lancamentos.meio,
      parcelaN: lancamentos.parcelaN,
      parcelaTotal: lancamentos.parcelaTotal,
      grupoParcelaId: lancamentos.grupoParcelaId,
      itemNome: itens.nome,
      itemGrupo: itens.grupo,
      itemTipo: itens.tipo,
      cartaoApelido: cartoes.apelido,
    })
    .from(lancamentos)
    .innerJoin(itens, eq(lancamentos.itemId, itens.id))
    .leftJoin(cartoes, eq(lancamentos.cartaoId, cartoes.id))
    .where(and(eq(lancamentos.orcamentoId, orcamentoId), eq(lancamentos.competencia, competencia)))
    .orderBy(desc(lancamentos.dataTransacao), desc(lancamentos.createdAt));
}

async function loadGroup(
  db: Db,
  orcamentoId: string,
  target: typeof lancamentos.$inferSelect,
): Promise<LancamentoRow[]> {
  if (!target.grupoParcelaId) {
    return [
      {
        id: target.id,
        itemId: target.itemId,
        cartaoId: target.cartaoId,
        descricao: target.descricao,
        valorCentavos: target.valorCentavos,
        dataTransacao: target.dataTransacao,
        competencia: target.competencia,
        meio: target.meio,
        parcelaN: target.parcelaN,
        parcelaTotal: target.parcelaTotal,
        grupoParcelaId: target.grupoParcelaId,
      },
    ];
  }
  const rows = await db
    .select()
    .from(lancamentos)
    .where(
      and(
        eq(lancamentos.orcamentoId, orcamentoId),
        eq(lancamentos.grupoParcelaId, target.grupoParcelaId),
      ),
    )
    .orderBy(asc(lancamentos.parcelaN));
  return rows.map((r) => ({
    id: r.id,
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
  }));
}

export async function updateLancamento(
  db: Db,
  orcamentoId: string,
  input: {
    id: string;
    itemId: string;
    descricao?: string;
    valorBRL: string;
    dataISO: string;
    pagamento: string;
    scope: EditScope;
  },
): Promise<{ ok: true; affected: number } | { ok: false; error: string }> {
  const [target] = await db
    .select()
    .from(lancamentos)
    .where(and(eq(lancamentos.id, input.id), eq(lancamentos.orcamentoId, orcamentoId)))
    .limit(1);
  if (!target) return { ok: false, error: "Lançamento não encontrado." };

  const [item] = await db
    .select()
    .from(itens)
    .where(and(eq(itens.id, input.itemId), eq(itens.orcamentoId, orcamentoId)))
    .limit(1);
  if (!item || !isItemAtivoParaLancamento(item.arquivado)) {
    return { ok: false, error: "Item inválido ou arquivado." };
  }

  let diaFechamento: number | null = null;
  const pagamento = input.pagamento;
  if (pagamento !== "deb" && pagamento !== "pix" && pagamento !== "din") {
    const [card] = await db
      .select()
      .from(cartoes)
      .where(and(eq(cartoes.id, pagamento), eq(cartoes.orcamentoId, orcamentoId)))
      .limit(1);
    if (!card || !isCartaoAtivo(card.ativo)) {
      return { ok: false, error: "Cartão inválido ou inativo." };
    }
    diaFechamento = card.diaFechamento;
  }

  const group = await loadGroup(db, orcamentoId, target);
  const planned = planEditLancamento(
    group.find((g) => g.id === target.id)!,
    group,
    {
      itemId: item.id,
      itemNome: item.nome,
      descricao: input.descricao,
      valorBRL: input.valorBRL,
      dataISO: input.dataISO,
      pagamento,
      diaFechamentoCartao: diaFechamento,
    },
    input.scope,
  );
  if (!planned.ok) return planned;

  for (const u of planned.updates) {
    await db
      .update(lancamentos)
      .set({
        itemId: u.itemId,
        cartaoId: u.cartaoId,
        descricao: u.descricao,
        valorCentavos: u.valorCentavos,
        dataTransacao: u.dataTransacao,
        competencia: u.competencia,
        meio: u.meio,
        updatedAt: new Date(),
      })
      .where(and(eq(lancamentos.id, u.id), eq(lancamentos.orcamentoId, orcamentoId)));
  }

  return { ok: true, affected: planned.affected };
}

export async function deleteLancamentos(
  db: Db,
  orcamentoId: string,
  input: { id: string; scope: DeleteScope },
): Promise<
  | { ok: true; removed: (typeof lancamentos.$inferSelect)[]; count: number }
  | { ok: false; error: string }
> {
  const [target] = await db
    .select()
    .from(lancamentos)
    .where(and(eq(lancamentos.id, input.id), eq(lancamentos.orcamentoId, orcamentoId)))
    .limit(1);
  if (!target) return { ok: false, error: "Lançamento não encontrado." };

  const group = await loadGroup(db, orcamentoId, target);
  const planned = planDeleteLancamento(
    group.find((g) => g.id === target.id)!,
    group,
    input.scope,
  );
  if (!planned.ok) return planned;

  const ids = planned.ids;
  const removed = await db
    .select()
    .from(lancamentos)
    .where(and(eq(lancamentos.orcamentoId, orcamentoId), inArray(lancamentos.id, ids)));

  await db
    .delete(lancamentos)
    .where(and(eq(lancamentos.orcamentoId, orcamentoId), inArray(lancamentos.id, ids)));

  return { ok: true, removed, count: removed.length };
}

export async function restoreLancamentos(
  db: Db,
  orcamentoId: string,
  rows: (typeof lancamentos.$inferSelect)[],
): Promise<{ ok: true; count: number } | { ok: false; error: string }> {
  if (rows.length === 0) return { ok: true, count: 0 };
  const owned = rows.every((r) => r.orcamentoId === orcamentoId);
  if (!owned) return { ok: false, error: "Restauração inválida." };

  const ids = rows.map((r) => r.id);
  const existing = await db
    .select({ id: lancamentos.id })
    .from(lancamentos)
    .where(and(eq(lancamentos.orcamentoId, orcamentoId), inArray(lancamentos.id, ids)));
  if (existing.length > 0) {
    return { ok: false, error: "Já restaurado ou IDs em uso." };
  }

  await db.insert(lancamentos).values(
    rows.map((r) => ({
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
      createdAt: r.createdAt,
      updatedAt: new Date(),
    })),
  );
  return { ok: true, count: rows.length };
}

export function competenciaAtual(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}
