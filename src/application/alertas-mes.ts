import { and, eq } from "drizzle-orm";
import type { Db } from "@/db";
import { itens, lancamentos } from "@/db/schema";
import { alertasDoMes, type AlertaMes, type LimitesConfig } from "@/domain/alertas";
import { planoDoMes } from "@/lib/competencia-nav";
import { getLimites } from "./limites";

export async function loadAlertasMes(
  db: Db,
  orcamentoId: string,
  competencia: string,
  cfg?: LimitesConfig,
): Promise<{ alertas: AlertaMes[]; limites: LimitesConfig }> {
  const limites = cfg ?? (await getLimites(db, orcamentoId));
  const allItens = await db.select().from(itens).where(eq(itens.orcamentoId, orcamentoId));
  const ativos = allItens.filter((i) => i.arquivado === 0 && i.tipo !== "R");

  const gastos = await db
    .select({
      itemId: lancamentos.itemId,
      valorCentavos: lancamentos.valorCentavos,
    })
    .from(lancamentos)
    .where(and(eq(lancamentos.orcamentoId, orcamentoId), eq(lancamentos.competencia, competencia)));

  const realByItem = new Map<string, number>();
  for (const g of gastos) {
    realByItem.set(g.itemId, (realByItem.get(g.itemId) ?? 0) + g.valorCentavos);
  }

  let totalP = 0;
  let totalR = 0;
  const byGrupo = new Map<string, { plano: number; realizado: number }>();

  for (const i of ativos) {
    const plano = planoDoMes(i.planoCentavosJson, competencia);
    const real = realByItem.get(i.id) ?? 0;
    totalP += plano;
    totalR += real;
    const cur = byGrupo.get(i.grupo) ?? { plano: 0, realizado: 0 };
    cur.plano += plano;
    cur.realizado += real;
    byGrupo.set(i.grupo, cur);
  }

  const categorias = [...byGrupo.entries()].map(([grupo, v]) => ({
    grupo,
    plano: v.plano,
    realizado: v.realizado,
  }));

  return {
    limites,
    alertas: alertasDoMes(totalP, totalR, categorias, limites),
  };
}
