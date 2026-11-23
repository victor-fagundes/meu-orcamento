import { describe, expect, it } from "vitest";
import { labelCompetencia } from "@/lib/competencia-nav";
import { AREAS, abaAtiva, navegacaoMesDaArea } from "@/components/casca-abas";

describe("áreas da casca", () => {
  it("lista as cinco áreas nesta ordem e só o Resumo pede mês", () => {
    expect(AREAS.map((area) => [area.id, area.rotulo, area.endereco, area.icone, area.pedeMes])).toEqual([
      ["resumo", "Resumo", "/app/resumo", "dashboard", true],
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

  it("não mostra mês nas outras áreas e desloca no Resumo", () => {
    for (const area of AREAS) {
      if (area.id !== "resumo") {
        expect(navegacaoMesDaArea(area, "2026-11")).toBeNull();
      }
    }
    const resumo = AREAS[0];
    if (!resumo) throw new Error("Resumo ausente");
    expect(navegacaoMesDaArea(resumo, "2026-11")).toEqual({
      rotulo: labelCompetencia("2026-11"),
      anterior: "2026-10",
      proximo: "2026-12",
    });
  });
});
