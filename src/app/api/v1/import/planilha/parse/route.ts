import {
  detectLayout,
  emptyMap,
  guessMap,
  hashFileBytes,
} from "@/domain/import-planilha";
import { isApiError, requireApiSession } from "@/lib/api-session";
import { jsonError, jsonOk } from "@/lib/api-v1";
import { MAX_IMPORT_BYTES, parseSpreadsheetBuffer } from "@/lib/parse-spreadsheet";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const ctx = await requireApiSession(request);
  if (isApiError(ctx)) return ctx;

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return jsonError(400, "Selecione um arquivo.");
  if (file.size > MAX_IMPORT_BYTES) return jsonError(400, "Arquivo maior que 4 MB.");

  const buf = await file.arrayBuffer();
  const sheetName = String(form.get("sheetName") || "") || undefined;
  const parsed = parseSpreadsheetBuffer(buf, file.name, sheetName);
  const kind = detectLayout(parsed.rows);
  const headers = (parsed.rows[0] || []).map((c) => String(c ?? ""));
  const map = kind === "lanc" ? guessMap(headers) : emptyMap();
  const fileHash = await hashFileBytes(buf);

  return jsonOk({
    fileHash,
    filename: file.name,
    sheets: parsed.sheets,
    sheetName: parsed.sheetName,
    kind,
    headers,
    map,
    rowCount: Math.max(0, parsed.rows.length - 1),
    rowsJson: JSON.stringify(parsed.rows),
    allSheetsJson: JSON.stringify(parsed.allSheets),
  });
}
