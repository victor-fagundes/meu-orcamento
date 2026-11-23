const MESES_PT_BR: readonly string[] = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const MESES_ABREV_PT_BR: readonly string[] = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
];

function assertCentavosInteiros(centavos: number, origem: string): number {
  if (!Number.isFinite(centavos) || !Number.isInteger(centavos)) {
    throw new TypeError(
      `${origem}: valores monetários devem ser números inteiros em centavos (recebido: ${String(centavos)}).`
    );
  }
  return centavos;
}

/**
 * Formata um valor inteiro em centavos para moeda BRL (ex.: 15025 -> "R$ 150,25").
 * Nunca realiza aritmética de ponto flutuante.
 */
export function formatarBRL(centavos: number, opcoes?: { readonly omitirSimbolo?: boolean }): string {
  const validado = assertCentavosInteiros(centavos, 'formatarBRL');
  const negativo = validado < 0;
  const abs = Math.abs(validado);

  const parteInteira = Math.trunc(abs / 100);
  const parteDecimal = abs % 100;

  const strInteira = parteInteira
    .toString(10)
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const strDecimal = parteDecimal.toString(10).padStart(2, '0');

  const sinal = negativo ? '-' : '';
  const prefixo = opcoes?.omitirSimbolo ? '' : 'R$ ';

  return `${sinal}${prefixo}${strInteira},${strDecimal}`;
}

/**
 * Lê uma entrada textual de moeda pt-BR (ex.: "R$ 1.234,56", "-45,90", "100")
 * e retorna o valor exato como inteiro em centavos.
 */
export function lerBRL(entrada: string): number {
  const limpa = entrada.trim();
  if (limpa === '') {
    return 0;
  }

  const negativo = limpa.startsWith('-') || limpa.includes('(-');
  const apenasDigitos = limpa.replace(/\D/g, '');
  if (apenasDigitos === '') {
    return 0;
  }

  // Se houver separador decimal explícito (vírgula ou ponto no final), respeita as casas
  const semSimbolo = limpa.replace(/[^\d,.-]/g, '').replace(/^-/, '');
  const matchDecimal = semSimbolo.match(/[,.](\d{1,2})$/);

  let centavos: number;
  if (matchDecimal && matchDecimal[1] !== undefined) {
    const idxSeparador = semSimbolo.lastIndexOf(matchDecimal[0]);
    const parteInteiraStr = semSimbolo.slice(0, idxSeparador).replace(/\D/g, '') || '0';
    const parteDecimalStr = matchDecimal[1].padEnd(2, '0');
    centavos = Number.parseInt(parteInteiraStr, 10) * 100 + Number.parseInt(parteDecimalStr, 10);
  } else {
    // Interpretação de máscara digito-a-digito (cada tecla entra nos centavos)
    centavos = Number.parseInt(apenasDigitos, 10);
  }

  if (!Number.isSafeInteger(centavos)) {
    throw new RangeError('lerBRL: valor monetário excede o limite seguro de inteiros.');
  }

  return negativo && centavos > 0 ? -centavos : centavos;
}

/**
 * Formata uma data ISO ("YYYY-MM-DD") ou Date para "DD/MM/AAAA".
 */
export function formatarDataBR(data: string | Date): string {
  if (typeof data === 'string') {
    const match = data.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match && match[1] && match[2] && match[3]) {
      return `${match[3]}/${match[2]}/${match[1]}`;
    }
    const parsed = new Date(data);
    if (Number.isNaN(parsed.getTime())) {
      return data;
    }
    const dia = String(parsed.getUTCDate()).padStart(2, '0');
    const mes = String(parsed.getUTCMonth() + 1).padStart(2, '0');
    const ano = String(parsed.getUTCFullYear());
    return `${dia}/${mes}/${ano}`;
  }

  if (Number.isNaN(data.getTime())) {
    return '';
  }
  const dia = String(data.getUTCDate()).padStart(2, '0');
  const mes = String(data.getUTCMonth() + 1).padStart(2, '0');
  const ano = String(data.getUTCFullYear());
  return `${dia}/${mes}/${ano}`;
}

/**
 * Formata mês (1..12) e ano para "Mês Ano" (ex.: 11, 2026 -> "Novembro 2026")
 * ou abreviado ("Nov/2026").
 */
export function formatarMesAno(
  mes: number,
  ano: number,
  opcoes?: { readonly abreviado?: boolean }
): string {
  const indice = Math.max(1, Math.min(12, Math.trunc(mes))) - 1;
  if (opcoes?.abreviado) {
    const nomeAbrev = MESES_ABREV_PT_BR[indice] ?? 'Jan';
    return `${nomeAbrev}/${ano}`;
  }
  const nome = MESES_PT_BR[indice] ?? 'Janeiro';
  return `${nome} ${ano}`;
}

/**
 * Formata percentual a partir de razão (0..1) ou pontos percentuais inteiros/decimais.
 * Ex.: formatarPercentual(0.75) -> "75%" | formatarPercentual(82.5, { entradaEmPorcento: true }) -> "82,5%"
 */
export function formatarPercentual(
  valor: number,
  opcoes?: { readonly casasDecimais?: number; readonly entradaEmPorcento?: boolean }
): string {
  const base = opcoes?.entradaEmPorcento ? valor : valor * 100;
  const casas = opcoes?.casasDecimais ?? 0;
  const fator = 10 ** casas;
  const arredondado = Math.round(base * fator) / fator;
  const formatado =
    casas > 0
      ? arredondado.toFixed(casas).replace('.', ',')
      : Math.trunc(arredondado).toString(10);
  return `${formatado}%`;
}

/**
 * Calcula percentual inteiro (0..100+) usando apenas centavos inteiros.
 */
export function calcularPercentualCentavos(realizadoCentavos: number, previstoCentavos: number): number {
  const realizado = assertCentavosInteiros(realizadoCentavos, 'calcularPercentualCentavos');
  const previsto = assertCentavosInteiros(previstoCentavos, 'calcularPercentualCentavos');
  if (previsto <= 0) {
    return realizado > 0 ? 100 : 0;
  }
  return Math.round((realizado * 100) / previsto);
}
