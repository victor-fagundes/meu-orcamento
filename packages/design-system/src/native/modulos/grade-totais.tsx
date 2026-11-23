import { Pressable, Text, View } from 'react-native';
import type { GradeTotaisProps } from '../../base/contratos.ts';
import { formatarBRLInteiro } from '../../core/formatters.ts';
import { radius, spacing, typography } from '../../core/tokens.ts';
import { useCores } from '../tema.tsx';

function apoio(planejadoCentavos: number | null, ocultado: boolean): string {
  if (ocultado) return 'R$ •••••';
  if (planejadoCentavos === null) return '—';
  return `de ${formatarBRLInteiro(planejadoCentavos)} planejados`;
}

export function GradeTotais({ itens, onAbrir, ocultado = false }: GradeTotaisProps) {
  const cores = useCores();
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[2] }}>
      {itens.map((item) => {
        const miolo = (
          <>
            <Text style={{ fontFamily: typography.family, fontSize: typography.caption.size, fontWeight: '700', color: cores.textMuted }}>{item.rotulo}</Text>
            <Text style={{ fontFamily: typography.family, fontSize: typography.titleLg.size, lineHeight: typography.titleLg.line, fontWeight: '800', color: cores.text }}>{ocultado ? 'R$ •••••' : formatarBRLInteiro(item.realizadoCentavos)}</Text>
            <Text style={{ fontFamily: typography.family, fontSize: typography.caption.size, color: cores.textMuted }}>{apoio(item.planejadoCentavos, ocultado)}</Text>
          </>
        );
        if (!onAbrir) {
          return (
            <View key={item.rotulo} accessibilityRole="summary" style={{ width: '48%', backgroundColor: cores.card, borderRadius: radius.xl, padding: spacing[4], gap: spacing[1] }}>
              {miolo}
            </View>
          );
        }
        return (
          <Pressable key={item.rotulo} onPress={() => onAbrir(item.rotulo)} accessibilityRole="button" style={{ width: '48%', backgroundColor: cores.card, borderRadius: radius.xl, padding: spacing[4], gap: spacing[1] }}>
            {miolo}
          </Pressable>
        );
      })}
    </View>
  );
}
