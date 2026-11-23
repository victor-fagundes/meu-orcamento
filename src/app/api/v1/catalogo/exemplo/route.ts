import { applyExamplePlans } from "@/application/catalog";
import { isApiError, requireApiSession } from "@/lib/api-session";
import { jsonError, jsonOk } from "@/lib/api-v1";

export const dynamic = "force-dynamic";

/** Grava planos de exemplo. Não cria lançamento. */
export async function POST(request: Request) {
  const ctx = await requireApiSession(request);
  if (isApiError(ctx)) return ctx;
  try {
    const updated = await applyExamplePlans(ctx.db, ctx.orcamento.id);
    return jsonOk({ ok: true, updated });
  } catch (e) {
    return jsonError(400, e instanceof Error ? e.message : "Falha ao carregar exemplo");
  }
}
