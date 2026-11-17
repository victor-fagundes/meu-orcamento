import { and, eq } from "drizzle-orm";
import { loadAlertasMes } from "@/application/alertas-mes";
import { listCartoesAtivos } from "@/application/cartoes";
import { listItensAtivosParaLancamento } from "@/application/itens";
import { competenciaAtual } from "@/application/lancamentos";
import { AlertBanner } from "@/components/alert-banner";
import { ResumoDashboard } from "@/components/resumo-dashboard";
import { runDb } from "@/db";
import { lancamentos } from "@/db/schema";
import { parseCompetencia, planoDoMes } from "@/lib/competencia-nav";
import { requireSessionOrcamento } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function ResumoPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string }>;
}) {
  const { orcamento } = await requireSessionOrcamento();
  const sp = await searchParams;
  const requested = sp.mes ?? competenciaAtual();
  const competencia = parseCompetencia(requested) ? requested : competenciaAtual();

  const { itensView, cartoesView, lancView, alertas } = await runDb(async (db) => {
    const itens = await listItensAtivosParaLancamento(db, orcamento.id);
    const cartoes = await listCartoesAtivos(db, orcamento.id);
    const lanc = await db
      .select({
        id: lancamentos.id,
        itemId: lancamentos.itemId,
        valorCentavos: lancamentos.valorCentavos,
        meio: lancamentos.meio,
        cartaoId: lancamentos.cartaoId,
        competencia: lancamentos.competencia,
      })
      .from(lancamentos)
      .where(
        and(eq(lancamentos.orcamentoId, orcamento.id), eq(lancamentos.competencia, competencia)),
      );

    const { alertas: als } = await loadAlertasMes(db, orcamento.id, competencia);
    const itemById = new Map(itens.map((i) => [i.id, i]));
    return {
      alertas: als,
      itensView: itens.map((i) => ({
        id: i.id,
        tipo: i.tipo,
        grupo: i.grupo,
        nome: i.nome,
        planoMes: planoDoMes(i.planoCentavosJson, competencia),
      })),
      cartoesView: cartoes.map((c) => ({ id: c.id, apelido: c.apelido })),
      lancView: lanc.map((l) => {
        const it = itemById.get(l.itemId);
        return {
          id: l.id,
          itemId: l.itemId,
          valorCentavos: l.valorCentavos,
          meio: l.meio,
          cartaoId: l.cartaoId,
          competencia: l.competencia,
          itemTipo: it?.tipo ?? "V",
          itemGrupo: it?.grupo ?? "—",
        };
      }),
    };
  });

  return (
    <main id="conteudo">
      <AlertBanner alertas={alertas} />
      <ResumoDashboard
        competencia={competencia}
        itens={itensView}
        lancamentos={lancView}
        cartoes={cartoesView}
      />
    </main>
  );
}
