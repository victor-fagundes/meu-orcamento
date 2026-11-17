import { describe, expect, it } from "vitest";
import {
  assignPlanoAlvo,
  isGrupoExtraImportado,
  isGrupoNomeDeAba,
  mergePlanFromExtras,
  ordenarGrupos,
  preferirItem,
  type CatalogRef,
} from "./item-unico";

describe("item único", () => {
  it("reconhece só os quatro nomes de aba", () => {
    expect(isGrupoNomeDeAba("Despesas Fixas")).toBe(true);
    expect(isGrupoNomeDeAba("despesas variáveis")).toBe(true);
    expect(isGrupoNomeDeAba("Receitas")).toBe(true);
    expect(isGrupoNomeDeAba("Anuais")).toBe(true);
    expect(isGrupoNomeDeAba("Moradia")).toBe(false);
    expect(isGrupoNomeDeAba("Cartões")).toBe(false);
    expect(isGrupoExtraImportado("Despesas Fixas")).toBe(true);
    expect(isGrupoExtraImportado("Anuais")).toBe(true);
    expect(isGrupoExtraImportado("Receitas")).toBe(false);
    expect(isGrupoExtraImportado("Moradia")).toBe(false);
  });

  it("copia o mês só quando o catálogo está em zero e fica com o maior extra", () => {
    const merged = mergePlanFromExtras(
      [0, 5000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [
        [170000, 9000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [100000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      ],
    );
    expect(merged[0]).toBe(170000);
    expect(merged[1]).toBe(5000);
    expect(merged.slice(2).every((n) => n === 0)).toBe(true);
  });

  it("grupos com plano ou realizado vêm antes, cada bloco em pt-BR", () => {
    const ordered = ordenarGrupos([
      { grupo: "Saúde", plano: 0, realizado: 0 },
      { grupo: "Moradia", plano: 100, realizado: 0 },
      { grupo: "Educação", plano: 0, realizado: 50 },
      { grupo: "Transporte", plano: 0, realizado: 0 },
    ]);
    expect(ordered.map((g) => g.grupo)).toEqual([
      "Educação",
      "Moradia",
      "Saúde",
      "Transporte",
    ]);
  });

  it("prefere o item com plano no mês, depois no ano, depois o primeiro", () => {
    const itens = [
      { id: "vazio", nome: "Aluguel", plano: Array(12).fill(0) },
      { id: "ano", nome: "Aluguel", plano: [100, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
      { id: "mes", nome: "Aluguel", plano: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 200, 0] },
    ];
    expect(preferirItem(itens, 10).id).toBe("mes");
    expect(preferirItem(itens.slice(0, 2), 10).id).toBe("ano");
    expect(
      preferirItem(
        [
          { id: "a", nome: "Aluguel", plano: Array(12).fill(0) },
          { id: "b", nome: "Aluguel", plano: Array(12).fill(0) },
        ],
        10,
      ).id,
    ).toBe("a");
  });

  it("nome inédito vai para Outros e NET/Claro não cola em Internet", () => {
    const catalog: CatalogRef[] = [
      { tipo: "V", grupo: "Habitação", nome: "Internet / TV", ativo: true },
      { tipo: "F", grupo: "Outros", nome: "Outros", ativo: true },
      { tipo: "V", grupo: "Outros", nome: "Outros", ativo: true },
    ];
    const streaming = assignPlanoAlvo(
      { tipo: "F", nome: "Streaming", grupo: "Despesas Fixas" },
      catalog,
    );
    expect(streaming.alvo).toBe("outros");
    expect(streaming.grupo).toBe("Outros");
    expect(streaming.tipo).toBe("F");

    const net = assignPlanoAlvo(
      { tipo: "F", nome: "NET/Claro", grupo: "Despesas Fixas" },
      catalog,
    );
    expect(net.alvo).toBe("outros");
    expect(net.grupo).not.toBe("Habitação");
  });

  it("dois itens do catálogo com o mesmo nome exigem escolha", () => {
    const catalog: CatalogRef[] = [
      { tipo: "F", grupo: "Outros", nome: "Outros", ativo: true },
      { tipo: "V", grupo: "Outros", nome: "Outros", ativo: true },
    ];
    const row = assignPlanoAlvo({ tipo: "F", nome: "Outros", grupo: "Despesas Fixas" }, catalog);
    expect(row.alvo).toBe("escolher");
    expect(row.candidatos).toEqual(["F|Outros", "V|Outros"]);

    const chosen = assignPlanoAlvo(
      { tipo: "F", nome: "Outros", grupo: "Despesas Fixas" },
      catalog,
      "V|Outros",
    );
    expect(chosen.alvo).toBe("catalogo");
    expect(chosen.tipo).toBe("V");
    expect(chosen.grupo).toBe("Outros");

    const bad = assignPlanoAlvo(
      { tipo: "F", nome: "Outros", grupo: "Despesas Fixas" },
      catalog,
      "Moradia",
    );
    expect(bad.alvo).toBe("escolher");
  });
});
