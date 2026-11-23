import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { grid, radius, spacing, typography } from '../core/tokens';
import type { ChipsProps } from '../core/types';
import { useTheme } from './ThemeProvider.native';

export function Chips({
  opcoes,
  selecionadoId,
  onSelecionar,
  accessibilityLabel,
}: ChipsProps): React.JSX.Element {
  const { colors } = useTheme();
  const labelStyle = typography.scale.labelMd;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
      contentContainerStyle={styles.container}
    >
      {opcoes.map((chip) => {
        const selecionado = chip.id === selecionadoId;
        return (
          <Pressable
            key={chip.id}
            onPress={() => onSelecionar(chip.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected: selecionado }}
            style={[
              styles.chip,
              {
                backgroundColor: selecionado ? colors.selected : colors.surface,
                borderColor: selecionado ? colors.selected : colors.border,
              },
            ]}
          >
            <Text
              style={{
                fontFamily: labelStyle.fontFamilyNative,
                fontSize: labelStyle.fontSize,
                lineHeight: labelStyle.lineHeight,
                color: selecionado ? colors.onSelected : colors.textSecondary,
              }}
            >
              {chip.rotulo}
              {chip.contador !== undefined ? ` (${chip.contador})` : ''}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chip: {
    minHeight: grid.touchTargetMin,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
