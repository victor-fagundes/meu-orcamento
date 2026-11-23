import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Botao } from '../base/Botao.native';
import { Icone } from '../base/Icone.native';
import { useTheme } from '../base/ThemeProvider.native';
import { radius, spacing, typography } from '../core/tokens';
import type { CartaoVazioProps } from '../core/types';

export function CartaoVazio({
  icone,
  titulo,
  descricao,
  rotuloAcao,
  onAcao,
}: CartaoVazioProps): React.JSX.Element {
  const { colors } = useTheme();
  const titleStyle = typography.scale.titleMd;
  const bodyStyle = typography.scale.bodyMd;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.borderStrong,
        },
      ]}
    >
      {icone && <Icone nome={icone} tamanho={32} cor={colors.textMuted} decorativo />}
      <Text
        style={{
          fontFamily: titleStyle.fontFamilyNative,
          fontSize: titleStyle.fontSize,
          lineHeight: titleStyle.lineHeight,
          color: colors.textPrimary,
          textAlign: 'center',
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
          textAlign: 'center',
        }}
      >
        {descricao}
      </Text>
      {rotuloAcao && onAcao && (
        <View style={styles.cta}>
          <Botao variante="primario" onPress={onAcao}>
            {rotuloAcao}
          </Botao>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: radius.lg,
    padding: spacing.xxl,
    alignItems: 'center',
    gap: spacing.md,
  },
  cta: {
    width: '100%',
    marginTop: spacing.xs,
  },
});
