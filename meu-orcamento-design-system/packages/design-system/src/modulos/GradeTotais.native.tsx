import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../base/ThemeProvider.native';
import { formatarBRL } from '../core/formatters';
import { grid, radius, spacing, typography } from '../core/tokens';
import type { GradeTotaisProps } from '../core/types';

export function GradeTotais({ totais, onSelecionarGrupo }: GradeTotaisProps): React.JSX.Element {
  const { colors } = useTheme();
  const labelStyle = typography.scale.labelSm;
  const valorStyle = typography.scale.titleMd;
  const smallStyle = typography.scale.bodySm;

  return (
    <View style={styles.grid}>
      {totais.map((card) => {
        const ehReceita = card.tipo === 'Receitas';
        return (
          <Pressable
            key={card.tipo}
            onPress={onSelecionarGrupo ? () => onSelecionarGrupo(card.tipo) : undefined}
            accessibilityRole="button"
            accessibilityLabel={`${card.tipo}: realizado ${formatarBRL(card.realizadoCentavos)} de ${formatarBRL(card.previstoCentavos)}`}
            style={[
              styles.card,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Text
              style={{
                fontFamily: labelStyle.fontFamilyNative,
                fontSize: labelStyle.fontSize,
                lineHeight: labelStyle.lineHeight,
                color: colors.textSecondary,
              }}
            >
              {card.tipo}
            </Text>
            <Text
              style={{
                fontFamily: valorStyle.fontFamilyNative,
                fontSize: valorStyle.fontSize,
                lineHeight: valorStyle.lineHeight,
                fontVariant: ['tabular-nums'],
                color: ehReceita ? colors.success : colors.textPrimary,
              }}
            >
              {formatarBRL(card.realizadoCentavos)}
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
              Previsto: {formatarBRL(card.previstoCentavos)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  card: {
    width: '48%',
    minHeight: grid.touchTargetMin,
    padding: spacing.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.xs,
  },
});
