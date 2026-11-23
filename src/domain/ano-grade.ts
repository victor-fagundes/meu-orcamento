export type TipoAno = "R" | "F" | "V" | "E";
export type NivelLinhaAno = "tipo" | "categoria" | "item" | "sobra";

export type ItemGrade = {
  id: string;
  tipo: TipoAno;
  grupo: string;
  nome: string;
  arquivado: boolean;
  plano: number[];
};

export type LancGrade = {
  itemId: string;
  competencia: string;
  valorCentavos: number;
};

export type LinhaGrade = {
  id: string;
  nivel: NivelLinhaAno;
  rotulo: string;
  valores: number[];
};

export type GradeAno = {
  ano: string;
  vazio: boolean;
  mesAtual: number | null;
  realizado: LinhaGrade[];
  planejado: LinhaGrade[];
};

const TIPOS: { tipo: TipoAno; rotulo: string }[] = [
  { tipo: "R", rotulo: "Receitas" },
  { tipo: "F", rotulo: "Despesas fixas" },
  { tipo: "V", rotulo: "Despesas variáveis" },
  { tipo: "E", rotulo: "Anuais" },
];

const ROTULO_SOBRA = "Sobra no ano (receitas − despesas)";

function zeros(): number[] {
  return Array<number>(12).fill(0);
}

function plano12(plano: number[]): number[] {
  const out = zeros();
  for (let i = 0; i < 12; i++) out[i] = Math.trunc(plano[i] ?? 0);
  return out;
}

function somar(linhas: number[][]): number[] {
  const out = zeros();
  for (const linha of linhas) {
    for (let i = 0; i < 12; i++) out[i] = (out[i] ?? 0) + (linha[i] ?? 0);
  }
  return out;
}

function mesDaCompetencia(competencia: string, ano: string): number | null {
  if (!competencia.startsWith(`${ano}-`)) return null;
  const mes = Number(competencia.slice(5, 7)) - 1;
  if (!Number.isInteger(mes) || mes < 0 || mes > 11) return null;
  return mes;
}

function indiceMesAtual(ano: string, hoje: string): number | null {
  const encontrado = /^(\d{4})-(\d{2})-\d{2}$/.exec(hoje);
  if (!encontrado || encontrado[1] !== ano) return null;
  const mes = Number(encontrado[2]) - 1;
  if (mes < 0 || mes > 11) return null;
  return mes;
}

function realizadoDoItem(item: ItemGrade, lancamentos: LancGrade[], ano: string): number[] {
  const valores = zeros();
  for (const lancamento of lancamentos) {
    if (lancamento.itemId !== item.id) continue;
    const mes = mesDaCompetencia(lancamento.competencia, ano);
    if (mes === null) continue;
    valores[mes] = (valores[mes] ?? 0) + Math.trunc(lancamento.valorCentavos);
  }
  return valores;
}

function visivel(item: ItemGrade, lancamentos: LancGrade[], ano: string, modo: "realizado" | "planejado"): boolean {
  if (!item.arquivado) return true;
  if (modo === "planejado") return plano12(item.plano).some((valor) => valor !== 0);
  return lancamentos.some(
    (lancamento) => lancamento.itemId === item.id && mesDaCompetencia(lancamento.competencia, ano) !== null,
  );
}

function porNome(a: string, b: string): number {
  return a.localeCompare(b, "pt-BR");
}

function linhasDoModo(
  itens: ItemGrade[],
  lancamentos: LancGrade[],
  ano: string,
  modo: "realizado" | "planejado",
): LinhaGrade[] {
  const linhas: LinhaGrade[] = [];
  for (const tipo of TIPOS) {
    const doTipo = itens.filter((item) => item.tipo === tipo.tipo && visivel(item, lancamentos, ano, modo));
    const grupos = [...new Set(doTipo.map((item) => item.grupo))].sort(porNome);
    const blocos: LinhaGrade[] = [];
    const valoresCategorias: number[][] = [];
    for (const grupo of grupos) {
      const doGrupo = doTipo
        .filter((item) => item.grupo === grupo)
        .sort((a, b) => porNome(a.nome, b.nome));
      if (doGrupo.length === 0) continue;
      const itensLinhas: LinhaGrade[] = doGrupo.map((item) => ({
        id: `item:${item.id}`,
        nivel: "item",
        rotulo: item.nome,
        valores: modo === "realizado" ? realizadoDoItem(item, lancamentos, ano) : plano12(item.plano),
      }));
      const valores = somar(itensLinhas.map((linha) => linha.valores));
      blocos.push({ id: `cat:${tipo.tipo}:${grupo}`, nivel: "categoria", rotulo: grupo, valores });
      blocos.push(...itensLinhas);
      valoresCategorias.push(valores);
    }
    if (blocos.length === 0) continue;
    linhas.push({
      id: `tipo:${tipo.tipo}`,
      nivel: "tipo",
      rotulo: tipo.rotulo,
      valores: somar(valoresCategorias),
    });
    linhas.push(...blocos);
  }

  const porTipo = (tipo: TipoAno) => linhas.find((linha) => linha.id === `tipo:${tipo}`)?.valores ?? zeros();
  const despesas = somar([porTipo("F"), porTipo("V"), porTipo("E")]);
  const receitas = porTipo("R");
  linhas.push({
    id: "sobra",
    nivel: "sobra",
    rotulo: ROTULO_SOBRA,
    valores: receitas.map((valor, indice) => valor - (despesas[indice] ?? 0)),
  });
  return linhas;
}

export function gradeDoAno(input: {
  ano: string;
  hoje: string;
  itens: readonly ItemGrade[];
  lancamentos: readonly LancGrade[];
}): GradeAno {
  const itens = [...input.itens];
  const lancamentos = [...input.lancamentos];
  const planosZero = itens.every((item) => plano12(item.plano).every((valor) => valor === 0));
  const semLancamento = !lancamentos.some((lancamento) => mesDaCompetencia(lancamento.competencia, input.ano) !== null);
  return {
    ano: input.ano,
    vazio: planosZero && semLancamento,
    mesAtual: indiceMesAtual(input.ano, input.hoje),
    realizado: linhasDoModo(itens, lancamentos, input.ano, "realizado"),
    planejado: linhasDoModo(itens, lancamentos, input.ano, "planejado"),
  };
}
