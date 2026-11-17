import { describe, expect, it } from "vitest";
import {
  competenciaDestinoImport,
  hrefLancamentosMes,
  textoDestinoImport,
} from "./navegacao-mes";

describe("competenciaDestinoImport", () => {
  it("abre o mês civil quando ele recebeu linha", () => {
    expect(competenciaDestinoImport(["2026-01", "2026-11", "2026-06"], "2026-11")).toBe("2026-11");
  });

  it("sem o mês civil, abre a mais recente e não a primeira", () => {
    expect(competenciaDestinoImport(["2026-01", "2026-06"], "2026-11")).toBe("2026-06");
    expect(competenciaDestinoImport(["2026-08", "2026-02"], "2026-01")).toBe("2026-08");
  });

  it("uma competência abre ela mesma", () => {
    expect(competenciaDestinoImport(["2024-03"], "2026-11")).toBe("2024-03");
  });

  it("conjunto vazio não escolhe mês", () => {
    expect(competenciaDestinoImport([], "2026-11")).toBeNull();
  });

  it("ignora competência inválida", () => {
    expect(competenciaDestinoImport(["2026-13", "2026-04"], "2026-11")).toBe("2026-04");
  });
});

describe("href e relatório", () => {
  it("o card de gasto leva o mês da tela", () => {
    expect(hrefLancamentosMes("2026-04")).toBe("/app/lancamentos?mes=2026-04");
  });

  it("várias competências nomeiam o mês aberto e as outras", () => {
    expect(textoDestinoImport("2026-06", 3)).toBe(
      "ver Lançamentos em 2026-06 · mais 2 competências gravadas",
    );
    expect(textoDestinoImport("2026-11", 2)).toBe(
      "ver Lançamentos em 2026-11 · mais 1 competência gravada",
    );
    expect(textoDestinoImport("2024-03", 1)).toBe("ver Lançamentos em 2024-03");
  });
});
