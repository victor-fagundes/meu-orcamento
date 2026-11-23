import { describe, expect, it } from "vitest";
import { labelCompetencia } from "@/lib/competencia-nav";
import { AREAS, abaAtiva, caminhoComMes, navegacaoMesDaArea } from "@/components/casca-abas";

describe("áreas da casca", () => {
  it("lista as cinco áreas nesta ordem e Resumo, Orçamento e Lançamentos pedem mês", () => {
    expect(AREAS.map((area) => [area.id, area.rotulo, area.endereco, area.icone, area.pedeMes])).toEqual([
      ["resumo", "Resumo", "/app/resumo", "dashboard", true],
      ["orcamento", "Orçamento", "/app/orcamento", "assignment", true],
      ["lancamentos", "Lançamentos", "/app/lancamentos", "list", true],
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

  it("não mostra mês em Ano e Ajustes e desloca no Resumo, no Orçamento e em Lançamentos", () => {
    for (const area of AREAS) {
      if (area.id === "ano" || area.id === "ajustes") {
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
    const orcamento = AREAS.find((area) => area.id === "orcamento");
    if (!orcamento) throw new Error("Orçamento ausente");
    expect(navegacaoMesDaArea(orcamento, "2026-11")?.anterior).toBe("2026-10");
    const lancamentos = AREAS.find((area) => area.id === "lancamentos");
    if (!lancamentos) throw new Error("Lançamentos ausente");
    expect(navegacaoMesDaArea(lancamentos, "2026-11")?.proximo).toBe("2026-12");
  });

  it("troca só o mês e conserva tipo e aberta", () => {
    const caminho = caminhoComMes("/app/orcamento", "tipo=F&aberta=Moradia&aberta=Sa%C3%BAde", "2026-12");
    const params = new URL(caminho, "http://local").searchParams;
    expect(params.get("mes")).toBe("2026-12");
    expect(params.get("tipo")).toBe("F");
    expect(params.getAll("aberta")).toEqual(["Moradia", "Saúde"]);
  });

  it("troca o mês de Lançamentos e conserva busca e filtros", () => {
    const caminho = caminhoComMes("/app/lancamentos", "q=uber&item=abc&pagamento=cartao", "2026-12");
    const params = new URL(caminho, "http://local").searchParams;
    expect(params.get("mes")).toBe("2026-12");
    expect(params.get("q")).toBe("uber");
    expect(params.get("item")).toBe("abc");
    expect(params.get("pagamento")).toBe("cartao");
  });
});
