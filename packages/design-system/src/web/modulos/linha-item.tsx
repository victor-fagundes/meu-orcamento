'use client'
import type { LinhaItemProps } from '../../base/contratos.ts';
import { estadoConsumo, formatarBRL } from '../../core/formatters.ts';
import { fraseDoEstado } from '../../modulos/logica.ts';

const corDoEstado: Record<ReturnType<typeof estadoConsumo>, string> = {
  ok: 'var(--md-success)',
  'no-limite': 'var(--md-action)',
  atencao: 'var(--md-warn-text)',
  estourou: 'var(--md-error)',
  'sem-plano': 'var(--md-text-muted)',
};

export function LinhaItem({ nome, realizadoCentavos, planejadoCentavos, onAbrir }: LinhaItemProps) {
  const estado = estadoConsumo(realizadoCentavos, planejadoCentavos);
  return (
    <button type="button" className="mo-linha-item" onClick={onAbrir}>
      <span className="mo-linha-item__topo">
        <span className="mo-linha-item__nome">{nome}</span>
        <span className="mo-linha-item__valores">{formatarBRL(realizadoCentavos)} <span className="mo-grupo__plano">/ {formatarBRL(planejadoCentavos)}</span></span>
      </span>
      <span className="mo-linha-item__frase" style={{ color: corDoEstado[estado] }}>{fraseDoEstado(realizadoCentavos, planejadoCentavos)}</span>
    </button>
  );
}
