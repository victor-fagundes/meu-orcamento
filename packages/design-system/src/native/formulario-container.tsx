import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import type { FormularioContainerProps } from '../base/contratos.ts';
import { radius, spacing, stateTokens, typography } from '../core/tokens.ts';
import { useCores } from './tema.tsx';

/** No celular, formulários e edições abrem em bottom sheet com puxador (DECISOES_identidade_visual.md, seção 6). */
export function FormularioContainer({ aberto, titulo, children, textoCancelar = 'Cancelar', textoSalvar, salvarDesabilitado = false, onCancelar, onSalvar }: FormularioContainerProps) {
  const cores = useCores();
  return (
    <Modal transparent visible={aberto} animationType="slide" onRequestClose={onCancelar}>
      <View style={styles.fundo}>
        <View style={[styles.folha, { backgroundColor: cores.card }]}>
          <View style={[styles.puxador, { backgroundColor: cores.line }]} />
          <Text accessibilityRole="header" style={[styles.titulo, { color: cores.text }]}>{titulo}</Text>
          {children}
          <View style={styles.acoes}>
            <Pressable onPress={onCancelar} accessibilityRole="button" style={styles.botaoTexto}>
              <Text style={[styles.textoCancelar, { color: cores.action }]}>{textoCancelar}</Text>
            </Pressable>
            <Pressable
              onPress={onSalvar}
              disabled={salvarDesabilitado}
              accessibilityRole="button"
              accessibilityState={{ disabled: salvarDesabilitado }}
              style={[styles.botao, { backgroundColor: cores.action }, salvarDesabilitado ? { opacity: stateTokens.disabledOpacity } : null]}
            >
              <Text style={[styles.textoSalvar, { color: cores.onAction }]}>{textoSalvar}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fundo: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(25, 28, 32, 0.32)' },
  folha: { borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet, padding: spacing[4], gap: spacing[3] },
  puxador: { alignSelf: 'center', width: 32, height: 4, borderRadius: 4 },
  titulo: { fontFamily: typography.family, fontSize: typography.titleMd.size, fontWeight: '800' },
  acoes: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing[2], marginTop: spacing[2] },
  botaoTexto: { height: 48, paddingHorizontal: spacing[4], justifyContent: 'center' },
  textoCancelar: { fontFamily: typography.family, fontWeight: '700' },
  botao: { height: 48, paddingHorizontal: spacing[4], borderRadius: radius.lg, justifyContent: 'center' },
  textoSalvar: { fontFamily: typography.family, fontWeight: '800' },
});
