import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { calcularPercentualCentavos } from '../core/formatters';
import { radius, spacing, typography, type ColorTokens } from '../core/tokens';
import type { MedidorProps, MedidorStatus } from '../core/types';
import { useTheme } from './ThemeProvider.native';

function inferirStatus(percentual: number, status?: MedidorStatus): MedidorStatus {
  if (status) return status;
  if (percentual > 100) return 'excedido';
  if (percentual >= 80) return 'atencao';
  return 'normal';
}

function resolveNativeMedidorColors(
  status: MedidorStatus,
  colors: ColorTokens
): { bar: string; text: string } {
  switch (status) {
    case 'excedido':
      return { bar: colors.error, text: colors.error };
    case 'atencao':
      return { bar: colors.warn, text: colors.warnText };
    case 'positivo':
      return { bar: colors.success, text: colors.success };
    case 'normal':
      return { bar: colors.action, text: colors.textSecondary };
  }
}

export function Medidor({
  realizadoCentavos,
  previstoCentavos,
  fraseEstado,
  status,
  accessibilityLabel,
}: MedidorProps): React.JSX.Element {
  const { colors } = useTheme();
  const percentual = calcularPercentualCentavos(realizadoCentavos, previstoCentavos);
  const clamped = Math.max(0, Math.min(100, percentual));
  const statusResolvido = inferirStatus(percentual, status);
  const palette = resolveNativeMedidorColors(statusResolvido, colors);
  const smallStyle = typography.scale.bodySm;

  return (
    <View style={styles.wrapper}>
      <View
        accessible
        accessibilityRole="progressbar"
        accessibilityLabel={accessibilityLabel ?? fraseEstado}
        accessibilityValue={{ min: 0, max: 100, now: clamped }}
        style={[styles.track, { backgroundColor: colors.surfaceMuted }]}
      >
        <View
          style={[
            styles.fill,
            {
              width: `${clamped}%`,
              backgroundColor: palette.bar,
            },
          ]}
        />
      </View>
      <Text
        style={{
          fontFamily: smallStyle.fontFamilyNative,
          fontSize: smallStyle.fontSize,
          lineHeight: smallStyle.lineHeight,
          color: palette.text,
        }}
      >
        {fraseEstado}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    gap: spacing.xs,
  },
  track: {
    width: '100%',
    height: 8,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: radius.full,
  },
});
