import { eq } from "drizzle-orm";
import type { Db } from "@/db";
import { limitesAlerta } from "@/db/schema";
import {
  defaultLimites,
  parseCatsJson,
  validateGlobalPct,
  type LimitesConfig,
} from "@/domain/alertas";

export async function getLimites(db: Db, orcamentoId: string): Promise<LimitesConfig> {
  const [row] = await db
    .select()
    .from(limitesAlerta)
    .where(eq(limitesAlerta.orcamentoId, orcamentoId))
    .limit(1);
  if (!row) return defaultLimites();
  return {
    globalPct: validateGlobalPct(row.globalPct),
    cats: parseCatsJson(row.catsJson),
  };
}

export async function saveLimites(
  db: Db,
  orcamentoId: string,
  input: { globalPct: number; cats: Record<string, number> },
): Promise<LimitesConfig> {
  const globalPct = validateGlobalPct(input.globalPct);
  const cats: Record<string, number> = {};
  for (const [k, v] of Object.entries(input.cats)) {
    if (v == null) continue;
    cats[k] = validateGlobalPct(v);
  }
  const catsJson = JSON.stringify(cats);

  const [existing] = await db
    .select()
    .from(limitesAlerta)
    .where(eq(limitesAlerta.orcamentoId, orcamentoId))
    .limit(1);

  if (existing) {
    await db
      .update(limitesAlerta)
      .set({ globalPct, catsJson, updatedAt: new Date() })
      .where(eq(limitesAlerta.orcamentoId, orcamentoId));
  } else {
    await db.insert(limitesAlerta).values({ orcamentoId, globalPct, catsJson });
  }
  return { globalPct, cats };
}
