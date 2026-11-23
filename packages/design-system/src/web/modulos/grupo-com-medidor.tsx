'use client'
import type { GrupoComMedidorProps } from '../../base/contratos.ts';
import { estadoConsumo, formatarBRL, calcularPercentual } from '../../core/formatters.ts';
import { fraseDoEstado } from '../../modulos/logica.ts';
import { Medidor } from '../medidor.tsx';

function cifra(centavos: number, ocultado: boolean): string {
  return ocultado ? 'R$ •••••' : formatarBRL(centavos);
}

export function GrupoComMedidor({ rotulo, realizadoCentavos, planejadoCentavos, aberto, onAlternar, children, limiteAtencao = 80, ocultado = false }: GrupoComMedidorProps) {
  const estado = estadoConsumo(realizadoCentavos, planejadoCentavos, limiteAtencao);
  const painelId = `painel-${rotulo.replace(/\s+/g, '-').toLowerCase()}`;
  return (
    <section className="mo-grupo">
      <button type="button" className="mo-grupo__cabecalho" aria-expanded={aberto} aria-controls={painelId} onClick={onAlternar}>
        <span className="mo-grupo__nome">{rotulo}</span>
        <span className="mo-grupo__valores">{cifra(realizadoCentavos, ocultado)} <span className="mo-grupo__plano">/ {cifra(planejadoCentavos, ocultado)}</span></span>
      </button>
      <Medidor
        rotulo={rotulo}
        valor={calcularPercentual(realizadoCentavos, planejadoCentavos)}
        estado={estado}
        frase={fraseDoEstado(realizadoCentavos, planejadoCentavos, limiteAtencao)}
      />
      {aberto ? <div id={painelId} className="mo-grupo__itens">{children}</div> : null}
    </section>
  );
}
