import { loadAlertasMes } from "@/application/alertas-mes";
import { getLimites, saveLimites } from "@/application/limites";
import { competenciaAtual } from "@/application/lancamentos";
import { isApiError, requireApiSession } from "@/lib/api-session";
import { jsonError, jsonOk, parseCompetenciaParam } from "@/lib/api-v1";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const ctx = await requireApiSession(request);
  if (isApiError(ctx)) return ctx;

  const url = new URL(request.url);
  const competencia =
    parseCompetenciaParam(url.searchParams.get("competencia")) ?? competenciaAtual();
  const limites = await getLimites(ctx.db, ctx.orcamento.id);
  const { alertas } = await loadAlertasMes(ctx.db, ctx.orcamento.id, competencia);
  return jsonOk({ competencia, limites, alertas });
}

export async function PUT(request: Request) {
  const ctx = await requireApiSession(request);
  if (isApiError(ctx)) return ctx;

  let body: { globalPct?: number; cats?: Record<string, number> };
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "JSON inválido");
  }

  const limites = await saveLimites(ctx.db, ctx.orcamento.id, {
    globalPct: body.globalPct ?? 80,
    cats: body.cats ?? {},
  });
  return jsonOk({ limites });
}
