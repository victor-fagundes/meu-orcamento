import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { elevation, grid, radius, spacing, typography } from '../core/tokens';
import type { SnackbarProps } from '../core/types';
import { useTheme } from './ThemeProvider.native';

export function Snackbar({
  visivel,
  mensagem,
  onFechar,
  onDesfazer,
  rotuloDesfazer = 'Desfazer',
  duracaoMs,
}: SnackbarProps): React.JSX.Element | null {
  const { colors } = useTheme();
  const timeout = duracaoMs ?? (onDesfazer ? 10000 : 5000);

  useEffect(() => {
    if (!visivel) return;
    const timer = setTimeout(onFechar, timeout);
    return () => clearTimeout(timer);
  }, [visivel, timeout, onFechar]);

  if (!visivel) {
    return null;
  }

  const bodyStyle = typography.scale.bodyMd;
  const labelStyle = typography.scale.labelMd;
  const shadow = elevation.lg;

  return (
    <View
      accessibilityLiveRegion="polite"
      style={[
        styles.container,
        {
          backgroundColor: colors.textPrimary,
          shadowColor: shadow.shadowColor,
          shadowOffset: shadow.shadowOffset,
          shadowOpacity: shadow.shadowOpacity,
          shadowRadius: shadow.shadowRadius,
          elevation: shadow.elevation,
        },
      ]}
    >
      <Text
        style={{
          flex: 1,
          fontFamily: bodyStyle.fontFamilyNative,
          fontSize: bodyStyle.fontSize,
          lineHeight: bodyStyle.lineHeight,
          color: colors.textInverse,
        }}
      >
        {mensagem}
      </Text>
      {onDesfazer && (
        <Pressable
          onPress={() => {
            onDesfazer();
            onFechar();
          }}
          accessibilityRole="button"
          accessibilityLabel={rotuloDesfazer}
          style={styles.undo}
        >
          <Text
            style={{
              fontFamily: labelStyle.fontFamilyNative,
              fontSize: labelStyle.fontSize,
              color: colors.selected,
            }}
          >
            {rotuloDesfazer}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.lg,
    minHeight: grid.touchTargetMin,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  undo: {
    minHeight: grid.touchTargetMin,
    paddingHorizontal: spacing.sm,
    justifyContent: 'center',
  },
});
