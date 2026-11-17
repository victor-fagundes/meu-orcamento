import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parseSpreadsheetBuffer } from "@/lib/parse-spreadsheet";
import { competenciaCartao } from "./competencia";
import {
  buildLancPreview,
  buildPlanoPreview,
  detectLayout,
  guessMap,
  pickBestSheet,
} from "./import-planilha";

const FIXTURE = path.join(process.cwd(), "fixtures", "controle-financeiro-reference.xlsx");

function loadFixture(): ArrayBuffer {
  const file = readFileSync(FIXTURE);
  return file.buffer.slice(file.byteOffset, file.byteOffset + file.byteLength);
}

describe("fixture controle-financeiro-reference.xlsx", () => {
  const ab = loadFixture();

  it("escolhe Cartão Inter (não Relatórios)", () => {
    const parsed = parseSpreadsheetBuffer(ab, "controle-financeiro-reference.xlsx");
    expect(pickBestSheet(parsed.sheets, parsed.allSheets, "lanc")).toBe("Cartão Inter Victor");
    expect(parsed.sheetName).toBe("Cartão Inter Victor");
    expect(detectLayout(parsed.rows)).toBe("lanc");
  });

  it("prefer plano escolhe Gastos Mensais", () => {
    const parsed = parseSpreadsheetBuffer(ab, "controle-financeiro-reference.xlsx");
    expect(pickBestSheet(parsed.sheets, parsed.allSheets, "plano")).toBe(
      "Planilhas de Gastos Mensais",
    );
  });

  it("prévia de lançamentos: ano da seção + competência cartão (Option B)", () => {
    const parsed = parseSpreadsheetBuffer(
      ab,
      "controle-financeiro-reference.xlsx",
      "Cartão Inter Victor",
    );
    const map = guessMap((parsed.rows[0] || []).map(String));
    expect(map.data).toBe("0");
    expect(map.valor).toBe("2");
    expect(map.desc).toBe("1");
    const prev = buildLancPreview(parsed.rows, map, {
      createItems: true,
      defaultMeio: "pix",
    });
    const ok = prev.filter((r) => r.ok);
    expect(ok.length).toBeGreaterThan(50);
    expect(ok.some((r) => r.dt === "2026-01-05")).toBe(true);
    expect(ok.some((r) => r.dt === "2025-11-28")).toBe(true);

    const sample = ok.filter((r) => r.dt && r.dateYearFromSection).slice(0, 40);
    expect(sample.length).toBeGreaterThanOrEqual(20);
    const yearOk = sample.filter((r) => {
      const y = Number(r.dt!.slice(0, 4));
      return y === 2025 || y === 2026;
    });
    expect(yearOk.length / sample.length).toBeGreaterThanOrEqual(0.95);

    // Option B: competência segue fechamento, não o mês da seção
    const jan = ok.find((r) => r.dt === "2026-01-05");
    expect(jan).toBeTruthy();
    expect(competenciaCartao(jan!.dt!, 25)).toBe("2026-01");
    expect(competenciaCartao("2026-01-26", 25)).toBe("2026-02");
  });

  it("prévia de planejamento em Planilhas de Gastos Mensais", () => {
    const parsed = parseSpreadsheetBuffer(
      ab,
      "controle-financeiro-reference.xlsx",
      "Planilhas de Gastos Mensais",
    );
    expect(detectLayout(parsed.rows)).toBe("plano");
    const prev = buildPlanoPreview(parsed.rows);
    expect(prev.find((r) => r.nome === "Salário")?.tipo).toBe("R");
    expect(prev.find((r) => r.nome === "Aluguel")?.tipo).toBe("F");
    expect(prev.reduce((s, r) => s + r.cellsUpdated, 0)).toBeGreaterThan(20);
  });
});
