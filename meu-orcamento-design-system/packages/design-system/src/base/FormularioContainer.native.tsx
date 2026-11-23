import React from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { radius, spacing, typography } from '../core/tokens';
import type { FormularioContainerProps } from '../core/types';
import { Botao } from './Botao.native';
import { useTheme } from './ThemeProvider.native';

export function FormularioContainer({
  aberto,
  titulo,
  subtitulo,
  onFechar,
  onConfirmar,
  rotuloConfirmar = 'Salvar',
  rotuloCancelar = 'Cancelar',
  carregando = false,
  confirmarDesabilitado = false,
  children,
}: FormularioContainerProps): React.JSX.Element {
  const { colors } = useTheme();
  const titleStyle = typography.scale.titleLg;
  const subStyle = typography.scale.bodySm;

  return (
    <Modal
      visible={aberto}
      transparent
      animationType="slide"
      onRequestClose={carregando ? () => {} : onFechar}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <Pressable
          style={[styles.overlay, { backgroundColor: colors.overlay }]}
          onPress={carregando ? undefined : onFechar}
        >
          <Pressable
            style={[styles.sheet, { backgroundColor: colors.surface }]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={[styles.handle, { backgroundColor: colors.borderStrong }]} />

            <View style={[styles.header, { borderBottomColor: colors.border }]}>
              <Text
                style={{
                  fontFamily: titleStyle.fontFamilyNative,
                  fontSize: titleStyle.fontSize,
                  lineHeight: titleStyle.lineHeight,
                  color: colors.textPrimary,
                }}
              >
                {titulo}
              </Text>
              {subtitulo && (
                <Text
                  style={{
                    fontFamily: subStyle.fontFamilyNative,
                    fontSize: subStyle.fontSize,
                    lineHeight: subStyle.lineHeight,
                    color: colors.textSecondary,
                  }}
                >
                  {subtitulo}
                </Text>
              )}
            </View>

            <ScrollView contentContainerStyle={styles.body}>{children}</ScrollView>

            <View style={[styles.footer, { borderTopColor: colors.border }]}>
              <View style={styles.footerBtn}>
                <Botao variante="secundario" onPress={onFechar} disabled={carregando}>
                  {rotuloCancelar}
                </Botao>
              </View>
              <View style={styles.footerBtn}>
                <Botao
                  variante="primario"
                  onPress={onConfirmar}
                  loading={carregando}
                  disabled={confirmarDesabilitado}
                >
                  {rotuloConfirmar}
                </Botao>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    maxHeight: '90%',
    paddingTop: spacing.md,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: radius.full,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    gap: spacing.xs,
  },
  body: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    borderTopWidth: 1,
  },
  footerBtn: {
    flex: 1,
  },
});
