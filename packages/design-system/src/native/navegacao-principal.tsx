import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { NavegacaoPrincipalProps } from '../base/contratos.ts';
import { radius, spacing, typography } from '../core/tokens.ts';
import { Icone } from './icone.tsx';
import { useCores } from './tema.tsx';

/** Barra inferior do celular, com ícone e rótulo, e pílula na aba ativa. */
export function NavegacaoPrincipal({ abas, ativa, onNavegar }: NavegacaoPrincipalProps) {
  const cores = useCores();
  return (
    <View accessibilityRole="tablist" style={[styles.barra, { backgroundColor: cores.card, borderTopColor: cores.line }]}>
      {abas.map((aba) => {
        const selecionada = aba.id === ativa;
        const cor = selecionada ? cores.onSelected : cores.textMuted;
        return (
          <Pressable key={aba.id} onPress={() => onNavegar(aba.id)} accessibilityRole="tab" accessibilityState={{ selected: selecionada }} style={styles.aba}>
            <View style={[styles.pilula, selecionada ? { backgroundColor: cores.selected } : null]}>
              <Icone nome={aba.icone} />
            </View>
            <Text style={[styles.rotulo, { color: cor }]}>{aba.rotulo}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  barra: { flexDirection: 'row', height: 76, borderTopWidth: 1 },
  aba: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: spacing[2], gap: spacing[1] },
  pilula: { paddingHorizontal: spacing[4], paddingVertical: spacing[1], borderRadius: radius.lg },
  rotulo: { fontFamily: typography.family, fontSize: typography.caption.size, fontWeight: '700' },
});
