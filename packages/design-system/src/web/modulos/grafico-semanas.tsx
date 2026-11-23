'use client'
import { formatarBRL } from '../../core/formatters.ts';

export interface BarraSemana {
  readonly nome: string;
  readonly valorCentavos: number;
}

export interface GraficoSemanasProps {
  readonly semanas: readonly BarraSemana[];
  readonly mediaCentavos: number;
  readonly ocultado: boolean;
  readonly onVerDetalhes: (indice: number) => void;
}

function texto(centavos: number, ocultado: boolean): string {
  return ocultado ? 'R$ •••••' : formatarBRL(centavos);
}

/** Barras do gasto por semana. O valor também está em texto. Sem transição. */
export function GraficoSemanas({ semanas, mediaCentavos, ocultado, onVerDetalhes }: GraficoSemanasProps) {
  const maior = Math.max(1, ...semanas.map((semana) => semana.valorCentavos));
  return (
    <section className="mo-semana" aria-label="Gasto por semana">
      <ul className="mo-semana__lista">
        {semanas.map((semana, indice) => {
          const largura = Math.min(100, Math.floor((semana.valorCentavos * 100) / maior));
          return (
            <li key={semana.nome} className="mo-semana__item">
              <span className="mo-semana__nome">{semana.nome}</span>
              <span className="mo-semana__valor">{texto(semana.valorCentavos, ocultado)}</span>
              <span className="mo-semana__trilho" aria-hidden="true">
                <span className="mo-semana__barra" style={{ width: `${largura}%` }} />
              </span>
              <button type="button" className="mo-semana__detalhe" onClick={() => onVerDetalhes(indice)}>
                {`Ver detalhes da semana ${indice + 1}`}
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mo-semana__media">{`Média diária ${texto(mediaCentavos, ocultado)}`}</p>
    </section>
  );
}
