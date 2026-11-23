import { describe, expect, it } from "vitest";
import { totaisDoMes } from "./resumo-mes";
import {
  fraseDoResumo,
  mediaDiariaCentavos,
  mesVazio,
  semanasDoGasto,
  type LinhaSemana,
} from "./resumo-semana";

function linha(parcial: Partial<LinhaSemana> & Pick<LinhaSemana, "data" | "valorCentavos" | "tipo">): LinhaSemana {
  return {
    descricao: "Gasto",
    item: "Item",
    meio: "deb",
    cartaoId: null,
    ...parcial,
  };
}

describe("frase do disponível", () => {
  it("no mês corrente junta percentual truncado e dias que faltam", () => {
    expect(
      fraseDoResumo({
        gastoCentavos: 240_000,
        planejadoCentavos: 300_000,
        competencia: "2026-11",
        hoje: "2026-11-17",
        pagamentoTodas: true,
      }),
    ).toEqual({ percentual: 80, frase: "Usou 80% do planejado · Faltam 13 dias" });
  });

  it("em outro mês o mesmo percentual não cita os dias", () => {
    expect(
      fraseDoResumo({
        gastoCentavos: 240_000,
        planejadoCentavos: 300_000,
        competencia: "2026-10",
        hoje: "2026-11-17",
        pagamentoTodas: true,
      }),
    ).toEqual({ percentual: 80, frase: "Usou 80% do planejado" });
  });

  it("sem plano de despesa não há percentual", () => {
    const frase = fraseDoResumo({
      gastoCentavos: 100,
      planejadoCentavos: 0,
      competencia: "2026-11",
      hoje: "2026-11-17",
      pagamentoTodas: true,
    });
    expect(frase.percentual).toBeNull();
    expect(frase.frase).not.toContain("%");
  });

  it("acima de 100 o percentual passa de 100", () => {
    expect(
      fraseDoResumo({
        gastoCentavos: 105_000,
        planejadoCentavos: 100_000,
        competencia: "2026-10",
        hoje: "2026-11-17",
        pagamentoTodas: true,
      }).percentual,
    ).toBe(105);
  });

  it("pagamento diferente de Todas tira o percentual e mantém os dias do mês corrente", () => {
    expect(
      fraseDoResumo({
        gastoCentavos: 240_000,
        planejadoCentavos: 300_000,
        competencia: "2026-11",
        hoje: "2026-11-17",
        pagamentoTodas: false,
      }),
    ).toEqual({ percentual: null, frase: "Faltam 13 dias" });
  });

  it("87,9% trunca para 87", () => {
    expect(
      fraseDoResumo({
        gastoCentavos: 8_790,
        planejadoCentavos: 10_000,
        competencia: "2026-10",
        hoje: "2026-11-17",
        pagamentoTodas: true,
      }).percentual,
    ).toBe(87);
  });
});

describe("totais do mês", () => {
  it("ainda pode gastar é o planejado das despesas menos o gasto", () => {
    const totais = totaisDoMes(
      [{ id: "1", tipo: "F", grupo: "Casa", planoMesCentavos: 300_000 }],
      [{ itemId: "1", valorCentavos: 240_000, itemTipo: "F", itemGrupo: "Casa" }],
    );
    expect(totais.aindaPodeGastarCentavos).toBe(60_000);
  });
});

describe("semanas fixas", () => {
  it("mês de 31 dias tem cinco semanas e o de 28 tem quatro", () => {
    expect(semanasDoGasto({ competencia: "2026-01", tipo: "todas", lancamentos: [] }).map((s) => s.nome)).toEqual([
      "Semana 1",
      "Semana 2",
      "Semana 3",
      "Semana 4",
      "Semana 5",
    ]);
    expect(semanasDoGasto({ competencia: "2026-02", tipo: "todas", lancamentos: [] })).toHaveLength(4);
  });

  it("data anterior cai na semana 1 e data posterior na última", () => {
    const semanas = semanasDoGasto({
      competencia: "2026-01",
      tipo: "todas",
      lancamentos: [
        linha({ data: "2025-12-15", valorCentavos: 100, tipo: "F" }),
        linha({ data: "2026-02-02", valorCentavos: 200, tipo: "V" }),
      ],
    });
    expect(semanas[0]?.valorCentavos).toBe(100);
    expect(semanas[4]?.valorCentavos).toBe(200);
  });

  it("soma só fixas, variáveis e anuais", () => {
    const semanas = semanasDoGasto({
      competencia: "2026-11",
      tipo: "todas",
      lancamentos: [
        linha({ data: "2026-11-03", valorCentavos: 5_000, tipo: "R" }),
        linha({ data: "2026-11-03", valorCentavos: 1_000, tipo: "F" }),
      ],
    });
    expect(semanas[0]?.valorCentavos).toBe(1_000);
    expect(semanas[0]?.lancamentos).toHaveLength(2);
  });

  it("tipo Receitas zera o gráfico", () => {
    const semanas = semanasDoGasto({
      competencia: "2026-11",
      tipo: "R",
      lancamentos: [linha({ data: "2026-11-03", valorCentavos: 1_000, tipo: "F" })],
    });
    expect(semanas.every((semana) => semana.valorCentavos === 0)).toBe(true);
  });
});

describe("média diária", () => {
  it("no mês corrente divide pelo dia de hoje", () => {
    const semanas = semanasDoGasto({
      competencia: "2026-11",
      tipo: "todas",
      lancamentos: [linha({ data: "2026-11-03", valorCentavos: 10_000, tipo: "F" })],
    });
    const gasto = semanas.reduce((soma, semana) => soma + semana.valorCentavos, 0);
    expect(mediaDiariaCentavos(gasto, 10)).toBe(1_000);
  });

  it("em outro mês divide pelos dias daquele mês", () => {
    expect(mediaDiariaCentavos(3_000, 30)).toBe(100);
  });

  it("arredonda ao centavo mais próximo sem Math.round de float", () => {
    expect(mediaDiariaCentavos(-5, 2)).toBe(-3);
    expect(mediaDiariaCentavos(5, 2)).toBe(3);
  });
});

describe("mês vazio", () => {
  it("é vazio com receita planejada zerada e nenhum lançamento, mesmo com plano de despesa", () => {
    expect(mesVazio(0, 0)).toBe(true);
  });

  it("deixa de ser vazio se houver qualquer lançamento", () => {
    expect(mesVazio(0, 1)).toBe(false);
  });

  it("deixa de ser vazio se a receita planejada for positiva", () => {
    expect(mesVazio(1, 0)).toBe(false);
  });
});
