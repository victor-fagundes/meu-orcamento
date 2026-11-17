import { and, eq, sql } from "drizzle-orm";
import { loadAlertasMes } from "@/application/alertas-mes";
import { competenciaAtual } from "@/application/lancamentos";
import { listItensAtivosParaLancamento } from "@/application/itens";
import { OrcamentoView } from "@/components/orcamento-view";
import { runDb } from "@/db";
import { lancamentos } from "@/db/schema";
import type { TipoOrcamento } from "@/domain/catalog";
import { labelCompetencia, parseCompetencia, planoDoMes } from "@/lib/competencia-nav";
import { requireSessionOrcamento } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function OrcamentoPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string; tipo?: string }>;
}) {
  const { orcamento } = await requireSessionOrcamento();
  const sp = await searchParams;
  const requested = sp.mes ?? competenciaAtual();
  const competencia = parseCompetencia(requested) ? requested : competenciaAtual();

  const { view, alertas, limites } = await runDb(async (db) => {
    const ativos = await listItensAtivosParaLancamento(db, orcamento.id);
    const gastos = await db
      .select({
        itemId: lancamentos.itemId,
        total: sql<number>`coalesce(sum(${lancamentos.valorCentavos}), 0)`.mapWith(Number),
      })
      .from(lancamentos)
      .where(
        and(eq(lancamentos.orcamentoId, orcamento.id), eq(lancamentos.competencia, competencia)),
      )
      .groupBy(lancamentos.itemId);

    const realizadoMap = new Map(gastos.map((g) => [g.itemId, g.total]));
    const { alertas: als, limites: lim } = await loadAlertasMes(db, orcamento.id, competencia);

    return {
      limites: lim,
      alertas: als,
      view: ativos.map((r) => ({
        id: r.id,
        tipo: r.tipo,
        grupo: r.grupo,
        nome: r.nome,
        planoMes: planoDoMes(r.planoCentavosJson, competencia),
        realizadoMes: realizadoMap.get(r.id) ?? 0,
        divida: r.divida === 1,
        planoJson: r.planoCentavosJson,
      })),
    };
  });

  return (
    <main id="conteudo">
    <OrcamentoView
      itens={view}
      mesLabel={labelCompetencia(competencia)}
      competencia={competencia}
      limites={limites}
      alertas={alertas}
      initialTipo={(["R", "F", "V", "E"] as const).includes(sp.tipo as TipoOrcamento) ? (sp.tipo as TipoOrcamento) : "F"}
    />
    </main>
  );
}
