import { commitImportPdf } from "@/application/import-pdf";
import type { PdfPreviewRow } from "@/domain/import-pdf";
import { isApiError, requireApiSession } from "@/lib/api-session";
import { jsonError, jsonOk } from "@/lib/api-v1";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const ctx = await requireApiSession(request);
  if (isApiError(ctx)) return ctx;

  let body: {
    cartaoId?: string;
    preview?: PdfPreviewRow[];
    estornoMode?: "R" | "ignore";
  };
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "JSON inválido");
  }

  if (!body.cartaoId) return jsonError(400, "Selecione o cartão destino.");
  if (!body.preview?.length) return jsonError(400, "Prévia vazia.");

  const report = await commitImportPdf(ctx.db, ctx.orcamento.id, {
    cartaoId: body.cartaoId,
    rows: body.preview,
    estornoMode: body.estornoMode ?? "ignore",
  });
  return jsonOk(report);
}
