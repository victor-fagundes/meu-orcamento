import { describe, expect, it } from "vitest";
import { gradeDoAno, type ItemGrade, type LancGrade } from "./ano-grade";

function item(parcial: Partial<ItemGrade> & Pick<ItemGrade, "id" | "tipo" | "grupo" | "nome">): ItemGrade {
  return {
    arquivado: false,
    plano: Array<number>(12).fill(0),
    ...parcial,
  };
}

function grade(itens: ItemGrade[], lancamentos: LancGrade[] = [], ano = "2026", hoje = "2026-11-23") {
  return gradeDoAno({ ano, hoje, itens, lancamentos });
}

describe("gradeDoAno", () => {
  it("ordena tipos, categorias e itens e marca o mês de hoje", () => {
    const resultado = grade([
      item({ id: "b", tipo: "F", grupo: "Saúde", nome: "Academia" }),
      item({ id: "a", tipo: "V", grupo: "Água", nome: "Conta" }),
      item({ id: "s", tipo: "R", grupo: "Renda", nome: "Salário", plano: meses(10, 650099) }),
      item({ id: "z", tipo: "E", grupo: "Festas", nome: "Presentes" }),
      item({ id: "c", tipo: "F", grupo: "Moradia", nome: "Aluguel" }),
    ]);
    const nomes = resultado.realizado.map((linha) => linha.rotulo);
    expect(nomes.indexOf("Receitas")).toBeLessThan(nomes.indexOf("Despesas fixas"));
    expect(nomes.indexOf("Despesas fixas")).toBeLessThan(nomes.indexOf("Despesas variáveis"));
    expect(nomes.indexOf("Despesas variáveis")).toBeLessThan(nomes.indexOf("Anuais"));
    expect(nomes.indexOf("Moradia")).toBeLessThan(nomes.indexOf("Saúde"));
    expect(resultado.planejado.find((linha) => linha.id === "item:s")?.valores[10]).toBe(650099);
    expect(resultado.realizado.find((linha) => linha.id === "item:s")?.valores[10]).toBe(0);
    expect(resultado.mesAtual).toBe(10);
    expect(grade([item({ id: "s", tipo: "R", grupo: "Renda", nome: "Salário" })], [], "2027").mesAtual).toBeNull();
  });

  it("mostra item ativo zerado e esconde arquivado sem movimento", () => {
    const resultado = grade([
      item({ id: "ativo", tipo: "F", grupo: "Moradia", nome: "Aluguel" }),
      item({ id: "arq", tipo: "F", grupo: "Moradia", nome: "Antigo", arquivado: true }),
    ]);
    expect(resultado.realizado.some((linha) => linha.id === "item:ativo")).toBe(true);
    expect(resultado.planejado.some((linha) => linha.id === "item:ativo")).toBe(true);
    expect(resultado.realizado.some((linha) => linha.id === "item:arq")).toBe(false);
    expect(resultado.planejado.some((linha) => linha.id === "item:arq")).toBe(false);
  });

  it("inclui arquivado com lançamento no realizado e com plano no planejado", () => {
    const resultado = grade(
      [
        item({ id: "gasto", tipo: "V", grupo: "Lazer", nome: "Cinema", arquivado: true }),
        item({ id: "plano", tipo: "F", grupo: "Moradia", nome: "Aluguel", arquivado: true, plano: meses(0, 100) }),
      ],
      [{ itemId: "gasto", competencia: "2026-03", valorCentavos: 4000 }],
    );
    expect(resultado.realizado.some((linha) => linha.id === "item:gasto")).toBe(true);
    expect(resultado.realizado.some((linha) => linha.id === "item:plano")).toBe(false);
    expect(resultado.planejado.some((linha) => linha.id === "item:plano")).toBe(true);
    expect(resultado.planejado.some((linha) => linha.id === "item:gasto")).toBe(false);
  });

  it("ignora lançamento de item que não está no orçamento", () => {
    const resultado = grade(
      [item({ id: "a", tipo: "R", grupo: "Renda", nome: "Salário" })],
      [{ itemId: "sumiu", competencia: "2026-01", valorCentavos: 100 }],
    );
    expect(resultado.realizado.some((linha) => linha.rotulo === "sumiu")).toBe(false);
    expect(resultado.realizado.find((linha) => linha.id === "tipo:R")?.valores[0]).toBe(0);
  });

  it("soma a sobra como receitas menos despesas", () => {
    const resultado = grade(
      [
        item({ id: "r", tipo: "R", grupo: "Renda", nome: "Salário" }),
        item({ id: "f", tipo: "F", grupo: "Moradia", nome: "Aluguel" }),
        item({ id: "v", tipo: "V", grupo: "Lazer", nome: "Cinema" }),
      ],
      [
        { itemId: "r", competencia: "2026-01", valorCentavos: 500000 },
        { itemId: "f", competencia: "2026-01", valorCentavos: 200000 },
        { itemId: "v", competencia: "2026-01", valorCentavos: 40000 },
        { itemId: "r", competencia: "2026-02", valorCentavos: 100000 },
        { itemId: "f", competencia: "2026-02", valorCentavos: 160000 },
      ],
    );
    const sobra = resultado.realizado.find((linha) => linha.id === "sobra");
    expect(sobra?.rotulo).toBe("Sobra no ano (receitas − despesas)");
    expect(sobra?.valores[0]).toBe(260000);
    expect(sobra?.valores[1]).toBe(-60000);
    expect(sobra?.valores.reduce((s, n) => s + n, 0)).toBe(200000);
    expect(resultado.realizado.some((linha) => linha.rotulo === "Total despesas")).toBe(false);
    const moradia = resultado.realizado.find((linha) => linha.id === "cat:F:Moradia");
    expect(moradia?.valores[0]).toBe(200000);
    expect(resultado.realizado.find((linha) => linha.id === "tipo:F")?.valores[0]).toBe(200000);
  });

  it("repete o mesmo plano em qualquer ano civil", () => {
    const salario = item({ id: "s", tipo: "R", grupo: "Renda", nome: "Salário", plano: meses(10, 650000) });
    const a = grade([salario], [], "2026");
    const b = grade([salario], [], "2027");
    expect(a.planejado.find((linha) => linha.id === "item:s")?.valores).toEqual(
      b.planejado.find((linha) => linha.id === "item:s")?.valores,
    );
  });

  it("usa a competência gravada", () => {
    const loja = item({ id: "loja", tipo: "V", grupo: "Lazer", nome: "Loja" });
    const realizado = grade(
      [loja],
      [
        { itemId: "loja", competencia: "2026-06", valorCentavos: 3334 },
        { itemId: "loja", competencia: "2026-07", valorCentavos: 3333 },
        { itemId: "loja", competencia: "2026-08", valorCentavos: 3333 },
        { itemId: "loja", competencia: "2026-05", valorCentavos: 1000 },
      ],
    ).realizado.find((linha) => linha.id === "item:loja");
    expect(realizado?.valores[5]).toBe(3334);
    expect(realizado?.valores[4]).toBe(1000);
    expect(realizado?.valores[6]).toBe(3333);
    expect(realizado?.valores[7]).toBe(3333);
    expect((realizado?.valores[5] ?? 0) + (realizado?.valores[6] ?? 0) + (realizado?.valores[7] ?? 0)).toBe(10000);
    const outroAno = grade([loja], [{ itemId: "loja", competencia: "2027-01", valorCentavos: 8000 }], "2026");
    expect(outroAno.realizado.find((linha) => linha.id === "item:loja")?.valores.every((n) => n === 0)).toBe(true);
    const janeiro = grade([loja], [{ itemId: "loja", competencia: "2027-01", valorCentavos: 8000 }], "2027", "2026-11-23");
    expect(janeiro.realizado.find((linha) => linha.id === "item:loja")?.valores[0]).toBe(8000);
    expect(janeiro.planejado.find((linha) => linha.id === "item:loja")?.valores[5]).toBe(0);
  });

  it("marca vazio só sem plano e sem lançamento", () => {
    expect(grade([item({ id: "a", tipo: "R", grupo: "Renda", nome: "Salário" })]).vazio).toBe(true);
    expect(
      grade([item({ id: "a", tipo: "R", grupo: "Renda", nome: "Salário", plano: meses(0, 1) })]).vazio,
    ).toBe(false);
    expect(
      grade(
        [item({ id: "a", tipo: "R", grupo: "Renda", nome: "Salário" })],
        [{ itemId: "a", competencia: "2026-01", valorCentavos: 1 }],
      ).vazio,
    ).toBe(false);
    const soArquivado = grade([
      item({ id: "arq", tipo: "F", grupo: "Moradia", nome: "Antigo", arquivado: true }),
    ]);
    expect(soArquivado.vazio).toBe(true);
    expect(soArquivado.realizado.some((linha) => linha.id === "sobra")).toBe(true);
  });
});

function meses(indice: number, centavos: number): number[] {
  const plano = Array<number>(12).fill(0);
  plano[indice] = centavos;
  return plano;
}
