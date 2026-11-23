import { View } from 'react-native';
import type { EstadoErroProps } from '../base/contratos.ts';
import { spacing } from '../core/tokens.ts';
import { Banner } from './banner.tsx';
import { Botao } from './botao.tsx';

export function EstadoErro({ mensagem, onTentarNovamente, textoAcao = 'Tentar de novo' }: EstadoErroProps) {
  return (
    <View style={{ gap: spacing[3] }}>
      <Banner tipo="erro">{mensagem}</Banner>
      <Botao variante="secundario" onPress={onTentarNovamente}>{textoAcao}</Botao>
    </View>
  );
}
