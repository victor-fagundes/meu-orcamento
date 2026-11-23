import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import type { DialogoProps } from '../base/contratos.ts';
import { radius, spacing, typography } from '../core/tokens.ts';
import { useCores } from './tema.tsx';

export function Dialogo({ aberto, titulo, descricao, textoCancelar = 'Cancelar', textoConfirmar, tipoConfirmar, onCancelar, onConfirmar, children, confirmarDesabilitado = false }: DialogoProps) {
  const cores = useCores();
  const destrutivo = tipoConfirmar === 'destrutivo';
  return (
    <Modal transparent visible={aberto} animationType="fade" onRequestClose={onCancelar}>
      <View style={styles.fundo}>
        <View accessibilityRole="alert" style={[styles.caixa, { backgroundColor: cores.card }]}>
          <Text accessibilityRole="header" style={[styles.titulo, { color: cores.text }]}>{titulo}</Text>
          <Text style={[styles.descricao, { color: cores.textMuted }]}>{descricao}</Text>
          {children}
          <View style={styles.acoes}>
            <Pressable onPress={onCancelar} accessibilityRole="button" style={styles.botaoTexto}>
              <Text style={[styles.textoCancelar, { color: cores.action }]}>{textoCancelar}</Text>
            </Pressable>
            <Pressable
              onPress={() => { if (!confirmarDesabilitado) onConfirmar(); }}
              disabled={confirmarDesabilitado}
              accessibilityRole="button"
              style={[styles.botao, { backgroundColor: destrutivo ? cores.error : cores.action }]}
            >
              <Text style={[styles.textoBotao, { color: destrutivo ? cores.onError : cores.onAction }]}>{textoConfirmar}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fundo: { flex: 1, backgroundColor: 'rgba(25, 28, 32, 0.32)', alignItems: 'center', justifyContent: 'center', padding: spacing[4] },
  caixa: { width: '100%', maxWidth: 440, borderRadius: radius.sheet, padding: spacing[6] },
  titulo: { fontFamily: typography.family, fontSize: typography.titleMd.size, fontWeight: '800', marginBottom: spacing[2] },
  descricao: { fontFamily: typography.family, fontSize: typography.label.size, lineHeight: typography.label.line },
  acoes: { flexDirection: 'row', justifyContent: 'flex-end', gap: spacing[2], marginTop: spacing[6] },
  botaoTexto: { height: 48, paddingHorizontal: spacing[4], justifyContent: 'center' },
  textoCancelar: { fontFamily: typography.family, fontWeight: '700' },
  botao: { height: 48, paddingHorizontal: spacing[4], borderRadius: radius.lg, justifyContent: 'center' },
  textoBotao: { fontFamily: typography.family, fontWeight: '800' },
});
