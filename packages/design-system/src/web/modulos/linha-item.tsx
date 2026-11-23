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

function cifra(centavos: number, ocultado: boolean): string {
  return ocultado ? 'R$ •••••' : formatarBRL(centavos);
}

export function LinhaItem({ nome, realizadoCentavos, planejadoCentavos, onAbrir, limiteAtencao = 80, ocultado = false }: LinhaItemProps) {
  const estado = estadoConsumo(realizadoCentavos, planejadoCentavos, limiteAtencao);
  return (
    <button type="button" className="mo-linha-item" onClick={onAbrir}>
      <span className="mo-linha-item__topo">
        <span className="mo-linha-item__nome">{nome}</span>
        <span className="mo-linha-item__valores">{cifra(realizadoCentavos, ocultado)} <span className="mo-grupo__plano">/ {cifra(planejadoCentavos, ocultado)}</span></span>
      </span>
      <span className="mo-linha-item__frase" style={{ color: corDoEstado[estado] }}>{fraseDoEstado(realizadoCentavos, planejadoCentavos, limiteAtencao)}</span>
    </button>
  );
}
