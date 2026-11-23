import type { GradeTotaisProps } from '../../base/contratos.ts';
import { formatarBRLInteiro } from '../../core/formatters.ts';

export function GradeTotais({ itens }: GradeTotaisProps) {
  return (
    <div className="mo-grade-totais">
      {itens.map((item) => (
        <article key={item.rotulo} className="mo-total">
          <span className="mo-total__rotulo">{item.rotulo}</span>
          <span className="mo-total__valor">{formatarBRLInteiro(item.realizadoCentavos)}</span>
          <span className="mo-total__apoio">de {formatarBRLInteiro(item.planejadoCentavos)} planejados</span>
        </article>
      ))}
    </div>
  );
}
