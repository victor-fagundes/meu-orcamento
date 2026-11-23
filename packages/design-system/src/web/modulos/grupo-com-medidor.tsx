'use client'
import type { GrupoComMedidorProps } from '../../base/contratos.ts';
import { estadoConsumo, formatarBRL, calcularPercentual } from '../../core/formatters.ts';
import { fraseDoEstado } from '../../modulos/logica.ts';
import { Medidor } from '../medidor.tsx';

export function GrupoComMedidor({ rotulo, realizadoCentavos, planejadoCentavos, aberto, onAlternar, children }: GrupoComMedidorProps) {
  const estado = estadoConsumo(realizadoCentavos, planejadoCentavos);
  const painelId = `painel-${rotulo.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <section className="mo-grupo">
      <button type="button" className="mo-grupo__cabecalho" aria-expanded={aberto} aria-controls={painelId} onClick={onAlternar}>
        <span className="mo-grupo__nome">{rotulo}</span>
        <span className="mo-grupo__valores">{formatarBRL(realizadoCentavos)} <span className="mo-grupo__plano">/ {formatarBRL(planejadoCentavos)}</span></span>
      </button>
      <Medidor
        rotulo={rotulo}
        valor={calcularPercentual(realizadoCentavos, planejadoCentavos)}
        estado={estado}
        frase={fraseDoEstado(realizadoCentavos, planejadoCentavos)}
      />
      {aberto ? <div id={painelId} className="mo-grupo__itens">{children}</div> : null}
    </section>
  );
}
