import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { elevation, grid, radius, spacing, typography } from '../core/tokens';
import type { FABProps } from '../core/types';
import { Icone } from './Icone.native';
import { useTheme } from './ThemeProvider.native';

export function FAB({
  rotulo,
  onPress,
  icone,
  disabled = false,
  accessibilityLabel,
}: FABProps): React.JSX.Element {
  const { colors } = useTheme();
  const labelStyle = typography.scale.labelMd;
  const shadow = elevation.md;

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? rotulo}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.fab,
        {
          backgroundColor: colors.action,
          shadowColor: shadow.shadowColor,
          shadowOffset: shadow.shadowOffset,
          shadowOpacity: shadow.shadowOpacity,
          shadowRadius: shadow.shadowRadius,
          elevation: shadow.elevation,
          opacity: disabled ? 0.56 : pressed ? 0.88 : 1,
        },
      ]}
    >
      {icone && <Icone nome={icone} tamanho={20} cor={colors.onAction} decorativo />}
      <Text
        style={{
          color: colors.onAction,
          fontFamily: labelStyle.fontFamilyNative,
          fontSize: labelStyle.fontSize,
          lineHeight: labelStyle.lineHeight,
        }}
      >
        {rotulo}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: spacing.lg,
    bottom: spacing.lg,
    minHeight: grid.touchTargetMin,
    height: grid.touchTargetMin,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
});
