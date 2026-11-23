import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { grid, radius, spacing, typography, type ColorTokens } from '../core/tokens';
import type { BannerProps, BannerVariante } from '../core/types';
import { useTheme } from './ThemeProvider.native';

function resolveNativeBannerColors(
  variante: BannerVariante,
  colors: ColorTokens
): { bg: string; text: string; border: string } {
  switch (variante) {
    case 'erro':
      return { bg: colors.errorBg, text: colors.onErrorBg, border: colors.error };
    case 'atencao':
      return { bg: colors.warnBg, text: colors.warnText, border: colors.warn };
    case 'info':
      return { bg: colors.infoBg, text: colors.onInfoBg, border: colors.info };
  }
}

export function Banner({ variante, titulo, mensagem, acao }: BannerProps): React.JSX.Element {
  const { colors } = useTheme();
  const palette = resolveNativeBannerColors(variante, colors);
  const labelStyle = typography.scale.labelMd;
  const bodyStyle = typography.scale.bodySm;

  return (
    <View
      accessibilityRole={variante === 'erro' ? 'alert' : 'text'}
      accessibilityLiveRegion={variante === 'erro' ? 'assertive' : 'polite'}
      style={[
        styles.container,
        {
          backgroundColor: palette.bg,
          borderLeftColor: palette.border,
        },
      ]}
    >
      <View style={styles.texts}>
        {titulo && (
          <Text
            style={{
              fontFamily: labelStyle.fontFamilyNative,
              fontSize: labelStyle.fontSize,
              lineHeight: labelStyle.lineHeight,
              color: palette.text,
            }}
          >
            {titulo}
          </Text>
        )}
        <Text
          style={{
            fontFamily: bodyStyle.fontFamilyNative,
            fontSize: bodyStyle.fontSize,
            lineHeight: bodyStyle.lineHeight,
            color: palette.text,
          }}
        >
          {mensagem}
        </Text>
      </View>
      {acao && (
        <Pressable
          onPress={acao.onPress}
          accessibilityRole="button"
          accessibilityLabel={acao.rotulo}
          style={styles.action}
        >
          <Text
            style={{
              fontFamily: labelStyle.fontFamilyNative,
              fontSize: labelStyle.fontSize,
              color: palette.text,
              textDecorationLine: 'underline',
            }}
          >
            {acao.rotulo}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderLeftWidth: 4,
  },
  texts: {
    flex: 1,
    gap: spacing.xs,
  },
  action: {
    minHeight: grid.touchTargetMin,
    paddingHorizontal: spacing.sm,
    justifyContent: 'center',
  },
});
