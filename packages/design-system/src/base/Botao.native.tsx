import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { grid, radius, spacing, typography, type ColorTokens } from '../core/tokens';
import type { BotaoProps, BotaoVariante } from '../core/types';
import { Icone } from './Icone.native';
import { useTheme } from './ThemeProvider.native';

function resolveNativeColors(
  variante: BotaoVariante,
  colors: ColorTokens
): { bg: string; text: string; border: string } {
  switch (variante) {
    case 'primario':
      return { bg: colors.action, text: colors.onAction, border: 'transparent' };
    case 'secundario':
      return { bg: colors.surface, text: colors.textPrimary, border: colors.borderStrong };
    case 'destrutivo':
      return { bg: colors.error, text: colors.textInverse, border: 'transparent' };
    case 'texto':
      return { bg: 'transparent', text: colors.action, border: 'transparent' };
  }
}

export function Botao({
  children,
  variante = 'primario',
  onPress,
  disabled = false,
  loading = false,
  icone,
  larguraTotal = true,
  accessibilityLabel,
}: BotaoProps): React.JSX.Element {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;
  const palette = resolveNativeColors(variante, colors);
  const labelStyle = typography.scale.labelMd;

  return (
    <Pressable
      onPress={isDisabled ? undefined : onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? (typeof children === 'string' ? children : undefined)}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: palette.bg,
          borderColor: palette.border,
          width: larguraTotal ? '100%' : undefined,
          opacity: isDisabled ? 0.56 : pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="small" color={palette.text} />
        ) : (
          icone && <Icone nome={icone} tamanho={20} cor={palette.text} decorativo />
        )}
        <Text
          style={{
            color: palette.text,
            fontFamily: labelStyle.fontFamilyNative,
            fontSize: labelStyle.fontSize,
            lineHeight: labelStyle.lineHeight,
          }}
        >
          {children}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: grid.touchTargetMin,
    minHeight: grid.touchTargetMin,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
});
