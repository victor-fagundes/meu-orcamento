import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ChipsProps } from '../base/contratos.ts';
import { radius, spacing, typography } from '../core/tokens.ts';
import { useCores } from './tema.tsx';

export function Chips<T extends string>({ rotuloGrupo, opcoes, selecionado, onSelecionar }: ChipsProps<T>) {
  const cores = useCores();
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel={rotuloGrupo} style={[styles.grupo, { backgroundColor: cores.field }]}>
      {opcoes.map((opcao) => {
        const ativo = opcao.valor === selecionado;
        return (
          <Pressable
            key={opcao.valor}
            onPress={() => onSelecionar(opcao.valor)}
            accessibilityRole="radio"
            accessibilityState={{ checked: ativo }}
            style={[styles.chip, ativo ? { backgroundColor: cores.selected } : null]}
          >
            <Text style={[styles.texto, { color: ativo ? cores.onSelected : cores.textMuted }]}>{opcao.rotulo}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grupo: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing[1], borderRadius: radius.lg, padding: spacing[1] },
  chip: { paddingVertical: spacing[2], paddingHorizontal: spacing[3], borderRadius: radius.md },
  texto: { fontFamily: typography.family, fontSize: typography.label.size, fontWeight: '700' },
});
