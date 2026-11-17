import { describe, expect, it } from "vitest";
import { collapseDonutGroups } from "./resumo-donut";

describe("collapseDonutGroups", () => {
  it("mantém quatro categorias", () => {
    const groups: [string, number][] = [
      ["A", 40],
      ["B", 30],
      ["C", 20],
      ["D", 10],
    ];
    expect(collapseDonutGroups(groups).map(([name]) => name)).toEqual(["A", "B", "C", "D"]);
  });

  it("com cinco categorias junta a menor em Outros", () => {
    const groups: [string, number][] = [
      ["A", 50],
      ["B", 40],
      ["C", 30],
      ["D", 20],
      ["E", 10],
    ];
    expect(collapseDonutGroups(groups)).toEqual([
      ["A", 50],
      ["B", 40],
      ["C", 30],
      ["D", 20],
      ["Outros", 10],
    ]);
  });
});
