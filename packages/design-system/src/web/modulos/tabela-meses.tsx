import type { LinhaTabelaMeses, TabelaMesesProps } from '../../base/contratos.ts';
import { linhaValida, textoCelulaAno, totalDaLinha } from '../../modulos/tabela-meses.ts';

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'] as const;

function classeLinha(linha: LinhaTabelaMeses): string {
  const classes = [`mo-tabela-meses__${linha.nivel}`];
  if (linha.nivel === 'sobra') classes.push('mo-tabela-meses__destaque');
  return classes.join(' ');
}

/** Tabela de 12 meses do Ano (web). Dígitos tabulares; mês de hoje destacado. */
export function TabelaMeses({ linhas, mesAtivo, legenda, ocultado = false }: TabelaMesesProps) {
  const linhasValidas = linhas.filter(linhaValida);
  return (
    <div className="mo-tabela-meses-wrapper">
      <table className="mo-tabela-meses">
        <caption>{legenda}</caption>
        <thead>
          <tr>
            <th scope="col">Categoria · item</th>
            {MESES.map((mes, indice) => (
              <th key={mes} scope="col" className={indice === mesAtivo ? 'mo-tabela-meses__ativo' : undefined}>
                {indice === mesAtivo ? `${mes} mês atual` : mes}
              </th>
            ))}
            <th scope="col">Total</th>
          </tr>
        </thead>
        <tbody>
          {linhasValidas.map((linha) => (
            <tr key={linha.id} className={classeLinha(linha)}>
              <th scope="row">{linha.rotulo}</th>
              {linha.valoresPorMes.map((valor, indice) => (
                <td key={indice} className={indice === mesAtivo ? 'mo-tabela-meses__ativo' : undefined}>
                  {textoCelulaAno(valor, ocultado)}
                </td>
              ))}
              <td>{textoCelulaAno(totalDaLinha(linha.valoresPorMes), ocultado)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
