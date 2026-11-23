import React from 'react';
import type { EstadoErroProps } from '../core/types';
import { Banner } from './Banner.web';

export function EstadoErro({
  titulo = 'Não foi possível carregar os dados',
  mensagem,
  onTentarNovamente,
  rotuloBotao = 'Tentar de novo',
}: EstadoErroProps): React.JSX.Element {
  return (
    <Banner
      variante="erro"
      titulo={titulo}
      mensagem={mensagem}
      acao={{ rotulo: rotuloBotao, onPress: onTentarNovamente }}
    />
  );
}
