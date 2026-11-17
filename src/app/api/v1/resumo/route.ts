import { and, eq } from "drizzle-orm";
import { loadAlertasMes } from "@/application/alertas-mes";
import { listCartoesAtivos } from "@/application/cartoes";
import { listItensAtivosParaLancamento } from "@/application/itens";
import { competenciaAtual } from "@/application/lancamentos";
import { lancamentos } from "@/db/schema";
import { isApiError, requireApiSession } from "@/lib/api-session";
import { jsonOk, parseCompetenciaParam } from "@/lib/api-v1";
import { totaisDoMes } from "@/domain/resumo-mes";
import { planoDoMes } from "@/lib/competencia-nav";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const ctx = await requireApiSession(request);
  if (isApiError(ctx)) return ctx;

  const url = new URL(request.url);
  const raw = parseCompetenciaParam(url.searchParams.get("competencia"));
  const competencia = raw ?? competenciaAtual();

  const { db, orcamento } = ctx;
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

  const { alertas } = await loadAlertasMes(db, orcamento.id, competencia);
  const itemById = new Map(itens.map((i) => [i.id, i]));
  const itensMes = itens.map((i) => ({
    id: i.id,
    tipo: i.tipo,
    grupo: i.grupo,
    planoMesCentavos: planoDoMes(i.planoCentavosJson, competencia),
  }));
  const lancamentosMes = lanc.map((l) => {
    const it = itemById.get(l.itemId);
    return {
      itemId: l.itemId,
      valorCentavos: l.valorCentavos,
      itemTipo: it?.tipo ?? "V",
      itemGrupo: it?.grupo ?? "—",
    };
  });

  return jsonOk({
    competencia,
    alertas,
    totais: totaisDoMes(itensMes, lancamentosMes),
    itens: itens.map((i) => ({
      id: i.id,
      tipo: i.tipo,
      grupo: i.grupo,
      nome: i.nome,
      planoMesCentavos: planoDoMes(i.planoCentavosJson, competencia),
    })),
    cartoes: cartoes.map((c) => ({ id: c.id, apelido: c.apelido })),
    lancamentos: lanc.map((l) => {
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
  });
}
