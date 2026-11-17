export type PassoArquivar = "repouso" | "armado" | "gravando";

export function textoVisivelArquivar(nome: string, passo: PassoArquivar): string {
  if (passo === "gravando") return "…";
  if (passo === "armado") return `Arquivar ${nome}?`;
  return "Arquivar";
}

export function nomeAnunciadoArquivar(nome: string, passo: PassoArquivar): string {
  if (passo === "gravando") return `Arquivando ${nome}`;
  if (passo === "armado") return `Arquivar ${nome}?`;
  return `Arquivar ${nome}`;
}

export function indiceMesAberto(competencia: string): number {
  const match = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(competencia);
  if (!match) return 0;
  return Number(match[2]) - 1;
}
