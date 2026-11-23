import { and, eq } from "drizzle-orm";
import { loadAlertasMes } from "@/application/alertas-mes";
import { listCartoesAtivos } from "@/application/cartoes";
import { listItensAtivosParaLancamento } from "@/application/itens";
import { competenciaAtual } from "@/application/lancamentos";
import { ResumoTela } from "@/components/resumo-tela";
import { lerFiltrosResumo } from "@/components/resumo-filtro";
import { runDb } from "@/db";
import { lancamentos } from "@/db/schema";
import { parseCompetencia, planoDoMes } from "@/lib/competencia-nav";
import { requireSessionOrcamento } from "@/lib/session";

export const dynamic = "force-dynamic";

function hojeIso(agora: Date): string {
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");
  return `${agora.getFullYear()}-${mes}-${dia}`;
}

export default async function ResumoPage({
  searchParams,
}: {
  searchParams: Promise<{ mes?: string; tipo?: string; pagamento?: string; categoria?: string }>;
}) {
  const { orcamento } = await requireSessionOrcamento();
  const sp = await searchParams;
  const agora = new Date();
  const hoje = hojeIso(agora);
  const requested = sp.mes ?? competenciaAtual(agora);
  const competencia = parseCompetencia(requested) ? requested : competenciaAtual(agora);

  const { itensView, cartoesView, lancView, alertas, grupos } = await runDb(async (db) => {
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
        descricao: lancamentos.descricao,
        dataTransacao: lancamentos.dataTransacao,
      })
      .from(lancamentos)
      .where(and(eq(lancamentos.orcamentoId, orcamento.id), eq(lancamentos.competencia, competencia)));

    const { alertas: als } = await loadAlertasMes(db, orcamento.id, competencia);
    const itemById = new Map(itens.map((i) => [i.id, i]));
    const itensView = itens.map((i) => ({
      id: i.id,
      tipo: i.tipo,
      grupo: i.grupo,
      nome: i.nome,
      planoMes: planoDoMes(i.planoCentavosJson, competencia),
    }));
    return {
      alertas: als,
      itensView,
      grupos: [...new Set(itensView.map((i) => i.grupo))].sort((a, b) => a.localeCompare(b, "pt-BR")),
      cartoesView: cartoes.map((c) => ({ id: c.id, apelido: c.apelido })),
      lancView: lanc.map((l) => {
        const it = itemById.get(l.itemId);
        return {
          itemId: l.itemId,
          valorCentavos: l.valorCentavos,
          meio: l.meio,
          cartaoId: l.cartaoId,
          itemTipo: it?.tipo ?? "V",
          itemGrupo: it?.grupo ?? "—",
          data: l.dataTransacao,
          descricao: l.descricao,
          item: it?.nome ?? "Item",
        };
      }),
    };
  });

  const filtros = lerFiltrosResumo(sp, grupos, cartoesView.map((cartao) => cartao.id));

  return (
    <main id="conteudo">
      <ResumoTela
        competencia={competencia}
        hoje={hoje}
        itens={itensView.map((item) => ({
          id: item.id,
          tipo: item.tipo,
          grupo: item.grupo,
          planoMesCentavos: item.planoMes,
        }))}
        lancamentos={lancView}
        cartoes={cartoesView}
        grupos={grupos}
        alertas={alertas}
        filtros={filtros}
      />
    </main>
  );
}
