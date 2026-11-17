"use server";

import { revalidatePath } from "next/cache";
import { commitImportPdf } from "@/application/import-pdf";
import { buildPdfPreview, type PdfPreviewRow } from "@/domain/import-pdf";
import { extractPdfText, MAX_PDF_BYTES } from "@/lib/parse-pdf";
import { requireSessionOrcamento } from "@/lib/session";
import { track } from "@/lib/telemetry";

export type ParsePdfResult =
  | {
      ok: true;
      issuer: string;
      confidence: number;
      pages: number;
      preview: PdfPreviewRow[];
      meta: { pages: number; issuer: string; lineCount: number };
    }
  | { ok: false; error: string };

export async function parsePdfFaturaAction(formData: FormData): Promise<ParsePdfResult> {
  try {
    await requireSessionOrcamento();
    const file = formData.get("file");
    if (!(file instanceof File)) return { ok: false, error: "Selecione um PDF." };
    if (file.size > MAX_PDF_BYTES) return { ok: false, error: "PDF maior que 4 MB." };
    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      return { ok: false, error: "Envie um arquivo PDF." };
    }

    const buf = await file.arrayBuffer();
    const extracted = await extractPdfText(buf);
    if (!extracted.ok) return { ok: false, error: extracted.error };

    const { issuer, rows, confidence } = buildPdfPreview(extracted.text);
    // Log só metadados (PRD 5.13) — sem conteúdo da fatura
    track("import_pdf_iniciada", {
      issuer,
      pages: extracted.pages,
      lineCount: rows.length,
      confidence,
    });

    return {
      ok: true,
      issuer,
      confidence,
      pages: extracted.pages,
      preview: rows,
      meta: { pages: extracted.pages, issuer, lineCount: rows.length },
    };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Falha ao ler PDF" };
  }
}

export async function confirmPdfImportAction(input: {
  cartaoId: string;
  preview: PdfPreviewRow[];
  estornoMode: "R" | "ignore";
}): Promise<
  | { ok: true; imported: number; skipped: number; rejected: number }
  | { ok: false; error: string }
> {
  try {
    const { db, orcamento } = await requireSessionOrcamento();
    if (!input.cartaoId) return { ok: false, error: "Selecione o cartão destino." };
    const report = await commitImportPdf(db, orcamento.id, {
      cartaoId: input.cartaoId,
      rows: input.preview,
      estornoMode: input.estornoMode,
    });
    revalidatePath("/app/lancamentos");
    revalidatePath("/app/orcamento");
    revalidatePath("/app/resumo");
    revalidatePath("/app/ano");
    track("import_pdf_confirmada", {
      imported: report.imported,
      skipped: report.skipped,
      rejected: report.rejected,
    });
    return { ok: true, ...report };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Falha ao importar PDF" };
  }
}
