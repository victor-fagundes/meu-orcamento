import { StyleSheet, Text, View } from 'react-native';
import type { MedidorProps } from '../base/contratos.ts';
import { larguraDaBarra, tokenDoEstado } from '../base/estado.ts';
import { radius, spacing, typography } from '../core/tokens.ts';
import { useCores } from './tema.tsx';

export function Medidor({ rotulo, valor, estado, frase }: MedidorProps) {
  const cores = useCores();
  const largura = larguraDaBarra(valor);
  const cor = cores[tokenDoEstado[estado]];
  return (
    <View style={styles.bloco}>
      <Text style={[styles.rotulo, { color: cores.text }]}>{rotulo}</Text>
      <View style={[styles.trilha, { backgroundColor: cores.line }]} accessibilityRole="progressbar" accessibilityLabel={rotulo} accessibilityValue={{ min: 0, max: 100, now: largura }}>
        <View style={{ height: '100%', width: `${largura}%`, backgroundColor: cor }} />
      </View>
      <Text style={[styles.frase, { color: cor }]}>{frase}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bloco: { gap: spacing[2] },
  rotulo: { fontFamily: typography.family, fontSize: typography.label.size },
  trilha: { height: 8, borderRadius: radius.full, overflow: 'hidden' },
  frase: { fontFamily: typography.family, fontSize: typography.caption.size, fontWeight: '700' },
});
