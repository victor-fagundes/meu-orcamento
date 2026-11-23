import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../base/ThemeProvider.native';
import { formatarBRL, formatarDataBR } from '../core/formatters';
import { grid, radius, spacing, typography } from '../core/tokens';
import type { LinhaLancamentoProps } from '../core/types';

export function LinhaLancamento({
  id,
  descricao,
  valorCentavos,
  tipo,
  dataISO,
  nomeItem,
  meioPagamento,
  faturaMesAno,
  onPress,
}: LinhaLancamentoProps): React.JSX.Element {
  const { colors } = useTheme();
  const bodyStyle = typography.scale.bodyMd;
  const valorStyle = typography.scale.valorTabular;
  const smallStyle = typography.scale.bodySm;
  const labelSm = typography.scale.labelSm;

  const sinal = tipo === 'receita' ? '+' : '-';

  return (
    <Pressable
      onPress={onPress ? () => onPress(id) : undefined}
      accessibilityRole={onPress ? 'button' : 'none'}
      style={[
        styles.row,
        {
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.left}>
        <Text
          style={{
            fontFamily: bodyStyle.fontFamilyNative,
            fontSize: bodyStyle.fontSize,
            lineHeight: bodyStyle.lineHeight,
            color: colors.textPrimary,
          }}
        >
          {descricao}
        </Text>
        <View style={styles.metaRow}>
          <Text
            style={{
              fontFamily: smallStyle.fontFamilyNative,
              fontSize: smallStyle.fontSize,
              lineHeight: smallStyle.lineHeight,
              color: colors.textSecondary,
            }}
          >
            {formatarDataBR(dataISO)} • {nomeItem} • {meioPagamento}
          </Text>
          {faturaMesAno && (
            <View style={[styles.badge, { backgroundColor: colors.surfaceMuted }]}>
              <Text
                style={{
                  fontFamily: labelSm.fontFamilyNative,
                  fontSize: labelSm.fontSize,
                  lineHeight: labelSm.lineHeight,
                  color: colors.textSecondary,
                }}
              >
                Fatura {faturaMesAno}
              </Text>
            </View>
          )}
        </View>
      </View>

      <Text
        style={{
          fontFamily: valorStyle.fontFamilyNative,
          fontSize: valorStyle.fontSize,
          lineHeight: valorStyle.lineHeight,
          fontVariant: ['tabular-nums'],
          color: tipo === 'receita' ? colors.success : colors.textPrimary,
        }}
      >
        {sinal} {formatarBRL(Math.abs(valorCentavos))}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: grid.touchTargetMin,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  left: {
    flex: 1,
    gap: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.sm,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },
});
