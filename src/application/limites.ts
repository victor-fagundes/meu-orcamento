import { eq } from "drizzle-orm";
import type { Db } from "@/db";
import { limitesAlerta } from "@/db/schema";
import {
  defaultLimites,
  ERRO_LIMITE_PCT,
  parseCatsJson,
  validarLimitePct,
  type LimitesConfig,
} from "@/domain/alertas";

export async function getLimites(db: Db, orcamentoId: string): Promise<LimitesConfig> {
  const [row] = await db
    .select()
    .from(limitesAlerta)
    .where(eq(limitesAlerta.orcamentoId, orcamentoId))
    .limit(1);
  if (!row) return defaultLimites();
  const global = validarLimitePct(row.globalPct);
  return {
    globalPct: global.ok ? global.valor : defaultLimites().globalPct,
    cats: parseCatsJson(row.catsJson),
  };
}

export async function saveLimites(
  db: Db,
  orcamentoId: string,
  input: { globalPct: number; cats: Record<string, number> },
): Promise<{ ok: true; limites: LimitesConfig } | { ok: false; error: string }> {
  const global = validarLimitePct(input.globalPct);
  if (!global.ok) return { ok: false, error: global.error || ERRO_LIMITE_PCT };
  const globalPct = global.valor;
  const cats: Record<string, number> = {};
  for (const [k, v] of Object.entries(input.cats)) {
    if (v == null) continue;
    const parsed = validarLimitePct(v);
    if (!parsed.ok) return { ok: false, error: parsed.error };
    cats[k] = parsed.valor;
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
  return { ok: true, limites: { globalPct, cats } };
}

/** Grava só o percentual global. Não lê nem reescreve catsJson. */
export async function salvarLimiteGlobal(
  db: Db,
  orcamentoId: string,
  globalPct: number,
): Promise<{ ok: true; globalPct: number } | { ok: false; error: string }> {
  const global = validarLimitePct(globalPct);
  if (!global.ok) return { ok: false, error: global.error || ERRO_LIMITE_PCT };
  const [existing] = await db
    .select({ orcamentoId: limitesAlerta.orcamentoId })
    .from(limitesAlerta)
    .where(eq(limitesAlerta.orcamentoId, orcamentoId))
    .limit(1);
  if (existing) {
    await db
      .update(limitesAlerta)
      .set({ globalPct: global.valor, updatedAt: new Date() })
      .where(eq(limitesAlerta.orcamentoId, orcamentoId));
  } else {
    await db.insert(limitesAlerta).values({ orcamentoId, globalPct: global.valor, catsJson: "{}" });
  }
  return { ok: true, globalPct: global.valor };
}
