import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { detectPdfScan } from "@/domain/import-pdf";

const require = createRequire(path.join(process.cwd(), "package.json"));

export const MAX_PDF_BYTES = 4 * 1024 * 1024;

export type PdfExtractResult =
  | { ok: true; text: string; pages: number }
  | { ok: false; error: string; scan?: boolean };

/**
 * Extrai texto de PDF selecionável via pdf.js (em memória; não persiste arquivo).
 */
export async function extractPdfText(buf: ArrayBuffer): Promise<PdfExtractResult> {
  try {
    // Legacy build funciona melhor em Node/server actions
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(
      require.resolve("pdfjs-dist/legacy/build/pdf.worker.mjs"),
    ).href;
    const loadingTask = pdfjs.getDocument({
      data: new Uint8Array(buf),
      useSystemFonts: true,
      isEvalSupported: false,
    });
    const pdf = await loadingTask.promise;
    let text = "";
    for (let p = 1; p <= pdf.numPages; p++) {
      const page = await pdf.getPage(p);
      const tc = await page.getTextContent();
      const line = tc.items
        .map((it) => ("str" in it ? String((it as { str: string }).str) : ""))
        .join(" ");
      text += line + "\n";
    }

    if (detectPdfScan(text)) {
      return {
        ok: false,
        scan: true,
        error:
          "Este PDF parece ser uma imagem. Baixe o PDF original no app do banco (com texto selecionável) ou lance manualmente.",
      };
    }

    return { ok: true, text, pages: pdf.numPages };
  } catch (e) {
    return {
      ok: false,
      error: e instanceof Error ? e.message : "Falha ao ler PDF",
    };
  }
}
