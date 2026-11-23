'use client'
import type { RodapeAcoesProps } from '../../base/contratos.ts';
import { Botao } from '../botao.tsx';

/** Cancelar à esquerda, ação principal à direita. Uma ação principal por área (ficha de componentes). */
export function RodapeAcoes({ textoPrincipal, onPrincipal, textoCancelar = 'Cancelar', onCancelar, principalDestrutivo = false, principalDesabilitado = false }: RodapeAcoesProps) {
  return (
    <div className="mo-rodape-acoes">
      <Botao variante="texto" onPress={onCancelar}>{textoCancelar}</Botao>
      <Botao variante={principalDestrutivo ? 'destrutivo' : 'primario'} onPress={onPrincipal} disabled={principalDesabilitado}>{textoPrincipal}</Botao>
    </div>
  );
}
