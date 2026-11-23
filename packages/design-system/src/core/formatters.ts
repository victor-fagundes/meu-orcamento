import type { Centavos, EstadoConsumo } from './types.ts';

const MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
] as const;

/** Agrupa milhares com ponto: 1234567 -> "1.234.567". Recebe inteiro não negativo. */
function agruparMilhares(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Formata centavos como moeda pt-BR, sem usar ponto flutuante.
 * 123456 -> "R$ 1.234,56"; -4000 -> "−R$ 40,00" (sinal de menos Unicode).
 */
export function formatarBRL(centavos: Centavos): string {
  assertInteiro(centavos, 'formatarBRL');
  const sinal = centavos < 0 ? '−' : '';
  const absoluto = Math.abs(centavos);
  const reais = Math.trunc(absoluto / 100);
  const cent = absoluto % 100;
  return `${sinal}R$ ${agruparMilhares(reais)},${String(cent).padStart(2, '0')}`;
}

/**
 * Formata centavos como moeda sem centavos, para totais grandes: 820000 -> "R$ 8.200".
 * Arredondado para baixo (truncado).
 */
export function formatarBRLInteiro(centavos: Centavos): string {
  assertInteiro(centavos, 'formatarBRLInteiro');
  const sinal = centavos < 0 ? '−' : '';
  return `${sinal}R$ ${agruparMilhares(Math.trunc(Math.abs(centavos) / 100))}`;
}

/**
 * Lê texto digitado em pt-BR e devolve centavos inteiros, ou null se for inválido.
 * Aceita "R$ 1.234,56", "1234,5", "186,40" e "0". Não aceita mais de 2 casas decimais.
 */
export function lerBRL(texto: string): Centavos | null {
  const limpo = texto.replace(/R\$/g, '').replace(/\s/g, '').replace(/\u00a0/g, '');
  if (limpo === '') return null;
  const negativo = limpo.startsWith('-') || limpo.startsWith('−');
  const semSinal = negativo ? limpo.slice(1) : limpo;
  if (!/^\d{1,3}(\.\d{3})*(,\d{1,2})?$|^\d+(,\d{1,2})?$/.test(semSinal)) return null;

  const [parteReais = '0', parteCent = ''] = semSinal.split(',');
  const reais = Number(parteReais.replace(/\./g, ''));
  const cent = Number(parteCent.padEnd(2, '0'));
  if (!Number.isSafeInteger(reais) || !Number.isInteger(cent)) return null;

  const total = reais * 100 + cent;
  return negativo ? -total : total;
}

/** "2026-11-15" -> "15/11/2026". Lança erro para data inválida. */
export function formatarDataBR(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) throw new Error(`formatarDataBR: data inválida "${iso}"`);
  const [, ano, mes, dia] = m;
  return `${dia}/${mes}/${ano}`;
}

/** "2026-11" -> "novembro de 2026". Lança erro para competência inválida. */
export function formatarMesAno(competencia: string): string {
  const m = /^(\d{4})-(\d{2})$/.exec(competencia);
  if (!m) throw new Error(`formatarMesAno: competência inválida "${competencia}"`);
  const ano = m[1];
  const mes = Number(m[2]);
  const nome = MESES[mes - 1];
  if (nome === undefined) throw new Error(`formatarMesAno: mês fora do intervalo "${competencia}"`);
  return `${nome} de ${ano}`;
}

/** Percentual inteiro, arredondado para baixo. 81.9 -> 81. */
export function formatarPercentual(valor: number): string {
  return `${Math.floor(valor)}%`;
}

/**
 * Percentual de consumo em inteiros, sem ponto flutuante.
 * Retorna 0 quando o planejado é zero.
 */
export function calcularPercentual(realizado: Centavos, planejado: Centavos): number {
  assertInteiro(realizado, 'calcularPercentual');
  assertInteiro(planejado, 'calcularPercentual');
  if (planejado === 0) return 0;
  return Math.floor((realizado * 100) / planejado);
}

/** Estado de consumo a partir de realizado e planejado, em centavos. Limite de atenção: 80%. */
export function estadoConsumo(realizado: Centavos, planejado: Centavos, limiteAtencao = 80): EstadoConsumo {
  if (planejado === 0) return 'sem-plano';
  const pct = calcularPercentual(realizado, planejado);
  if (realizado > planejado) return 'estourou';
  if (realizado === planejado) return 'no-limite';
  if (pct >= limiteAtencao) return 'atencao';
  return 'ok';
}

function assertInteiro(valor: number, origem: string): void {
  if (!Number.isInteger(valor)) {
    throw new Error(`${origem}: valor em centavos deve ser inteiro, recebeu ${valor}`);
  }
}
