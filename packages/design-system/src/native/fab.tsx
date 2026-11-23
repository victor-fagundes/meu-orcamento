import { Pressable, StyleSheet, Text } from 'react-native';
import type { FabProps } from '../base/contratos.ts';
import { elevation, spacing, typography } from '../core/tokens.ts';
import { useCores } from './tema.tsx';

/** Acima da barra inferior (92 px da base), canto inferior direito, 16 px da borda. */
export function Fab({ rotulo, onPress }: FabProps) {
  const cores = useCores();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={rotulo}
      style={[styles.fab, { backgroundColor: cores.action, shadowColor: cores.action }]}
    >
      <Text style={[styles.texto, { color: cores.onAction }]}>{rotulo}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: spacing[4],
    bottom: 92,
    height: 56,
    paddingHorizontal: spacing[6],
    borderRadius: 16,
    justifyContent: 'center',
    shadowOpacity: elevation.fab.native.shadowOpacity,
    shadowRadius: elevation.fab.native.shadowRadius,
    shadowOffset: elevation.fab.native.shadowOffset,
    elevation: elevation.fab.native.elevation,
  },
  texto: { fontFamily: typography.family, fontSize: typography.body.size, fontWeight: '800' },
});
