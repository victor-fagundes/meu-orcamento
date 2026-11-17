import { and, count, eq } from "drizzle-orm";
import type { Db } from "@/db";
import { itens } from "@/db/schema";
import {
  buildCatalogSeeds,
  EXAMPLE_PLANS_BRL,
  planoJsonFromBRL,
  zeroPlanoJson,
} from "@/domain/catalog";

export async function seedCatalog(db: Db, orcamentoId: string): Promise<number> {
  const seeds = buildCatalogSeeds();
  const rows = seeds.map((s) => ({
    id: crypto.randomUUID(),
    orcamentoId,
    tipo: s.tipo,
    grupo: s.grupo,
    nome: s.nome,
    planoCentavosJson: zeroPlanoJson(),
    arquivado: 0,
    divida: s.divida ? 1 : 0,
  }));
  // insert em lotes para PGlite
  const chunk = 40;
  for (let i = 0; i < rows.length; i += chunk) {
    await db.insert(itens).values(rows.slice(i, i + chunk));
  }
  return rows.length;
}

/** Garante catálogo se orçamento ficou sem itens (signup antigo / falha). */
export async function ensureCatalog(db: Db, orcamentoId: string): Promise<void> {
  const [row] = await db
    .select({ n: count() })
    .from(itens)
    .where(eq(itens.orcamentoId, orcamentoId));
  if ((row?.n ?? 0) === 0) {
    await seedCatalog(db, orcamentoId);
  }
}

export async function applyExamplePlans(db: Db, orcamentoId: string): Promise<number> {
  await ensureCatalog(db, orcamentoId);
  const all = await db.select().from(itens).where(eq(itens.orcamentoId, orcamentoId));
  let updated = 0;
  for (const item of all) {
    const key = `${item.tipo}|${item.grupo}|${item.nome}`;
    const brl = EXAMPLE_PLANS_BRL[key];
    if (brl == null) continue;
    await db
      .update(itens)
      .set({
        planoCentavosJson: planoJsonFromBRL(brl),
        updatedAt: new Date(),
      })
      .where(and(eq(itens.id, item.id), eq(itens.orcamentoId, orcamentoId)));
    updated += 1;
  }
  return updated;
}
