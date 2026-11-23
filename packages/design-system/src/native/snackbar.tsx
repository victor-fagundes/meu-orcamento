import { Pressable, Text, View } from 'react-native';
import type { SnackbarProps } from '../base/contratos.ts';
import { radius, spacing, typography } from '../core/tokens.ts';
import { useCores } from './tema.tsx';

export function Snackbar({ mensagem, onDesfazer, rotuloDesfazer = 'Desfazer' }: SnackbarProps) {
  const cores = useCores();
  return (
    <View accessibilityLiveRegion="polite" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing[6], padding: spacing[4], borderRadius: radius.lg, backgroundColor: cores.snackbar }}>
      <Text style={{ flexShrink: 1, fontFamily: typography.family, fontSize: typography.label.size, color: cores.snackbarText }}>{mensagem}</Text>
      {onDesfazer ? (
        <Pressable onPress={onDesfazer} accessibilityRole="button" accessibilityLabel={rotuloDesfazer}>
          <Text style={{ fontFamily: typography.family, fontSize: typography.label.size, fontWeight: '700', color: cores.snackbarAction }}>{rotuloDesfazer}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
