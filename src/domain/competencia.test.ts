import { describe, expect, it } from "vitest";
import {
  competenciaCartao,
  competenciaMeio,
  competenciasParcelas,
} from "./competencia";

describe("competenciaCartao PRD 5.7", () => {
  it("fechamento 25: 10/05 → maio; 26/05 → junho; dia 25 → junho", () => {
    expect(competenciaCartao("2026-05-10", 25)).toBe("2026-05");
    expect(competenciaCartao("2026-05-26", 25)).toBe("2026-06");
    expect(competenciaCartao("2026-05-25", 25)).toBe("2026-06");
  });

  it("sem fechamento = mês da compra", () => {
    expect(competenciaCartao("2026-05-26", null)).toBe("2026-05");
  });

  it("fechamento fora de 1–28 não devolve competência", () => {
    expect(competenciaCartao("2026-05-10", 0)).toBeNull();
    expect(competenciaCartao("2026-05-10", 29)).toBeNull();
  });

  it("26/12 com fechamento 25 vira janeiro do ano seguinte", () => {
    expect(competenciaCartao("2026-12-26", 25)).toBe("2027-01");
  });

  it("débito/pix = mês da data", () => {
    expect(competenciaMeio("2026-05-26", "deb")).toBe("2026-05");
    expect(competenciaMeio("2026-05-26", "pix")).toBe("2026-05");
  });

  it("3× em 26/05 fechamento 25 → jun, jul, ago", () => {
    expect(competenciasParcelas("2026-05-26", 3, 25)).toEqual([
      "2026-06",
      "2026-07",
      "2026-08",
    ]);
  });
});
