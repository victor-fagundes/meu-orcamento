import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { grid, radius, spacing, typography } from '../core/tokens';
import type { CheckboxProps } from '../core/types';
import { useTheme } from './ThemeProvider.native';

export function Checkbox({
  rotulo,
  descricao,
  marcado,
  onChangeMarcado,
  disabled = false,
}: CheckboxProps): React.JSX.Element {
  const { colors } = useTheme();
  const bodyStyle = typography.scale.bodyMd;
  const smallStyle = typography.scale.bodySm;

  return (
    <Pressable
      onPress={disabled ? undefined : () => onChangeMarcado(!marcado)}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityLabel={rotulo}
      accessibilityState={{ checked: marcado, disabled }}
      style={[styles.row, { opacity: disabled ? 0.56 : 1 }]}
    >
      <View
        style={[
          styles.box,
          {
            borderColor: marcado ? colors.action : colors.borderStrong,
            backgroundColor: marcado ? colors.action : colors.surface,
          },
        ]}
      >
        {marcado && <Text style={{ color: colors.onAction, fontSize: 14 }}>✓</Text>}
      </View>
      <View style={styles.texts}>
        <Text
          style={{
            fontFamily: bodyStyle.fontFamilyNative,
            fontSize: bodyStyle.fontSize,
            lineHeight: bodyStyle.lineHeight,
            color: colors.textPrimary,
          }}
        >
          {rotulo}
        </Text>
        {descricao && (
          <Text
            style={{
              fontFamily: smallStyle.fontFamilyNative,
              fontSize: smallStyle.fontSize,
              lineHeight: smallStyle.lineHeight,
              color: colors.textSecondary,
            }}
          >
            {descricao}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: grid.touchTargetMin,
    gap: spacing.md,
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: radius.xs,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: {
    flex: 1,
    gap: spacing.xs,
  },
});
