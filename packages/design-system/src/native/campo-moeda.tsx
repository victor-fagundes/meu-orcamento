import { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import type { CampoMoedaProps } from '../base/contratos.ts';
import { textoDoCampoMoeda } from '../base/estado.ts';
import { lerBRL } from '../core/formatters.ts';
import { radius, spacing, stateTokens, typography } from '../core/tokens.ts';
import { useCores } from './tema.tsx';

export function CampoMoeda({ id, rotulo, valor, onMudar, erro, desabilitado = false }: CampoMoedaProps) {
  const cores = useCores();
  const [texto, setTexto] = useState(() => textoDoCampoMoeda(valor));
  const temErro = erro !== undefined && erro !== '';
  return (
    <View style={styles.bloco}>
      <Text nativeID={`${id}-rotulo`} style={[styles.rotulo, { color: cores.text }]}>{rotulo}</Text>
      <TextInput
        nativeID={id}
        value={texto}
        keyboardType="decimal-pad"
        editable={!desabilitado}
        accessibilityLabel={rotulo}
        accessibilityState={{ disabled: desabilitado }}
        onChangeText={(proximo) => {
          setTexto(proximo);
          onMudar(proximo.trim() === '' ? null : lerBRL(proximo));
        }}
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
