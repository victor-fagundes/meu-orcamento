import {
  competenciaAtual,
  createLancamentos,
  listLancamentosCompetencia,
} from "@/application/lancamentos";
import { isApiError, requireApiSession } from "@/lib/api-session";
import { centavosToBrlString, jsonError, jsonOk, parseCompetenciaParam } from "@/lib/api-v1";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const ctx = await requireApiSession(request);
  if (isApiError(ctx)) return ctx;

  const url = new URL(request.url);
  const competencia =
    parseCompetenciaParam(url.searchParams.get("competencia")) ?? competenciaAtual();
  const rows = await listLancamentosCompetencia(ctx.db, ctx.orcamento.id, competencia);
  return jsonOk({ competencia, lancamentos: rows });
}

export async function POST(request: Request) {
  const ctx = await requireApiSession(request);
  if (isApiError(ctx)) return ctx;

  let body: {
    itemId?: string;
    descricao?: string;
    valorCentavos?: number;
    dataISO?: string;
    pagamento?: string;
    parcelas?: number;
  };
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "JSON inválido");
  }

  if (!body.itemId || body.valorCentavos == null || !body.dataISO || !body.pagamento) {
    return jsonError(400, "Campos obrigatórios: itemId, valorCentavos, dataISO, pagamento");
  }

  let valorBRL: string;
  try {
    valorBRL = centavosToBrlString(body.valorCentavos);
  } catch (e) {
    return jsonError(400, e instanceof Error ? e.message : "valorCentavos inválido");
  }

  const res = await createLancamentos(ctx.db, ctx.orcamento.id, {
    itemId: body.itemId,
    descricao: body.descricao,
    valorBRL,
    dataISO: body.dataISO,
    pagamento: body.pagamento,
    parcelas: body.parcelas,
  });

  if (!res.ok) return jsonError(400, res.error);
  return jsonOk(res, { status: 201 });
}
