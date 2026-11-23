import { Pressable, Text, View } from 'react-native';
import type { LinhaItemProps } from '../../base/contratos.ts';
import { estadoConsumo, formatarBRL } from '../../core/formatters.ts';
import { spacing, typography } from '../../core/tokens.ts';
import { fraseDoEstado } from '../../modulos/logica.ts';
import { useCores } from '../tema.tsx';

export function LinhaItem({ nome, realizadoCentavos, planejadoCentavos, onAbrir }: LinhaItemProps) {
  const cores = useCores();
  const estado = estadoConsumo(realizadoCentavos, planejadoCentavos);
  const corFrase = estado === 'estourou' ? cores.error : estado === 'atencao' ? cores.warnText : estado === 'ok' ? cores.success : cores.textMuted;
  return (
    <Pressable onPress={onAbrir} accessibilityRole="button" accessibilityLabel={`${nome}, ${formatarBRL(realizadoCentavos)} de ${formatarBRL(planejadoCentavos)}`} style={{ minHeight: 48, paddingVertical: spacing[3], paddingHorizontal: spacing[4], gap: spacing[1] }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ fontFamily: typography.family, fontSize: typography.label.size, color: cores.text }}>{nome}</Text>
        <Text style={{ fontFamily: typography.family, fontSize: typography.label.size, color: cores.text }}>{formatarBRL(realizadoCentavos)} / {formatarBRL(planejadoCentavos)}</Text>
      </View>
      <Text style={{ fontFamily: typography.family, fontSize: typography.caption.size, color: corFrase }}>{fraseDoEstado(realizadoCentavos, planejadoCentavos)}</Text>
    </Pressable>
  );
}
