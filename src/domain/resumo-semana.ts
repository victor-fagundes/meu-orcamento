/**
 * Leitura do Resumo que não cabe em totaisDoMes: frase, semanas fixas e média.
 * Centavos inteiros. Sem React, Next ou banco.
 */

export type FraseResumo = {
  percentual: number | null;
  frase: string;
};

export type LinhaSemana = {
  data: string;
  descricao: string;
  valorCentavos: number;
  tipo: string;
  item: string;
  meio: string;
  cartaoId: string | null;
};

export type SemanaResumo = {
  nome: string;
  valorCentavos: number;
  lancamentos: LinhaSemana[];
};

const TIPOS_DESPESA = new Set(["F", "V", "E"]);

export function diasNoMes(competencia: string): number {
  const ano = Number(competencia.slice(0, 4));
  const mes = Number(competencia.slice(5, 7));
  return new Date(ano, mes, 0).getDate();
}

/** Inteiro truncado. Sem plano, ou pagamento diferente de Todas, não há percentual. */
export function percentualDoPlanejado(
  gastoCentavos: number,
  planejadoCentavos: number,
  pagamentoTodas: boolean,
): number | null {
  if (!pagamentoTodas || planejadoCentavos <= 0) return null;
  return Math.floor((Math.trunc(gastoCentavos) * 100) / Math.trunc(planejadoCentavos));
}

/** Dias que faltam só no mês civil de hoje. No último dia, 0. */
export function diasRestantes(competencia: string, hoje: string): number | null {
  if (hoje.slice(0, 7) !== competencia) return null;
  const dia = Number(hoje.slice(8, 10));
  if (!Number.isFinite(dia)) return null;
  return diasNoMes(competencia) - dia;
}

export function fraseDoResumo(input: {
  gastoCentavos: number;
  planejadoCentavos: number;
  competencia: string;
  hoje: string;
  pagamentoTodas: boolean;
}): FraseResumo {
  const percentual = percentualDoPlanejado(
    input.gastoCentavos,
    input.planejadoCentavos,
    input.pagamentoTodas,
  );
  const dias = diasRestantes(input.competencia, input.hoje);
  const partes: string[] = [];
  if (percentual !== null) partes.push(`Usou ${percentual}% do planejado`);
  if (dias !== null) partes.push(`Faltam ${dias} dias`);
  return { percentual, frase: partes.join(" · ") };
}

/** Semana 1 = dias 1–7 … Semana 4 = 22–28. Semana 5 só se o mês passa de 28. */
export function quantidadeDeSemanas(competencia: string): number {
  return diasNoMes(competencia) >= 29 ? 5 : 4;
}

export function indiceDaSemana(data: string, competencia: string): number {
  const ultima = quantidadeDeSemanas(competencia) - 1;
  const chave = data.slice(0, 7);
  if (chave < competencia) return 0;
  if (chave > competencia) return ultima;
  const dia = Number(data.slice(8, 10));
  if (dia <= 7) return 0;
  if (dia <= 14) return 1;
  if (dia <= 21) return 2;
  if (dia <= 28) return 3;
  return ultima;
}

export function semanasDoGasto(input: {
  competencia: string;
  tipo: "todas" | "R" | "F" | "V" | "E";
  lancamentos: readonly LinhaSemana[];
}): SemanaResumo[] {
  const semanas: SemanaResumo[] = Array.from({ length: quantidadeDeSemanas(input.competencia) }, (_, i) => ({
    nome: `Semana ${i + 1}`,
    valorCentavos: 0,
    lancamentos: [],
  }));
  for (const lancamento of input.lancamentos) {
    if (input.tipo !== "todas" && lancamento.tipo !== input.tipo) continue;
    const semana = semanas[indiceDaSemana(lancamento.data, input.competencia)];
    if (!semana) continue;
    semana.lancamentos.push(lancamento);
    if (TIPOS_DESPESA.has(lancamento.tipo)) {
      semana.valorCentavos += Math.trunc(lancamento.valorCentavos);
    }
  }
  return semanas;
}

/** Centavo mais próximo, para gasto positivo ou negativo. Divisor é o dia de hoje ou os dias do mês. */
export function mediaDiariaCentavos(gastoCentavos: number, divisor: number): number {
  if (divisor <= 0) return 0;
  const negativo = gastoCentavos < 0;
  const absoluto = Math.abs(Math.trunc(gastoCentavos));
  const valor = Math.trunc((absoluto + Math.floor(divisor / 2)) / divisor);
  return negativo ? -valor : valor;
}

export function divisorDaMedia(competencia: string, hoje: string): number {
  if (hoje.slice(0, 7) === competencia) return Number(hoje.slice(8, 10));
  return diasNoMes(competencia);
}

/** Mês vazio antes de qualquer filtro: receita planejada zerada e nenhum lançamento. */
export function mesVazio(planoReceitasCentavos: number, quantidadeLancamentos: number): boolean {
  return planoReceitasCentavos === 0 && quantidadeLancamentos === 0;
}
