import { Pressable, StyleSheet, Text } from 'react-native';
import type { BotaoProps, VarianteBotao } from '../base/contratos.ts';
import { radius, spacing, stateTokens, typography } from '../core/tokens.ts';
import { useCores } from './tema.tsx';

export function Botao({ variante, children, onPress, disabled = false, loading = false, largura = 'conteudo', acessibilidade }: BotaoProps) {
  const cores = useCores();
  const bloqueado = disabled || loading;
  const fundo: Record<VarianteBotao, string> = {
    primario: cores.action,
    destrutivo: cores.error,
    secundario: 'transparent',
    texto: 'transparent',
  };
  const texto: Record<VarianteBotao, string> = {
    primario: cores.onAction,
    destrutivo: cores.onError,
    secundario: cores.action,
    texto: cores.action,
  };
  return (
    <Pressable
      onPress={onPress}
      disabled={bloqueado}
      accessibilityRole="button"
      accessibilityLabel={acessibilidade ?? children}
      accessibilityState={{ disabled: bloqueado, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: fundo[variante] },
        variante === 'secundario' ? { borderWidth: 1.5, borderColor: cores.action } : null,
        largura === 'total' ? styles.total : null,
        pressed && !bloqueado ? { transform: [{ scale: stateTokens.pressedScale }] } : null,
        bloqueado ? { opacity: stateTokens.disabledOpacity } : null,
      ]}
    >
      <Text style={[styles.texto, { color: texto[variante] }]}>{loading ? 'Carregando…' : children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { height: 48, paddingHorizontal: spacing[4], borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  total: { width: '100%' },
  texto: { fontFamily: typography.family, fontSize: typography.body.size, fontWeight: '800' },
});
