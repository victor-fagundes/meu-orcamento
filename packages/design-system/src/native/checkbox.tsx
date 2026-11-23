import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { CheckboxProps } from '../base/contratos.ts';
import { spacing, typography } from '../core/tokens.ts';
import { useCores } from './tema.tsx';

export function Checkbox({ rotulo, marcado, onMudar, desabilitado = false }: CheckboxProps) {
  const cores = useCores();
  return (
    <Pressable
      onPress={() => onMudar(!marcado)}
      disabled={desabilitado}
      accessibilityRole="checkbox"
      accessibilityLabel={rotulo}
      accessibilityState={{ checked: marcado, disabled: desabilitado }}
      style={styles.linha}
    >
      <View style={[styles.caixa, { borderColor: marcado ? cores.action : cores.textMuted, backgroundColor: marcado ? cores.action : 'transparent' }]} />
      <Text style={[styles.texto, { color: cores.text }]}>{rotulo}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', gap: spacing[2] },
  caixa: { width: 20, height: 20, borderRadius: 4, borderWidth: 2 },
  texto: { fontFamily: typography.family, fontSize: typography.label.size },
});
