'use client'
import type { BotaoIconeProps } from '../base/contratos.ts';
import { Icone } from './icone.tsx';

export function BotaoIcone({ nome, rotulo, onPress, desabilitado = false }: BotaoIconeProps) {
  return (
    <button type="button" className="mo-botao-icone" aria-label={rotulo} disabled={desabilitado} onClick={onPress}>
      <Icone nome={nome} />
    </button>
  );
}
