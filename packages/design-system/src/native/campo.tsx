import { StyleSheet, Text, TextInput, View } from 'react-native';
import type { CampoProps } from '../base/contratos.ts';
import { radius, spacing, stateTokens, typography } from '../core/tokens.ts';
import { useCores } from './tema.tsx';

const teclado = { texto: 'default', decimal: 'decimal-pad', numerico: 'number-pad' } as const;

export function Campo({ id, rotulo, valor, onMudar, erro, desabilitado = false, placeholder, teclado: modo = 'texto' }: CampoProps) {
  const cores = useCores();
  const temErro = erro !== undefined && erro !== '';
  return (
    <View style={styles.bloco}>
      <Text nativeID={`${id}-rotulo`} style={[styles.rotulo, { color: cores.text }]}>{rotulo}</Text>
      <TextInput
        nativeID={id}
        value={valor}
        onChangeText={onMudar}
        placeholder={placeholder}
        placeholderTextColor={cores.textMuted}
        editable={!desabilitado}
        keyboardType={teclado[modo]}
        accessibilityLabel={rotulo}
        accessibilityState={{ disabled: desabilitado }}
        accessibilityHint={temErro ? erro : undefined}
        style={[styles.entrada, { backgroundColor: cores.field, color: cores.text }, temErro ? { borderWidth: 1.5, borderColor: cores.error } : null, desabilitado ? { opacity: stateTokens.disabledOpacity } : null]}
      />
      {temErro ? <Text accessibilityLiveRegion="polite" style={[styles.erro, { color: cores.error }]}>{erro}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bloco: { gap: spacing[2] },
  rotulo: { fontFamily: typography.family, fontSize: typography.caption.size, fontWeight: '700' },
  entrada: { height: 52, paddingHorizontal: spacing[4], borderRadius: radius.lg, fontFamily: typography.family, fontSize: typography.body.size },
  erro: { fontFamily: typography.family, fontSize: typography.caption.size },
});
