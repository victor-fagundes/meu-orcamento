'use client'
import type { GradeTotaisProps } from '../../base/contratos.ts';
import { formatarBRLInteiro } from '../../core/formatters.ts';

function apoio(planejadoCentavos: number | null, ocultado: boolean): string {
  if (ocultado) return 'R$ •••••';
  if (planejadoCentavos === null) return '—';
  return `de ${formatarBRLInteiro(planejadoCentavos)} planejados`;
}

export function GradeTotais({ itens, onAbrir, ocultado = false }: GradeTotaisProps) {
  return (
    <div className="mo-grade-totais">
      {itens.map((item) => {
        const corpo = (
          <>
            <span className="mo-total__rotulo">{item.rotulo}</span>
            <span className="mo-total__valor">{ocultado ? 'R$ •••••' : formatarBRLInteiro(item.realizadoCentavos)}</span>
            <span className="mo-total__apoio">{apoio(item.planejadoCentavos, ocultado)}</span>
          </>
        );
        if (!onAbrir) {
          return (
            <article key={item.rotulo} className="mo-total">
              {corpo}
            </article>
          );
        }
        return (
          <button key={item.rotulo} type="button" className="mo-total" onClick={() => onAbrir(item.rotulo)}>
            {corpo}
          </button>
        );
      })}
    </div>
  );
}
