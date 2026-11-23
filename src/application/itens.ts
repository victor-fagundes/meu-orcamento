import { and, eq } from "drizzle-orm";
import { garantirCategoriaAtiva } from "@/application/categorias";
import type { Db } from "@/db";
import { itens } from "@/db/schema";
import type { TipoOrcamento } from "@/domain/catalog";
import {
  isItemAtivoParaLancamento,
  validateCreateItem,
  type CreateItemInput,
} from "@/domain/itens";

export async function createItem(
  db: Db,
  orcamentoId: string,
  input: CreateItemInput,
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const parsed = validateCreateItem(input);
  if (!parsed.ok) return parsed;

  try {
    return await db.transaction(async (tx) => {
      const categoria = await garantirCategoriaAtiva(tx, orcamentoId, input.tipo, parsed.grupo);
      if (!categoria.ok) return categoria;
      const id = crypto.randomUUID();
      await tx.insert(itens).values({
        id,
        orcamentoId,
        tipo: input.tipo,
        grupo: parsed.grupo,
        nome: parsed.nome,
        planoCentavosJson: parsed.planoCentavosJson,
        arquivado: 0,
        divida: 0,
      });
      return { ok: true as const, id };
    });
  } catch {
    return { ok: false, error: "Não foi possível salvar. Os campos continuam preenchidos." };
  }
}

export async function archiveItem(
  db: Db,
  orcamentoId: string,
  itemId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const [row] = await db
    .select()
    .from(itens)
    .where(and(eq(itens.id, itemId), eq(itens.orcamentoId, orcamentoId)))
    .limit(1);

  if (!row) return { ok: false, error: "Item não encontrado." };
  if (row.arquivado === 1) return { ok: true };

  await db
    .update(itens)
    .set({ arquivado: 1, updatedAt: new Date() })
    .where(and(eq(itens.id, itemId), eq(itens.orcamentoId, orcamentoId)));

  return { ok: true };
}

export async function listItensAtivosParaLancamento(db: Db, orcamentoId: string) {
  const rows = await db.select().from(itens).where(eq(itens.orcamentoId, orcamentoId));
  return rows.filter((r) => isItemAtivoParaLancamento(r.arquivado));
}

export async function listGruposDoTipo(
  db: Db,
  orcamentoId: string,
  tipo: TipoOrcamento,
): Promise<string[]> {
  const rows = await db
    .select({ grupo: itens.grupo })
    .from(itens)
    .where(and(eq(itens.orcamentoId, orcamentoId), eq(itens.tipo, tipo)));
  return [...new Set(rows.map((r) => r.grupo))].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export async function listItensArquivados(db: Db, orcamentoId: string) {
  const rows = await db.select().from(itens).where(eq(itens.orcamentoId, orcamentoId));
  return rows.filter((r) => r.arquivado === 1);
}
