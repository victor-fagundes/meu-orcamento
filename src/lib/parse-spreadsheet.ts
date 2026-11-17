import * as XLSX from "xlsx";
import { decodeCsvBuffer, parseCsvText, pickBestSheet } from "@/domain/import-planilha";

export type WorkbookParse = {
  sheets: string[];
  sheetName: string;
  rows: unknown[][];
  /** Todas as abas já parseadas (troca de aba sem reupload). */
  allSheets: Record<string, unknown[][]>;
};

export function parseSpreadsheetBuffer(
  buf: ArrayBuffer,
  filename: string,
  sheetName?: string,
  prefer?: "lanc" | "plano",
): WorkbookParse {
  const lower = filename.toLowerCase();
  if (lower.endsWith(".csv") || lower.endsWith(".txt")) {
    const text = decodeCsvBuffer(buf);
    const rows = parseCsvText(text);
    return { sheets: ["CSV"], sheetName: "CSV", rows, allSheets: { CSV: rows } };
  }

  const wb = XLSX.read(buf, { type: "array", cellDates: false });
  const sheets = wb.SheetNames;
  if (!sheets.length) throw new Error("Planilha sem abas.");

  const allSheets: Record<string, unknown[][]> = {};
  for (const name of sheets) {
    const ws = wb.Sheets[name];
    if (!ws) continue;
    const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" }) as unknown[][];
    while (rows.length && !rows[0]!.some((c) => String(c).trim())) rows.shift();
    allSheets[name] = rows;
  }

  const name =
    sheetName && sheets.includes(sheetName)
      ? sheetName
      : pickBestSheet(sheets, allSheets, prefer);
  const rows = allSheets[name];
  if (!rows) throw new Error("Aba não encontrada.");
  return { sheets, sheetName: name, rows, allSheets };
}

export const MAX_IMPORT_BYTES = 4 * 1024 * 1024;
