import {
  previewImportLancamentos,
  previewVfPlano,
} from "@/application/import-planilha";
import type { ColumnMap } from "@/domain/import-planilha";
import { isApiError, requireApiSession } from "@/lib/api-session";
import { jsonError, jsonOk } from "@/lib/api-v1";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const ctx = await requireApiSession(request);
  if (isApiError(ctx)) return ctx;

  let body: {
    kind?: string;
    rowsJson?: string;
    map?: ColumnMap;
    createItems?: boolean;
    defaultMeio?: string;
  };
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "JSON inválido");
  }

  if (!body.rowsJson) return jsonError(400, "rowsJson obrigatório");
  const rows = JSON.parse(body.rowsJson) as unknown[][];

  if (body.kind === "plano" || body.kind === "vf") {
    const lines = await previewVfPlano(ctx.db, ctx.orcamento.id, rows);
    return jsonOk({ kind: body.kind, lines });
  }

  if (!body.map) return jsonError(400, "map obrigatório para lançamentos");
  const preview = await previewImportLancamentos(ctx.db, ctx.orcamento.id, rows, body.map, {
    createItems: body.createItems ?? true,
    defaultMeio: body.defaultMeio ?? "pix",
  });
  return jsonOk({ kind: "lanc", preview });
}
