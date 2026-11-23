import { Text, View } from 'react-native';
import type { GradeTotaisProps } from '../../base/contratos.ts';
import { formatarBRLInteiro } from '../../core/formatters.ts';
import { radius, spacing, typography } from '../../core/tokens.ts';
import { useCores } from '../tema.tsx';

export function GradeTotais({ itens }: GradeTotaisProps) {
  const cores = useCores();
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] }}>
      {itens.map((item) => (
        <View key={item.rotulo} accessibilityRole="summary" style={{ width: '48%', backgroundColor: cores.card, borderRadius: radius.xl, padding: spacing[4], gap: spacing[1] }}>
          <Text style={{ fontFamily: typography.family, fontSize: typography.caption.size, fontWeight: '700', color: cores.textMuted }}>{item.rotulo}</Text>
          <Text style={{ fontFamily: typography.family, fontSize: typography.titleLg.size, lineHeight: typography.titleLg.line, fontWeight: '800', color: cores.text }}>{formatarBRLInteiro(item.realizadoCentavos)}</Text>
          <Text style={{ fontFamily: typography.family, fontSize: typography.caption.size, color: cores.textMuted }}>de {formatarBRLInteiro(item.planejadoCentavos)} planejados</Text>
        </View>
      ))}
    </View>
  );
}
