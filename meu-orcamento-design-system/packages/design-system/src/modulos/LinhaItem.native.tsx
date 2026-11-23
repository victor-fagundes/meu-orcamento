import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../base/ThemeProvider.native';
import { formatarBRL } from '../core/formatters';
import { grid, spacing, typography } from '../core/tokens';
import type { LinhaItemProps } from '../core/types';

export function LinhaItem({ item, onPress }: LinhaItemProps): React.JSX.Element {
  const { colors } = useTheme();
  const bodyStyle = typography.scale.bodyMd;
  const valorStyle = typography.scale.valorTabular;
  const smallStyle = typography.scale.bodySm;

  return (
    <Pressable
      onPress={() => onPress(item)}
      accessibilityRole="button"
      accessibilityLabel={`${item.nome}: ${formatarBRL(item.realizadoCentavos)} de ${formatarBRL(item.previstoCentavos)}`}
      style={[styles.row, { borderTopColor: colors.border }]}
    >
      <Text
        style={{
          flex: 1,
          fontFamily: bodyStyle.fontFamilyNative,
          fontSize: bodyStyle.fontSize,
          lineHeight: bodyStyle.lineHeight,
          color: colors.textPrimary,
        }}
      >
        {item.nome}
      </Text>
      <View style={styles.right}>
        <Text
          style={{
            fontFamily: valorStyle.fontFamilyNative,
            fontSize: valorStyle.fontSize,
            lineHeight: valorStyle.lineHeight,
            fontVariant: ['tabular-nums'],
            color: colors.textPrimary,
          }}
        >
          {formatarBRL(item.realizadoCentavos)}
        </Text>
        <Text
          style={{
            fontFamily: smallStyle.fontFamilyNative,
            fontSize: smallStyle.fontSize,
            lineHeight: smallStyle.lineHeight,
            fontVariant: ['tabular-nums'],
            color: colors.textMuted,
          }}
        >
          de {formatarBRL(item.previstoCentavos)}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: grid.touchTargetMin,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderTopWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  right: {
    alignItems: 'flex-end',
  },
});
