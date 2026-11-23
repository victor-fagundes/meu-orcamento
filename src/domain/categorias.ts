import type { TipoOrcamento } from "./catalog";

export const TIPOS_CATEGORIA: TipoOrcamento[] = ["R", "F", "V", "E"];

export const ERRO_NOME_CATEGORIA_VAZIO = "Informe o nome da categoria.";
export const ERRO_NOME_CATEGORIA_LONGO = "Use no máximo 40 caracteres.";
export const ERRO_NOME_CATEGORIA_LINHA = "Use o nome em uma linha só.";
export const ERRO_NOME_CATEGORIA_DUPLICADO =
  "Escolha outro nome. Já existe uma categoria com esse nome neste tipo.";
export const ERRO_CATEGORIA_NAO_ENCONTRADA = "Categoria não encontrada.";
export const ERRO_TIPO_INVALIDO = "Tipo inválido.";

export type NomeCategoriaOk = { ok: true; nome: string };
export type NomeCategoriaErro = { ok: false; error: string };

/** Rejeita quebra de linha no texto original, antes do trim. */
export function validarNomeCategoria(raw: string): NomeCategoriaOk | NomeCategoriaErro {
  if (raw.includes("\n") || raw.includes("\r")) {
    return { ok: false, error: ERRO_NOME_CATEGORIA_LINHA };
  }
  const nome = raw.trim();
  if (!nome) return { ok: false, error: ERRO_NOME_CATEGORIA_VAZIO };
  if (nome.length > 40) return { ok: false, error: ERRO_NOME_CATEGORIA_LONGO };
  return { ok: true, nome };
}

/** Minúsculas e sem acento. Não aproxima sinônimos. */
export function chaveNome(nome: string): string {
  return nome
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function validarNomeUnicoNoTipo(
  nome: string,
  ativos: { nome: string }[],
): { ok: true } | NomeCategoriaErro {
  const chave = chaveNome(nome);
  if (ativos.some((item) => chaveNome(item.nome) === chave)) {
    return { ok: false, error: ERRO_NOME_CATEGORIA_DUPLICADO };
  }
  return { ok: true };
}

/** Nome que sobrevive quando duas grafias só diferem na caixa. */
export function nomeCanonico(rows: { grupo: string; arquivado: number }[]): string {
  const ativos = rows.filter((row) => row.arquivado === 0);
  const pool = ativos.length > 0 ? ativos : rows;
  const nomes = [...new Set(pool.map((row) => row.grupo))];
  nomes.sort((a, b) => a.localeCompare(b, "pt-BR") || (a < b ? -1 : a > b ? 1 : 0));
  return nomes[0] ?? "";
}
