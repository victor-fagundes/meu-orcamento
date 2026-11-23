import { arquivarCategoria } from "@/application/categorias";
import { isApiError, requireApiSession } from "@/lib/api-session";
import { jsonError, jsonOk } from "@/lib/api-v1";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(request: Request, ctx: Ctx) {
  const session = await requireApiSession(request);
  if (isApiError(session)) return session;
  const { id } = await ctx.params;
  const res = await arquivarCategoria(session.db, session.orcamento.id, id);
  if (!res.ok) return jsonError(res.code === "nao_encontrado" ? 404 : 400, res.error);
  return jsonOk({ id: res.id, arquivada: res.arquivada });
}
