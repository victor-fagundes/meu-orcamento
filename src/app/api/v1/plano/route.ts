import { listItensAtivosParaLancamento } from "@/application/itens";
import { updateItemPlano } from "@/application/plano";
import { parsePlanoFromJson } from "@/domain/plano";
import { isApiError, requireApiSession } from "@/lib/api-session";
import { centavosToBrlString, jsonError, jsonOk, parseCompetenciaParam } from "@/lib/api-v1";
import { competenciaAtual } from "@/application/lancamentos";
import { planoDoMes } from "@/lib/competencia-nav";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const ctx = await requireApiSession(request);
  if (isApiError(ctx)) return ctx;

  const url = new URL(request.url);
  const competencia =
    parseCompetenciaParam(url.searchParams.get("competencia")) ?? competenciaAtual();
  const itens = await listItensAtivosParaLancamento(ctx.db, ctx.orcamento.id);

  return jsonOk({
    competencia,
    itens: itens.map((i) => ({
      id: i.id,
      tipo: i.tipo,
      grupo: i.grupo,
      nome: i.nome,
      planoCentavos: parsePlanoFromJson(i.planoCentavosJson),
      planoMesCentavos: planoDoMes(i.planoCentavosJson, competencia),
    })),
  });
}

export async function PUT(request: Request) {
  const ctx = await requireApiSession(request);
  if (isApiError(ctx)) return ctx;

  let body: { itemId?: string; mesesCentavos?: number[] };
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "JSON inválido");
  }

  if (!body.itemId || !Array.isArray(body.mesesCentavos) || body.mesesCentavos.length !== 12) {
    return jsonError(400, "Informe itemId e mesesCentavos[12]");
  }

  let mesesBRL: string[];
  try {
    mesesBRL = body.mesesCentavos.map((c) => centavosToBrlString(c));
  } catch (e) {
    return jsonError(400, e instanceof Error ? e.message : "mesesCentavos inválidos");
  }

  const res = await updateItemPlano(ctx.db, ctx.orcamento.id, body.itemId, mesesBRL);
  if (!res.ok) return jsonError(400, res.error);
  return jsonOk(res);
}
