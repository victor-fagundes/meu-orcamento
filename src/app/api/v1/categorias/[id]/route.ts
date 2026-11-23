import { renomearCategoria } from "@/application/categorias";
import { isApiError, requireApiSession } from "@/lib/api-session";
import { jsonError, jsonOk } from "@/lib/api-v1";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: Ctx) {
  const session = await requireApiSession(request);
  if (isApiError(session)) return session;
  const { id } = await ctx.params;
  let body: { nome?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "JSON inválido");
  }
  if (body.nome == null) return jsonError(400, "Campo obrigatório: nome");
  const res = await renomearCategoria(session.db, session.orcamento.id, id, body.nome);
  if (!res.ok) return jsonError(res.code === "nao_encontrado" ? 404 : 400, res.error);
  return jsonOk(res);
}
