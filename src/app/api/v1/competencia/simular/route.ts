import { competenciasParcelas } from "@/domain/competencia";
import { isApiError, requireApiSession } from "@/lib/api-session";
import { jsonError, jsonOk } from "@/lib/api-v1";

export const dynamic = "force-dynamic";

/** Prévia da regra de fatura. Nada é gravado. */
export async function POST(request: Request) {
  const ctx = await requireApiSession(request);
  if (isApiError(ctx)) return ctx;

  let body: { data?: string; parcelas?: number; diaFechamento?: number | null };
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "JSON inválido");
  }

  const comps = competenciasParcelas(body.data ?? "", body.parcelas ?? 1, body.diaFechamento ?? null);
  if (!comps || comps.length === 0) return jsonError(400, "Data ilegível");
  return jsonOk({ primeira: comps[0], parcelas: comps });
}
