import {
  createCartao,
  inativarCartao,
  listCartoes,
} from "@/application/cartoes";
import { isApiError, requireApiSession } from "@/lib/api-session";
import { jsonError, jsonOk } from "@/lib/api-v1";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const ctx = await requireApiSession(request);
  if (isApiError(ctx)) return ctx;
  const rows = await listCartoes(ctx.db, ctx.orcamento.id);
  return jsonOk({
    cartoes: rows.map((c) => ({
      id: c.id,
      apelido: c.apelido,
      diaFechamento: c.diaFechamento,
      diaVencimento: c.diaVencimento,
      instituicao: c.instituicao,
      ultimos4: c.ultimos4,
      ativo: c.ativo === 1,
    })),
  });
}

export async function POST(request: Request) {
  const ctx = await requireApiSession(request);
  if (isApiError(ctx)) return ctx;

  let body: {
    apelido?: string;
    diaFechamento?: number;
    diaVencimento?: number;
    instituicao?: string;
    ultimos4?: string;
  };
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "JSON inválido");
  }

  const res = await createCartao(ctx.db, ctx.orcamento.id, {
    apelido: body.apelido ?? "",
    diaFechamento: body.diaFechamento ?? 1,
    diaVencimento: body.diaVencimento ?? 1,
    instituicao: body.instituicao,
    ultimos4: body.ultimos4,
  });
  if (!res.ok) return jsonError(400, res.error);
  return jsonOk(res, { status: 201 });
}

export async function PATCH(request: Request) {
  const ctx = await requireApiSession(request);
  if (isApiError(ctx)) return ctx;
  let body: { id?: string; inativar?: boolean };
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "JSON inválido");
  }
  if (!body.id || !body.inativar) return jsonError(400, "Informe id e inativar: true");
  const res = await inativarCartao(ctx.db, ctx.orcamento.id, body.id);
  if (!res.ok) return jsonError(400, res.error);
  return jsonOk(res);
}
