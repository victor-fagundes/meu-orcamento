import { Pressable, Text, View } from 'react-native';
import type { BlocoSaldoProps } from '../../base/contratos.ts';
import { radius, spacing, typography } from '../../core/tokens.ts';
import { estadoDoSaldo, textoDoSaldo } from '../../modulos/logica.ts';
import { Icone } from '../icone.tsx';
import { Medidor } from '../medidor.tsx';
import { useCores } from '../tema.tsx';

export function BlocoSaldo({ rotulo, valorCentavos, percentualUsado, fraseApoio, ocultado, onAlternarOcultar }: BlocoSaldoProps) {
  const cores = useCores();
  return (
    <View accessibilityRole="summary" style={{ backgroundColor: cores.card, borderRadius: radius['2xl'], padding: spacing[6], gap: spacing[2] }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontFamily: typography.family, fontSize: typography.label.size, fontWeight: '700', color: cores.textMuted }}>{rotulo}</Text>
        <Pressable onPress={onAlternarOcultar} accessibilityRole="button" accessibilityLabel={ocultado ? 'Mostrar valores' : 'Ocultar valores'} accessibilityState={{ checked: ocultado }} style={{ padding: spacing[1] }}>
          <Icone nome={ocultado ? 'visibility_off' : 'visibility'} tamanho={20} />
        </Pressable>
      </View>
      <Text style={{ fontFamily: typography.family, fontSize: typography.displayMd.size, lineHeight: typography.displayMd.line, fontWeight: '800', color: cores.text }}>
        {textoDoSaldo(valorCentavos, ocultado)}
      </Text>
      <Medidor rotulo={rotulo} valor={percentualUsado} estado={estadoDoSaldo(percentualUsado)} frase={fraseApoio} />
    </View>
  );
}
