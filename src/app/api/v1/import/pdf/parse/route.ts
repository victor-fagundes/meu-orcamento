import { buildPdfPreview } from "@/domain/import-pdf";
import { isApiError, requireApiSession } from "@/lib/api-session";
import { jsonError, jsonOk } from "@/lib/api-v1";
import { extractPdfText, MAX_PDF_BYTES } from "@/lib/parse-pdf";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const ctx = await requireApiSession(request);
  if (isApiError(ctx)) return ctx;

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return jsonError(400, "Selecione um PDF.");
  if (file.size > MAX_PDF_BYTES) return jsonError(400, "PDF maior que 4 MB.");
  if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
    return jsonError(400, "Envie um arquivo PDF.");
  }

  const buf = await file.arrayBuffer();
  const extracted = await extractPdfText(buf);
  if (!extracted.ok) return jsonError(400, extracted.error);

  const { issuer, rows, confidence } = buildPdfPreview(extracted.text);
  return jsonOk({
    issuer,
    confidence,
    pages: extracted.pages,
    preview: rows,
    meta: { pages: extracted.pages, issuer, lineCount: rows.length },
  });
}
