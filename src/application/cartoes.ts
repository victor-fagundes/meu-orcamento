import { and, eq } from "drizzle-orm";
import type { Db } from "@/db";
import { cartoes } from "@/db/schema";
import {
  isCartaoAtivo,
  validateCreateCartao,
  type CreateCartaoInput,
} from "@/domain/cartoes";

export async function createCartao(
  db: Db,
  orcamentoId: string,
  input: CreateCartaoInput,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const parsed = validateCreateCartao(input);
  if (!parsed.ok) return parsed;

  const id = crypto.randomUUID();
  await db.insert(cartoes).values({
    id,
    orcamentoId,
    apelido: parsed.apelido,
    diaFechamento: parsed.diaFechamento,
    diaVencimento: parsed.diaVencimento,
    instituicao: parsed.instituicao,
    ultimos4: parsed.ultimos4,
    ativo: 1,
  });
  return { ok: true, id };
}

export async function atualizarCartao(
  db: Db,
  orcamentoId: string,
  cartaoId: string,
  input: CreateCartaoInput,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const parsed = validateCreateCartao(input);
  if (!parsed.ok) return parsed;
  const [row] = await db
    .select({ id: cartoes.id })
    .from(cartoes)
    .where(and(eq(cartoes.id, cartaoId), eq(cartoes.orcamentoId, orcamentoId)))
    .limit(1);
  if (!row) return { ok: false, error: "Não foi possível salvar. Os campos continuam preenchidos." };
  await db
    .update(cartoes)
    .set({
      apelido: parsed.apelido,
      diaFechamento: parsed.diaFechamento,
      diaVencimento: parsed.diaVencimento,
      instituicao: parsed.instituicao,
      ultimos4: parsed.ultimos4,
      updatedAt: new Date(),
    })
    .where(and(eq(cartoes.id, cartaoId), eq(cartoes.orcamentoId, orcamentoId)));
  return { ok: true, id: cartaoId };
}

export async function inativarCartao(
  db: Db,
  orcamentoId: string,
  cartaoId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const [row] = await db
    .select()
    .from(cartoes)
    .where(and(eq(cartoes.id, cartaoId), eq(cartoes.orcamentoId, orcamentoId)))
    .limit(1);
  if (!row) return { ok: false, error: "Cartão não encontrado." };

  await db
    .update(cartoes)
    .set({ ativo: 0, updatedAt: new Date() })
    .where(and(eq(cartoes.id, cartaoId), eq(cartoes.orcamentoId, orcamentoId)));

  return { ok: true };
}

export async function listCartoes(db: Db, orcamentoId: string) {
  return db.select().from(cartoes).where(eq(cartoes.orcamentoId, orcamentoId));
}

export async function listCartoesAtivos(db: Db, orcamentoId: string) {
  const rows = await listCartoes(db, orcamentoId);
  return rows.filter((c) => isCartaoAtivo(c.ativo));
}
