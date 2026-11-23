import { formatarBRLInteiro } from "../../packages/design-system/src/core/formatters.ts";
import { fraseDoEstado } from "../../packages/design-system/src/modulos/logica.ts";

export type ItemDaLista = {
  nome: string;
  grupo: string;
  realizadoCentavos: number;
  planejadoCentavos: number;
};

export type CategoriaDaLista = {
  nome: string;
  realizadoCentavos: number;
  planejadoCentavos: number;
  itens: ItemDaLista[];
};

export type TotalDoTipo = {
  realizado: string;
  planejado: string;
};

function comValor(categoria: CategoriaDaLista): boolean {
  return categoria.realizadoCentavos > 0 || categoria.planejadoCentavos > 0;
}

function porNome(a: CategoriaDaLista, b: CategoriaDaLista): number {
  return a.nome.localeCompare(b.nome, "pt-BR");
}

/** Agrupa os itens do tipo. Com valor primeiro; zerados depois; alfabético em cada bloco. */
export function categoriasDoTipo(itens: readonly ItemDaLista[]): CategoriaDaLista[] {
  const grupos = new Map<string, CategoriaDaLista>();
  for (const item of itens) {
    const atual = grupos.get(item.grupo) ?? {
      nome: item.grupo,
      realizadoCentavos: 0,
      planejadoCentavos: 0,
      itens: [],
    };
    atual.realizadoCentavos += item.realizadoCentavos;
    atual.planejadoCentavos += item.planejadoCentavos;
    atual.itens.push(item);
    grupos.set(item.grupo, atual);
  }
  const lista = [...grupos.values()];
  return [...lista.filter(comValor).sort(porNome), ...lista.filter((categoria) => !comValor(categoria)).sort(porNome)];
}

/** Corta os centavos do total do tipo. */
export function totalDoTipo(itens: readonly ItemDaLista[]): TotalDoTipo {
  let realizado = 0;
  let planejado = 0;
  for (const item of itens) {
    realizado += item.realizadoCentavos;
    planejado += item.planejadoCentavos;
  }
  return {
    realizado: formatarBRLInteiro(realizado),
    planejado: `de ${formatarBRLInteiro(planejado)} planejados`,
  };
}

/** Frase da linha. Reusa a conta do pacote, com o limite da categoria quando houver. */
export function fraseDaLinha(realizadoCentavos: number, planejadoCentavos: number, limiteAtencao = 80): string {
  return fraseDoEstado(realizadoCentavos, planejadoCentavos, limiteAtencao);
}

/** Linha de contagem abaixo do banner. Zero não gera linha. */
export function textoDemaisAlertas(quantidade: number): string | null {
  if (quantidade <= 0) return null;
  if (quantidade === 1) return "E mais 1 alerta.";
  return `E mais ${quantidade} alertas.`;
}
