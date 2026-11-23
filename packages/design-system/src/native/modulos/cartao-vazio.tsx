import { Text, View } from 'react-native';
import type { CartaoVazioProps } from '../../base/contratos.ts';
import { radius, spacing, typography } from '../../core/tokens.ts';
import { Botao } from '../botao.tsx';
import { useCores } from '../tema.tsx';

export function CartaoVazio({ titulo, frase, acao }: CartaoVazioProps) {
  const cores = useCores();
  return (
    <View style={{ backgroundColor: cores.card, borderRadius: radius.xl, padding: spacing[6], alignItems: 'center', gap: spacing[2] }}>
      <Text accessibilityRole="header" style={{ fontFamily: typography.family, fontSize: typography.titleMd.size, lineHeight: typography.titleMd.line, color: cores.text, textAlign: 'center' }}>{titulo}</Text>
      <Text style={{ fontFamily: typography.family, fontSize: typography.label.size, lineHeight: typography.label.line, color: cores.textMuted, textAlign: 'center' }}>{frase}</Text>
      {acao ? <Botao variante="primario" onPress={acao.onPress}>{acao.rotulo}</Botao> : null}
    </View>
  );
}
