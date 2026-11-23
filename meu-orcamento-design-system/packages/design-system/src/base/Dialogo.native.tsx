import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { elevation, radius, spacing, typography } from '../core/tokens';
import type { DialogoProps } from '../core/types';
import { Botao } from './Botao.native';
import { useTheme } from './ThemeProvider.native';

export function Dialogo({
  aberto,
  titulo,
  descricao,
  rotuloConfirmar,
  rotuloCancelar = 'Cancelar',
  destrutivo = true,
  carregando = false,
  onConfirmar,
  onCancelar,
}: DialogoProps): React.JSX.Element {
  const { colors } = useTheme();
  const titleStyle = typography.scale.titleMd;
  const bodyStyle = typography.scale.bodyMd;
  const shadow = elevation.lg;

  return (
    <Modal
      visible={aberto}
      transparent
      animationType="fade"
      onRequestClose={carregando ? () => {} : onCancelar}
    >
      <Pressable
        style={[styles.overlay, { backgroundColor: colors.overlay }]}
        onPress={carregando ? undefined : onCancelar}
      >
        <Pressable
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              shadowColor: shadow.shadowColor,
              shadowOffset: shadow.shadowOffset,
              shadowOpacity: shadow.shadowOpacity,
              shadowRadius: shadow.shadowRadius,
              elevation: shadow.elevation,
            },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          <View style={styles.texts}>
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
            <Text
              style={{
                fontFamily: bodyStyle.fontFamilyNative,
                fontSize: bodyStyle.fontSize,
                lineHeight: bodyStyle.lineHeight,
                color: colors.textSecondary,
              }}
            >
              {descricao}
            </Text>
          </View>
          <View style={styles.actions}>
            <View style={styles.btn}>
              <Botao variante="secundario" onPress={onCancelar} disabled={carregando}>
                {rotuloCancelar}
              </Botao>
            </View>
            <View style={styles.btn}>
              <Botao
                variante={destrutivo ? 'destrutivo' : 'primario'}
                onPress={onConfirmar}
                loading={carregando}
              >
                {rotuloConfirmar}
              </Botao>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    borderRadius: radius.lg,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  texts: {
    gap: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  btn: {
    flex: 1,
  },
});
