import { and, eq } from "drizzle-orm";
import type { Db } from "@/db";
import { itens } from "@/db/schema";
import { normalizeHeader } from "@/domain/import-planilha";
import { isItemAtivoParaLancamento } from "@/domain/itens";
import { isGrupoExtraImportado, mergePlanFromExtras } from "@/domain/item-unico";

function parsePlano(json: string): number[] {
  try {
    const raw = JSON.parse(json) as unknown;
    if (!Array.isArray(raw)) return Array(12).fill(0);
    const out = raw
      .slice(0, 12)
      .map((n) => (Number.isFinite(Number(n)) ? Math.trunc(Number(n)) : 0));
    while (out.length < 12) out.push(0);
    return out;
  } catch {
    return Array(12).fill(0);
  }
}

/**
 * Copia o plano de extras cujo grupo tem nome de aba para o único item de
 * catálogo com o mesmo nome e arquiva os extras. Sem par ativo, não grava.
 * A segunda passagem não encontra extra ativo, então não soma de novo.
 */
export async function reconcileTabNameDuplicates(db: Db, orcamentoId: string): Promise<void> {
  const all = await db.select().from(itens).where(eq(itens.orcamentoId, orcamentoId));
  const active = all.filter((row) => isItemAtivoParaLancamento(row.arquivado));
  const byName = new Map<string, typeof active>();
  for (const row of active) {
    const key = normalizeHeader(row.nome);
    const list = byName.get(key) ?? [];
    list.push(row);
    byName.set(key, list);
  }

  for (const group of byName.values()) {
    const catalog = group.filter((row) => !isGrupoExtraImportado(row.grupo));
    const extras = group.filter((row) => isGrupoExtraImportado(row.grupo));
    if (catalog.length !== 1 || extras.length === 0) continue;

    const target = catalog[0]!;
    const merged = mergePlanFromExtras(
      parsePlano(target.planoCentavosJson),
      extras.map((row) => parsePlano(row.planoCentavosJson)),
    );
    const json = JSON.stringify(merged);
    if (json !== target.planoCentavosJson) {
      await db
        .update(itens)
        .set({ planoCentavosJson: json, updatedAt: new Date() })
        .where(and(eq(itens.id, target.id), eq(itens.orcamentoId, orcamentoId)));
    }

    for (const extra of extras) {
      await db
        .update(itens)
        .set({ arquivado: 1, updatedAt: new Date() })
        .where(and(eq(itens.id, extra.id), eq(itens.orcamentoId, orcamentoId)));
    }
  }
}
