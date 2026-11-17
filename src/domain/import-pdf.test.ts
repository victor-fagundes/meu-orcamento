import { describe, expect, it } from "vitest";
import {
  buildPdfPreview,
  detectPdfIssuer,
  detectPdfScan,
  parseParcelaFromDesc,
} from "./import-pdf";

describe("import pdf", () => {
  it("detecta emissor e scan", () => {
    expect(detectPdfIssuer("Fatura Banco Inter cartão")).toBe("inter");
    expect(detectPdfIssuer("Nu Pagamentos S.A.")).toBe("nubank");
    expect(detectPdfScan("")).toBe(true);
    expect(detectPdfScan("a".repeat(50))).toBe(false);
  });

  it("parcela e linhas genéricas", () => {
    expect(parseParcelaFromDesc("LOJA XYZ 3/12")).toEqual({ n: 3, total: 12 });
    expect(parseParcelaFromDesc("Parc. 02 de 06")).toEqual({ n: 2, total: 6 });

    const text = `
Fatura Inter
10/05/2026 SUPERMERCADO ABC 150,90
11/05/2026 UBER TRIP 03/12 45,00
12/05/2026 ESTORNO LOJA 20,00-
TOTAL FATURA 1000,00
`;
    const { issuer, rows, confidence } = buildPdfPreview(text);
    expect(issuer).toBe("inter");
    expect(rows.filter((r) => r.ok).length).toBeGreaterThanOrEqual(2);
    const uber = rows.find((r) => /UBER/i.test(r.desc));
    expect(uber?.parcelaTotal).toBe(12);
    expect(uber?.valCents).toBe(4500);
    expect(rows.some((r) => /total/i.test(r.desc))).toBe(false);
    expect(confidence).toBeGreaterThan(50);
  });
});
