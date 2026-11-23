'use client'
import type { TabelaProps } from '../base/contratos.ts';

/** Células chegam formatadas. A tabela não converte centavos e não soma. */
export function Tabela({ caption, colunas, linhas, selecionadaId, onSelecionar }: TabelaProps) {
  const seleciona = onSelecionar !== undefined;
  return (
    <table className="mo-tabela">
      <caption>{caption}</caption>
      <thead>
        <tr>
          {colunas.map((coluna) => (
            <th key={coluna.id} scope="col" className={coluna.tipo === 'numero' ? 'mo-tabela__numero' : undefined}>
              {coluna.rotulo}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {linhas.map((linha) => {
          const selecionada = selecionadaId !== undefined && linha.id === selecionadaId;
          return (
            <tr
              key={linha.id}
              aria-selected={selecionadaId !== undefined ? selecionada : undefined}
              onClick={seleciona ? () => onSelecionar(linha.id) : undefined}
            >
              {colunas.map((coluna) => (
                <td key={coluna.id} className={coluna.tipo === 'numero' ? 'mo-tabela__numero' : undefined}>
                  {linha.celulas[coluna.id] ?? ''}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
