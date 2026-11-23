import { describe, expect, it } from "vitest";
import { categoriasDoTipo, fraseDaLinha, textoDemaisAlertas, totalDoTipo } from "./orcamento-lista";

describe("lista do orçamento", () => {
  it("põe quem tem valor na frente e ordena cada bloco em pt-BR", () => {
    const categorias = categoriasDoTipo([
      { nome: "Z", grupo: "Zebra", realizadoCentavos: 0, planejadoCentavos: 0 },
      { nome: "Casa item", grupo: "Casa", realizadoCentavos: 100, planejadoCentavos: 0 },
      { nome: "Beta item", grupo: "Beta", realizadoCentavos: 0, planejadoCentavos: 0 },
      { nome: "Água item", grupo: "Água", realizadoCentavos: 0, planejadoCentavos: 50 },
    ]);
    expect(categorias.map((categoria) => categoria.nome)).toEqual(["Água", "Casa", "Beta", "Zebra"]);
    expect(categorias[0]).toMatchObject({ realizadoCentavos: 0, planejadoCentavos: 50 });
    expect(categorias[1]).toMatchObject({ realizadoCentavos: 100, planejadoCentavos: 0 });
  });

  it("soma realizado e planejado da categoria a partir dos itens", () => {
    const [moradia] = categoriasDoTipo([
      { nome: "Aluguel", grupo: "Moradia", realizadoCentavos: 1000, planejadoCentavos: 2000 },
      { nome: "Condomínio", grupo: "Moradia", realizadoCentavos: 50, planejadoCentavos: 80 },
    ]);
    expect(moradia?.realizadoCentavos).toBe(1050);
    expect(moradia?.planejadoCentavos).toBe(2080);
    expect(moradia?.itens).toHaveLength(2);
  });

  it("corta os centavos do total do tipo", () => {
    const total = totalDoTipo([
      { nome: "A", grupo: "G", realizadoCentavos: 196099, planejadoCentavos: 208050 },
    ]);
    expect(total.realizado).toBe("R$ 1.960");
    expect(total.planejado).toBe("de R$ 2.080 planejados");
  });

  it("usa a frase do consumo e o limite da categoria", () => {
    expect(fraseDaLinha(7900, 10000, 80)).toBe("Dentro do planejado");
    expect(fraseDaLinha(8000, 10000, 80)).toBe("Perto do limite · 80%");
    expect(fraseDaLinha(8790, 10000, 80)).toBe("Perto do limite · 87%");
    expect(fraseDaLinha(10000, 10000, 80)).toBe("No limite do planejado");
    expect(fraseDaLinha(50000, 20000, 80)).toBe("Estourou em R$ 300,00");
    expect(fraseDaLinha(5000, 10000, 50)).toBe("Perto do limite · 50%");
    expect(fraseDaLinha(4900, 10000, 50)).toBe("Dentro do planejado");
    expect(fraseDaLinha(0, 0)).toBe("Sem valor planejado");
    expect(fraseDaLinha(100, 0)).toBe("Sem valor planejado");
  });

  it("conta os demais alertas", () => {
    expect(textoDemaisAlertas(0)).toBeNull();
    expect(textoDemaisAlertas(1)).toBe("E mais 1 alerta.");
    expect(textoDemaisAlertas(2)).toBe("E mais 2 alertas.");
  });
});
