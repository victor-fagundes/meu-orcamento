import { View } from 'react-native';
import type { RodapeAcoesProps } from '../../base/contratos.ts';
import { spacing } from '../../core/tokens.ts';
import { Botao } from '../botao.tsx';

export function RodapeAcoes({ textoPrincipal, onPrincipal, textoCancelar = 'Cancelar', onCancelar, principalDestrutivo = false, principalDesabilitado = false }: RodapeAcoesProps) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: spacing[2] }}>
      <Botao variante="texto" onPress={onCancelar}>{textoCancelar}</Botao>
      <Botao variante={principalDestrutivo ? 'destrutivo' : 'primario'} onPress={onPrincipal} disabled={principalDesabilitado}>{textoPrincipal}</Botao>
    </View>
  );
}
