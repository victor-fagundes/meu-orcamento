import { describe, expect, it } from "vitest";
import { labelCompetencia } from "@/lib/competencia-nav";
import { AREAS, abaAtiva, navegacaoMesDaArea } from "@/components/casca-abas";

describe("áreas da casca", () => {
  it("lista as cinco áreas nesta ordem, com pedeMes falso", () => {
    expect(AREAS.map((area) => [area.id, area.rotulo, area.endereco, area.icone, area.pedeMes])).toEqual([
      ["resumo", "Resumo", "/app/resumo", "dashboard", false],
      ["orcamento", "Orçamento", "/app/orcamento", "assignment", false],
      ["lancamentos", "Lançamentos", "/app/lancamentos", "list", false],
      ["ano", "Ano", "/app/ano", "calendar_month", false],
      ["ajustes", "Ajustes", "/app/ajustes", "settings", false],
    ]);
  });

  it("escolhe a aba pelo caminho e ignora a query", () => {
    expect(abaAtiva("/app/resumo")).toBe("resumo");
    expect(abaAtiva("/app/orcamento?mes=2026-11")).toBe("orcamento");
    expect(abaAtiva("/app/ajustes")).toBe("ajustes");
    expect(abaAtiva("/app/ajustes/conta")).toBe("ajustes");
    expect(abaAtiva("/app/foo")).toBe("");
  });

  it("não mostra mês enquanto a área não pede, e desloca quando pede", () => {
    for (const area of AREAS) {
      expect(navegacaoMesDaArea(area, "2026-11")).toBeNull();
    }
    const resumo = AREAS[0];
    if (!resumo) throw new Error("Resumo ausente");
    const pedido = navegacaoMesDaArea({ ...resumo, pedeMes: true }, "2026-11");
    expect(pedido).toEqual({
      rotulo: labelCompetencia("2026-11"),
      anterior: "2026-10",
      proximo: "2026-12",
    });
  });
});
