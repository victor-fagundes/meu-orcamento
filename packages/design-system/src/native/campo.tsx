import { StyleSheet, Text, TextInput, View } from 'react-native';
import type { CampoProps } from '../base/contratos.ts';
import { radius, spacing, stateTokens, typography } from '../core/tokens.ts';
import { useCores } from './tema.tsx';

const teclado = { texto: 'default', decimal: 'decimal-pad', numerico: 'number-pad' } as const;

const completarNativo: Record<NonNullable<CampoProps['completar']>, 'name' | 'email' | 'current-password' | 'new-password'> = {
  nome: 'name',
  email: 'email',
  'senha-atual': 'current-password',
  'senha-nova': 'new-password',
};

export function Campo({
  id,
  rotulo,
  valor,
  onMudar,
  erro,
  invalido = false,
  desabilitado = false,
  placeholder,
  teclado: modo = 'texto',
  tipo = 'texto',
  completar,
}: CampoProps) {
  const cores = useCores();
  const temFrase = erro !== undefined && erro !== '';
  const marcado = invalido || temFrase;
  const tecladoNativo = tipo === 'email' ? 'email-address' : tipo === 'senha' ? 'default' : teclado[modo];
  return (
    <View style={styles.bloco}>
      <Text nativeID={`${id}-rotulo`} style={[styles.rotulo, { color: marcado ? cores.error : cores.text }]}>{rotulo}</Text>
      <TextInput
        nativeID={id}
        value={valor}
        onChangeText={onMudar}
        placeholder={placeholder}
        placeholderTextColor={cores.textMuted}
        editable={!desabilitado}
        keyboardType={tecladoNativo}
        secureTextEntry={tipo === 'senha'}
        autoComplete={completar ? completarNativo[completar] : undefined}
        accessibilityLabel={rotulo}
        accessibilityState={{ disabled: desabilitado }}
        accessibilityHint={temFrase ? erro : undefined}
        style={[styles.entrada, { backgroundColor: cores.field, color: cores.text }, marcado ? { borderWidth: 1.5, borderColor: cores.error } : null, desabilitado ? { opacity: stateTokens.disabledOpacity } : null]}
      />
      {temFrase ? <Text accessibilityLiveRegion="polite" style={[styles.erro, { color: cores.error }]}>{erro}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bloco: { gap: spacing[2] },
  rotulo: { fontFamily: typography.family, fontSize: typography.caption.size, fontWeight: '700' },
  entrada: { height: 52, paddingHorizontal: spacing[4], borderRadius: radius.lg, fontFamily: typography.family, fontSize: typography.body.size },
  erro: { fontFamily: typography.family, fontSize: typography.caption.size },
});
