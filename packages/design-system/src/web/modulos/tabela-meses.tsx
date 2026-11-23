import type { TabelaMesesProps } from '../../base/contratos.ts';
import { formatarBRLInteiro } from '../../core/formatters.ts';
import { linhaValida, totalDaLinha } from '../../modulos/tabela-meses.ts';

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'] as const;

/** Tabela de 12 meses do Ano (web). Dígitos tabulares; mês ativo destacado. */
export function TabelaMeses({ linhas, mesAtivo }: TabelaMesesProps) {
  const linhasValidas = linhas.filter(linhaValida);
  return (
    <div className="mo-tabela-meses-wrapper">
      <table className="mo-tabela-meses">
        <thead>
          <tr>
            <th scope="col">Categoria</th>
            {MESES.map((mes, indice) => (
              <th key={mes} scope="col" className={indice === mesAtivo ? 'mo-tabela-meses__ativo' : undefined}>{mes}</th>
            ))}
            <th scope="col">Total</th>
          </tr>
        </thead>
        <tbody>
          {linhasValidas.map((linha) => (
            <tr key={linha.rotulo} className={linha.destaque ? 'mo-tabela-meses__destaque' : undefined}>
              <th scope="row">{linha.rotulo}</th>
              {linha.valoresPorMes.map((valor, indice) => (
                <td key={indice} className={indice === mesAtivo ? 'mo-tabela-meses__ativo' : undefined}>
                  {valor === null ? '—' : formatarBRLInteiro(valor)}
                </td>
              ))}
              <td>{formatarBRLInteiro(totalDaLinha(linha.valoresPorMes))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
