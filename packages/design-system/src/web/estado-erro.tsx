'use client'
import type { EstadoErroProps } from '../base/contratos.ts';
import { Banner } from './banner.tsx';
import { Botao } from './botao.tsx';

export function EstadoErro({ mensagem, onTentarNovamente, textoAcao = 'Tentar de novo' }: EstadoErroProps) {
  return (
    <div className="mo-estado-erro">
      <Banner tipo="erro">{mensagem}</Banner>
      <Botao variante="secundario" onPress={onTentarNovamente}>{textoAcao}</Botao>
    </div>
  );
}
