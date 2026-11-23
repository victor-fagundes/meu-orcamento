import { criarCategoria, listarCategorias } from "@/application/categorias";
import { isApiError, requireApiSession } from "@/lib/api-session";
import { jsonError, jsonOk } from "@/lib/api-v1";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const ctx = await requireApiSession(request);
  if (isApiError(ctx)) return ctx;
  const flag = new URL(request.url).searchParams.get("incluirArquivadas");
  if (flag != null && flag !== "0" && flag !== "1") {
    return jsonError(400, "incluirArquivadas deve ser 0 ou 1");
  }
  const categorias = await listarCategorias(ctx.db, ctx.orcamento.id, {
    incluirArquivadas: flag === "1",
  });
  return jsonOk({ categorias });
}

export async function POST(request: Request) {
  const ctx = await requireApiSession(request);
  if (isApiError(ctx)) return ctx;
  let body: { tipo?: string; nome?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "JSON inválido");
  }
  if (!body.tipo || body.nome == null) {
    return jsonError(400, "Campos obrigatórios: tipo, nome");
  }
  const res = await criarCategoria(ctx.db, ctx.orcamento.id, { tipo: body.tipo, nome: body.nome });
  if (!res.ok) return jsonError(res.code === "nao_encontrado" ? 404 : 400, res.error);
  return jsonOk(res, { status: 201 });
}
