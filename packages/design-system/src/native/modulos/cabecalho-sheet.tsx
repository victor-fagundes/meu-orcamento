import { Text, View } from 'react-native';
import type { CabecalhoSheetProps } from '../../base/contratos.ts';
import { radius, spacing, typography } from '../../core/tokens.ts';
import { useCores } from '../tema.tsx';

/** Puxador e título, no topo da bottom sheet. */
export function CabecalhoSheet({ titulo, subtitulo }: CabecalhoSheetProps) {
  const cores = useCores();
  return (
    <View style={{ gap: spacing[1] }}>
      <View accessibilityElementsHidden style={{ alignSelf: 'center', width: 32, height: 4, borderRadius: radius.full, backgroundColor: cores.line, marginBottom: spacing[2] }} />
      <Text accessibilityRole="header" style={{ fontFamily: typography.family, fontSize: typography.titleMd.size, lineHeight: typography.titleMd.line, fontWeight: '800', color: cores.text }}>{titulo}</Text>
      {subtitulo ? <Text style={{ fontFamily: typography.family, fontSize: typography.label.size, color: cores.textMuted }}>{subtitulo}</Text> : null}
    </View>
  );
}
