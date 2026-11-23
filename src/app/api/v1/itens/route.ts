import {
  archiveItem,
  createItem,
  listItensArquivados,
  listItensAtivosParaLancamento,
} from "@/application/itens";
import type { TipoOrcamento } from "@/domain/catalog";
import { isApiError, requireApiSession } from "@/lib/api-session";
import { jsonError, jsonOk } from "@/lib/api-v1";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const ctx = await requireApiSession(request);
  if (isApiError(ctx)) return ctx;
  const escopo = new URL(request.url).searchParams.get("escopo");
  if (escopo === "arquivados") {
    const rows = await listItensArquivados(ctx.db, ctx.orcamento.id);
    return jsonOk({
      itens: rows.map((i) => ({
        id: i.id,
        tipo: i.tipo,
        grupo: i.grupo,
        nome: i.nome,
      })),
    });
  }
  const itens = await listItensAtivosParaLancamento(ctx.db, ctx.orcamento.id);
  return jsonOk({
    itens: itens.map((i) => ({
      id: i.id,
      tipo: i.tipo,
      grupo: i.grupo,
      nome: i.nome,
      arquivado: i.arquivado === 1,
      divida: i.divida === 1,
    })),
  });
}

export async function POST(request: Request) {
  const ctx = await requireApiSession(request);
  if (isApiError(ctx)) return ctx;

  let body: { tipo?: TipoOrcamento; grupo?: string; nome?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "JSON inválido");
  }
  if (!body.tipo || !body.grupo || !body.nome) {
    return jsonError(400, "Campos obrigatórios: tipo, grupo, nome");
  }

  const res = await createItem(ctx.db, ctx.orcamento.id, {
    tipo: body.tipo,
    grupo: body.grupo,
    nome: body.nome,
  });
  if (!res.ok) return jsonError(400, res.error);
  return jsonOk(res, { status: 201 });
}

export async function DELETE(request: Request) {
  const ctx = await requireApiSession(request);
  if (isApiError(ctx)) return ctx;
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  if (!id) return jsonError(400, "id obrigatório");
  const res = await archiveItem(ctx.db, ctx.orcamento.id, id);
  if (!res.ok) return jsonError(400, res.error);
  return jsonOk(res);
}
