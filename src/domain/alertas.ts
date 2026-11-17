import { consumoPct, LIMITE_PREVENTIVO_PADRAO } from "./consumo";
import { formatBRL } from "./money";

export type LimitesConfig = {
  globalPct: number;
  /** override por nome de categoria/grupo */
  cats: Record<string, number>;
};

export type AlertaNivel = "wa" | "er";

export type AlertaMes = {
  nivel: AlertaNivel;
  escopo: "total" | "cat" | "item";
  cat?: string;
  msg: string;
};

export function defaultLimites(): LimitesConfig {
  return { globalPct: LIMITE_PREVENTIVO_PADRAO, cats: {} };
}

export function parseCatsJson(json: string): Record<string, number> {
  try {
    const o = JSON.parse(json) as unknown;
    if (!o || typeof o !== "object") return {};
    const out: Record<string, number> = {};
    for (const [k, v] of Object.entries(o as Record<string, unknown>)) {
      if (typeof v === "number" && v >= 1 && v <= 100) out[k] = Math.trunc(v);
    }
    return out;
  } catch {
    return {};
  }
}

export function validateGlobalPct(n: number): number {
  const v = Math.trunc(n);
  if (!Number.isFinite(v)) return LIMITE_PREVENTIVO_PADRAO;
  return Math.min(100, Math.max(1, v));
}

export function limiteDaCategoria(cfg: LimitesConfig, grupo: string): number {
  const override = cfg.cats[grupo];
  return override != null ? override : cfg.globalPct;
}

export type CatAgg = { grupo: string; plano: number; realizado: number };

/**
 * Alertas do mês (despesas F/V/E). Sem planejado com gasto → er.
 */
export function alertasDoMes(
  totalPlanoDespesas: number,
  totalRealDespesas: number,
  categorias: CatAgg[],
  cfg: LimitesConfig,
): AlertaMes[] {
  const out: AlertaMes[] = [];
  const lim = cfg.globalPct;

  if (totalPlanoDespesas > 0) {
    const pct = consumoPct(totalRealDespesas, totalPlanoDespesas);
    if (pct >= 100) {
      out.push({
        nivel: "er",
        escopo: "total",
        msg: `Despesas do mês estourou o planejado (${formatBRL(totalRealDespesas)} de ${formatBRL(totalPlanoDespesas)})`,
      });
    } else if (pct >= lim) {
      out.push({
        nivel: "wa",
        escopo: "total",
        msg: `Despesas do mês em ${pct.toFixed(0)}% do planejado (limite ${lim}%)`,
      });
    }
  }

  for (const c of categorias) {
    if (c.plano <= 0 && c.realizado > 0) {
      out.push({
        nivel: "er",
        escopo: "cat",
        cat: c.grupo,
        msg: `${c.grupo}: gasto sem orçamento planejado`,
      });
      continue;
    }
    if (c.plano <= 0) continue;
    const pct = consumoPct(c.realizado, c.plano);
    const limCat = limiteDaCategoria(cfg, c.grupo);
    if (pct >= 100) {
      out.push({
        nivel: "er",
        escopo: "cat",
        cat: c.grupo,
        msg: `${c.grupo}: estourou (${formatBRL(c.realizado)} de ${formatBRL(c.plano)})`,
      });
    } else if (pct >= limCat) {
      out.push({
        nivel: "wa",
        escopo: "cat",
        cat: c.grupo,
        msg: `${c.grupo}: ${pct.toFixed(0)}% do planejado (limite ${limCat}%)`,
      });
    }
  }

  return out;
}

export function bannerFromAlertas(als: AlertaMes[]): {
  msg: string;
  nivel: AlertaNivel;
  more: number;
} | null {
  if (!als.length) return null;
  const er = als.filter((a) => a.nivel === "er");
  const top = er[0] ?? als[0]!;
  return { msg: top.msg, nivel: top.nivel, more: als.length - 1 };
}
