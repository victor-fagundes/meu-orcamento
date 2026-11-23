import { Text, View } from 'react-native';
import type { BannerProps, TipoBanner } from '../base/contratos.ts';
import { radius, spacing, typography } from '../core/tokens.ts';
import { useCores } from './tema.tsx';

export function Banner({ tipo, children }: BannerProps) {
  const cores = useCores();
  const estilo: Record<TipoBanner, { bg: string; fg: string }> = {
    info: { bg: cores.selected, fg: cores.onSelected },
    atencao: { bg: cores.warnBg, fg: cores.warnText },
    erro: { bg: cores.errorBg, fg: cores.errorText },
  };
  const { bg, fg } = estilo[tipo];
  return (
    <View
      accessibilityRole={tipo === 'erro' ? 'alert' : 'text'}
      accessibilityLiveRegion={tipo === 'erro' ? 'assertive' : 'polite'}
      style={{ paddingVertical: spacing[3], paddingHorizontal: spacing[4], borderRadius: radius.lg, backgroundColor: bg }}
    >
      <Text style={{ fontFamily: typography.family, fontSize: typography.label.size, lineHeight: typography.label.line, color: fg }}>{children}</Text>
    </View>
  );
}
