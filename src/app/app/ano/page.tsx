import { eq } from "drizzle-orm";
import { listItensAtivosParaLancamento } from "@/application/itens";
import { AnoView, type AnoCell } from "@/components/ano-view";
import type { TipoOrcamento } from "@/domain/catalog";
import { parsePlanoFromJson } from "@/domain/plano";
import { runDb } from "@/db";
import { lancamentos } from "@/db/schema";
import { requireSessionOrcamento } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function AnoPage({
  searchParams,
}: {
  searchParams: Promise<{ ano?: string }>;
}) {
  const { orcamento } = await requireSessionOrcamento();
  const sp = await searchParams;
  const year = Number(sp.ano) || new Date().getFullYear();
  const ano = String(year);

  const { planejado, realizado } = await runDb(async (db) => {
    const itens = await listItensAtivosParaLancamento(db, orcamento.id);
    const lanc = await db
      .select({
        itemId: lancamentos.itemId,
        valorCentavos: lancamentos.valorCentavos,
        competencia: lancamentos.competencia,
      })
      .from(lancamentos)
      .where(eq(lancamentos.orcamentoId, orcamento.id));

    const planejado: AnoCell[] = itens.map((i) => ({
      tipo: i.tipo as TipoOrcamento,
      grupo: i.grupo,
      valores: parsePlanoFromJson(i.planoCentavosJson),
    }));

    const realMap = new Map<string, number[]>();
    for (const i of itens) {
      realMap.set(i.id, Array(12).fill(0));
    }
    for (const l of lanc) {
      if (!l.competencia.startsWith(`${ano}-`)) continue;
      const month = Number(l.competencia.slice(5, 7)) - 1;
      if (month < 0 || month > 11) continue;
      const arr = realMap.get(l.itemId);
      if (!arr) continue;
      arr[month] = (arr[month] ?? 0) + l.valorCentavos;
    }

    const realizado: AnoCell[] = itens.map((i) => ({
      tipo: i.tipo as TipoOrcamento,
      grupo: i.grupo,
      valores: realMap.get(i.id) ?? Array(12).fill(0),
    }));

    return { planejado, realizado };
  });

  return <AnoView ano={ano} planejado={planejado} realizado={realizado} />;
}
