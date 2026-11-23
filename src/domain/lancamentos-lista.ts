/** Textos e filtro da lista de lançamentos. Inteiros em centavos. Sem React, Next ou banco. */

const MESES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
] as const;

const MESES_CURTOS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"] as const;

export type LinhaFiltro = {
  id: string;
  descricao: string;
  itemNome: string;
  itemId: string;
  meio: string;
};

export type PreviaParcela = {
  competencia: string;
  valorCentavos: number;
};

export type PreviaTexto = {
  titulo: string | null;
  linhas: string[];
  aviso: string | null;
};

function partesCompetencia(competencia: string): { ano: string; mes: number } | null {
  const encontrado = /^(\d{4})-(\d{2})$/.exec(competencia);
  if (!encontrado) return null;
  const mes = Number(encontrado[2]);
  if (mes < 1 || mes > 12) return null;
  return { ano: encontrado[1] ?? "", mes };
}

/** "2026-11" -> "novembro". */
export function textoMes(competencia: string): string {
  const partes = partesCompetencia(competencia);
  if (!partes) return competencia;
  return MESES[partes.mes - 1] ?? competencia;
}

/** "2026-11" -> "novembro de 2026". */
export function textoMesAno(competencia: string): string {
  const partes = partesCompetencia(competencia);
  if (!partes) return competencia;
  const nome = MESES[partes.mes - 1];
  return nome ? `${nome} de ${partes.ano}` : competencia;
}

/** "2026-06" -> "Jun/2026". */
export function textoCompetenciaCurta(competencia: string): string {
  const partes = partesCompetencia(competencia);
  if (!partes) return competencia;
  const nome = MESES_CURTOS[partes.mes - 1];
  return nome ? `${nome}/${partes.ano}` : competencia;
}

/** Centavos inteiros no formato do design system: 3334 -> "R$ 33,34". */
export function textoValor(centavos: number): string {
  const inteiro = Math.trunc(centavos);
  const negativo = inteiro < 0;
  const absoluto = Math.abs(inteiro);
  const reais = Math.trunc(absoluto / 100);
  const cent = absoluto % 100;
  const grupo = String(reais).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${negativo ? "−" : ""}R$ ${grupo},${String(cent).padStart(2, "0")}`;
}

/** "2026-11-12" -> "12/11/2026". */
export function textoData(iso: string): string {
  const encontrado = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!encontrado) return iso;
  return `${encontrado[3]}/${encontrado[2]}/${encontrado[1]}`;
}

/** "Parcela 2 de 6 · restam 4". À vista (total nulo ou 1) não tem texto. */
export function textoParcela(parcelaN: number | null, parcelaTotal: number | null): string | null {
  if (parcelaN == null || parcelaTotal == null || parcelaTotal <= 1) return null;
  const restam = parcelaTotal - parcelaN;
  return `Parcela ${parcelaN} de ${parcelaTotal} · restam ${restam}`;
}

/** "2026-06" -> "Fatura 06/2026". */
export function textoFatura(competencia: string): string {
  const partes = partesCompetencia(competencia);
  if (!partes) return "";
  return `Fatura ${String(partes.mes).padStart(2, "0")}/${partes.ano}`;
}

/** Selo só no cartão com fechamento de 1 a 28. */
export function textoFaturaSe(
  meio: string,
  diaFechamento: number | null | undefined,
  competencia: string,
): string | null {
  if (meio !== "cartao") return null;
  if (diaFechamento == null || diaFechamento < 1 || diaFechamento > 28) return null;
  const texto = textoFatura(competencia);
  return texto || null;
}

export function textoPrevia(
  parcelas: readonly PreviaParcela[],
  opcoes: { cartao: boolean; diaFechamento: number | null },
): PreviaTexto {
  if (parcelas.length === 0) return { titulo: null, linhas: [], aviso: null };
  const primeira = parcelas[0];
  if (!primeira) return { titulo: null, linhas: [], aviso: null };
  const iguais = parcelas.every((parcela) => parcela.valorCentavos === primeira.valorCentavos);
  const titulo = parcelas.length > 1
    ? iguais
      ? `Prévia: ${parcelas.length} parcelas de ${textoValor(primeira.valorCentavos)}`
      : `Prévia: ${parcelas.length} parcelas`
    : null;
  const linhas = parcelas.map(
    (parcela) => `${textoCompetenciaCurta(parcela.competencia)} · ${textoValor(parcela.valorCentavos)}`,
  );
  const semFechamento = opcoes.cartao && (opcoes.diaFechamento == null || opcoes.diaFechamento < 1 || opcoes.diaFechamento > 28);
  return {
    titulo,
    linhas,
    aviso: semFechamento ? "Sem dia de fechamento, a competência é o mês da compra." : null,
  };
}

/** Busca na descrição e no nome do item. Acento permanece. A ordem de entrada permanece. */
export function filtrarLancamentos<T extends LinhaFiltro>(
  linhas: readonly T[],
  q: string,
  itemId: string,
  pagamento: string,
): T[] {
  const termo = q.trim().toLowerCase();
  return linhas.filter((linha) => {
    if (termo) {
      const descricao = linha.descricao.toLowerCase();
      const item = linha.itemNome.toLowerCase();
      if (!descricao.includes(termo) && !item.includes(termo)) return false;
    }
    if (itemId && linha.itemId !== itemId) return false;
    if (pagamento === "cartao") {
      if (linha.meio !== "cartao") return false;
    } else if (pagamento && linha.meio !== pagamento) {
      return false;
    }
    return true;
  });
}
