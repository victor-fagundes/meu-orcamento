"use server";

import { revalidatePath } from "next/cache";
import {
  commitImportLancamentos,
  importVfPlano,
  previewImportLancamentos,
  previewVfPlano,
  type PlanoPreviewLine,
} from "@/application/import-planilha";
import {
  detectLayout,
  emptyMap,
  guessMap,
  hashFileBytes,
  type ColumnMap,
  type LayoutKind,
  type PreviewRow,
} from "@/domain/import-planilha";
import { MAX_IMPORT_BYTES, parseSpreadsheetBuffer } from "@/lib/parse-spreadsheet";
import { requireSessionOrcamento } from "@/lib/session";
import { track } from "@/lib/telemetry";

export type ParseImportResult =
  | {
      ok: true;
      fileHash: string;
      filename: string;
      sheets: string[];
      sheetName: string;
      kind: LayoutKind;
      headers: string[];
      map: ColumnMap;
      rowCount: number;
      rowsJson: string;
      /** JSON de Record<sheetName, rows> para trocar aba no cliente */
      allSheetsJson: string;
    }
  | { ok: false; error: string };

export async function parseImportFileAction(formData: FormData): Promise<ParseImportResult> {
  try {
    await requireSessionOrcamento();
    const file = formData.get("file");
    if (!(file instanceof File)) return { ok: false, error: "Selecione um arquivo." };
    if (file.size > MAX_IMPORT_BYTES) return { ok: false, error: "Arquivo maior que 4 MB." };

    const buf = await file.arrayBuffer();
    const sheetName = String(formData.get("sheetName") || "") || undefined;
    const parsed = parseSpreadsheetBuffer(buf, file.name, sheetName);
    const kind = detectLayout(parsed.rows);
    const headers = (parsed.rows[0] || []).map((c) => String(c ?? ""));
    const map = kind === "lanc" ? guessMap(headers) : emptyMap();
    const fileHash = await hashFileBytes(buf);
    track("import_planilha_iniciada", { kind, rowCount: Math.max(0, parsed.rows.length - 1) });

    return {
      ok: true,
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
    };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Falha ao ler planilha" };
  }
}

export async function previewImportAction(input: {
  rowsJson: string;
  map: ColumnMap;
  createItems: boolean;
  defaultMeio: string;
}): Promise<{ ok: true; preview: PreviewRow[] } | { ok: false; error: string }> {
  try {
    const { db, orcamento } = await requireSessionOrcamento();
    const rows = JSON.parse(input.rowsJson) as unknown[][];
    const preview = await previewImportLancamentos(db, orcamento.id, rows, input.map, {
      createItems: input.createItems,
      defaultMeio: input.defaultMeio,
    });
    return { ok: true, preview };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Falha na prévia" };
  }
}

export async function previewPlanoAction(input: {
  rowsJson: string;
}): Promise<{ ok: true; lines: PlanoPreviewLine[] } | { ok: false; error: string }> {
  try {
    const { db, orcamento } = await requireSessionOrcamento();
    const rows = JSON.parse(input.rowsJson) as unknown[][];
    const lines = await previewVfPlano(db, orcamento.id, rows);
    return { ok: true, lines };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Falha na prévia do plano" };
  }
}

export async function confirmImportAction(input: {
  kind: LayoutKind;
  rowsJson: string;
  map?: ColumnMap;
  createItems: boolean;
  importDuplicates: boolean;
  defaultMeio: string;
  escolhas?: { n: number; grupo: string }[];
}): Promise<
  | {
      ok: true;
      imported: number;
      skipped: number;
      rejected: number;
      itemsCreated: number;
      competencias: string[];
    }
  | { ok: false; error: string }
> {
  try {
    const { db, orcamento } = await requireSessionOrcamento();
    const rows = JSON.parse(input.rowsJson) as unknown[][];

    if (input.kind === "vf" || input.kind === "plano") {
      const report = await importVfPlano(db, orcamento.id, rows, {
        createItems: input.createItems,
        escolhas: input.escolhas,
      });
      revalidatePath("/app/orcamento");
      revalidatePath("/app/resumo");
      revalidatePath("/app/ano");
      track("import_planilha_confirmada", {
        kind: input.kind,
        imported: report.imported,
        rejected: report.rejected,
      });
      return {
        ok: true,
        imported: report.imported,
        skipped: 0,
        rejected: report.rejected,
        itemsCreated: report.itemsCreated,
        competencias: [],
      };
    }

    if (!input.map) return { ok: false, error: "Mapa de colunas ausente." };
    const preview = await previewImportLancamentos(db, orcamento.id, rows, input.map, {
      createItems: input.createItems,
      defaultMeio: input.defaultMeio,
    });

    const report = await commitImportLancamentos(db, orcamento.id, preview, {
      createItems: input.createItems,
      importDuplicates: input.importDuplicates,
    });
    revalidatePath("/app/lancamentos");
    revalidatePath("/app/orcamento");
    revalidatePath("/app/resumo");
    revalidatePath("/app/ano");
    track("import_planilha_confirmada", {
      kind: input.kind,
      imported: report.imported,
      skipped: report.skipped,
      rejected: report.rejected,
    });
    return { ok: true, ...report };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Falha ao importar" };
  }
}
