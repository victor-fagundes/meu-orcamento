import { describe, expect, it } from "vitest";
import { extractPdfText } from "./parse-pdf";

function textPdf(line: string): ArrayBuffer {
  const stream = `BT /F1 12 Tf 40 100 Td (${line}) Tj ET\n`;
  const body = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 300 200]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj
4 0 obj<</Length ${Buffer.byteLength(stream)}>>stream
${stream}endstream
endobj
5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
trailer<</Root 1 0 R>>
%%EOF`;
  const bytes = new TextEncoder().encode(body);
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}

describe("extractPdfText", () => {
  it("não falha por worker ausente", async () => {
    const result = await extractPdfText(
      textPdf("10/03 MERCADO EXTRA COMPRA DO MES COM TEXTO SELECIONAVEL 45,90"),
    );
    if (!result.ok) {
      expect(result.error).not.toMatch(/workerSrc|fake worker/i);
      return;
    }
    expect(result.text).toContain("MERCADO");
    expect(result.pages).toBe(1);
  });
});
