import { Pressable, Text, View } from 'react-native';
import type { GrupoComMedidorProps } from '../../base/contratos.ts';
import { calcularPercentual, estadoConsumo, formatarBRL } from '../../core/formatters.ts';
import { radius, spacing, typography } from '../../core/tokens.ts';
import { fraseDoEstado } from '../../modulos/logica.ts';
import { Medidor } from '../medidor.tsx';
import { useCores } from '../tema.tsx';

export function GrupoComMedidor({ rotulo, realizadoCentavos, planejadoCentavos, aberto, onAlternar, children }: GrupoComMedidorProps) {
  const cores = useCores();
  return (
    <View style={{ backgroundColor: cores.card, borderRadius: radius.xl, padding: spacing[4], gap: spacing[2] }}>
      <Pressable onPress={onAlternar} accessibilityRole="button" accessibilityState={{ expanded: aberto }} accessibilityLabel={rotulo} style={{ flexDirection: 'row', justifyContent: 'space-between', minHeight: 48, alignItems: 'center' }}>
        <Text style={{ fontFamily: typography.family, fontSize: typography.body.size, fontWeight: '700', color: cores.text }}>{rotulo}</Text>
        <Text style={{ fontFamily: typography.family, fontSize: typography.label.size, fontWeight: '700', color: cores.text }}>
          {formatarBRL(realizadoCentavos)} / {formatarBRL(planejadoCentavos)}
        </Text>
      </Pressable>
      <Medidor rotulo={rotulo} valor={calcularPercentual(realizadoCentavos, planejadoCentavos)} estado={estadoConsumo(realizadoCentavos, planejadoCentavos)} frase={fraseDoEstado(realizadoCentavos, planejadoCentavos)} />
      {aberto ? <View style={{ borderTopWidth: 1, borderTopColor: cores.line }}>{children}</View> : null}
    </View>
  );
}
