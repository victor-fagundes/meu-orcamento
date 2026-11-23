import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { CabecalhoTelaProps } from '../../base/contratos.ts';
import { typography } from '../../core/tokens.ts';
import { useCores } from '../tema.tsx';

export function CabecalhoTela({ titulo, navegacaoMes, onVoltar }: CabecalhoTelaProps) {
  const cores = useCores();
  const seta = (rotulo: string, onPress: () => void, acessivel: string) => (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={acessivel} style={styles.seta}>
      <Text style={[styles.setaTexto, { color: cores.action }]}>{rotulo}</Text>
    </Pressable>
  );
  return (
    <View accessibilityRole="header" style={styles.barra}>
      {onVoltar ? seta('‹', onVoltar, 'Voltar') : <View style={styles.seta} />}
      <Text style={[styles.titulo, { color: cores.text }]}>{navegacaoMes ? `${titulo} · ${navegacaoMes.rotulo}` : titulo}</Text>
      {navegacaoMes ? (
        <View style={styles.par}>
          {seta('‹', navegacaoMes.onAnterior, 'Mês anterior')}
          {seta('›', navegacaoMes.onProximo, 'Próximo mês')}
        </View>
      ) : <View style={styles.seta} />}
    </View>
  );
}

const styles = StyleSheet.create({
  barra: { height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  seta: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  setaTexto: { fontSize: 22 },
  titulo: { flex: 1, textAlign: 'center', fontFamily: typography.family, fontSize: typography.titleMd.size, fontWeight: '700' },
  par: { flexDirection: 'row' },
});
