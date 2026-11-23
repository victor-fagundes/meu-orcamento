'use client'
import type { LinhaAjusteProps } from '../../base/contratos.ts';
import { Icone } from '../icone.tsx';

export function LinhaAjuste({ icone, rotulo, apoio, onAbrir, destrutivo = false, atual = false }: LinhaAjusteProps) {
  return (
    <button type="button" className={`mo-linha-ajuste${destrutivo ? ' mo-linha-ajuste--destrutivo' : ''}`} aria-current={atual ? 'page' : undefined} onClick={onAbrir}>
      <Icone nome={icone} tamanho={20} />
      <span className="mo-linha-ajuste__texto">
        <span className="mo-linha-ajuste__rotulo">{rotulo}</span>
        {apoio ? <span className="mo-linha-ajuste__apoio">{apoio}</span> : null}
      </span>
      <span aria-hidden="true" className="mo-linha-ajuste__seta">›</span>
    </button>
  );
}
