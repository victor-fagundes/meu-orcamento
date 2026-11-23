import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Medidor } from '../base/Medidor.native';
import { useTheme } from '../base/ThemeProvider.native';
import { formatarBRL } from '../core/formatters';
import { grid, radius, spacing, typography } from '../core/tokens';
import type { BlocoSaldoProps } from '../core/types';

export function BlocoSaldo({
  rotulo = 'Disponível neste mês',
  saldoCentavos,
  fraseApoio,
  previstoDespesasCentavos,
  realizadoDespesasCentavos,
  fraseMedidor,
  ocultoInicial = false,
  onToggleOculto,
}: BlocoSaldoProps): React.JSX.Element {
  const { colors } = useTheme();
  const [oculto, setOculto] = useState(ocultoInicial);

  const labelStyle = typography.scale.labelMd;
  const displayStyle = typography.scale.displayMd;
  const bodyStyle = typography.scale.bodySm;

  const alternarVisibilidade = (): void => {
    const proximo = !oculto;
    setOculto(proximo);
    onToggleOculto?.(proximo);
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.topRow}>
        <Text
          style={{
            fontFamily: labelStyle.fontFamilyNative,
            fontSize: labelStyle.fontSize,
            lineHeight: labelStyle.lineHeight,
            color: colors.textSecondary,
          }}
        >
          {rotulo}
        </Text>
        <Pressable
          onPress={alternarVisibilidade}
          accessibilityRole="button"
          accessibilityLabel={oculto ? 'Mostrar saldo' : 'Ocultar saldo'}
          accessibilityState={{ selected: oculto }}
          style={[styles.toggleBtn, { borderColor: colors.border }]}
        >
          <Text
            style={{
              fontFamily: bodyStyle.fontFamilyNative,
              fontSize: bodyStyle.fontSize,
              color: colors.textSecondary,
            }}
          >
            {oculto ? 'Mostrar' : 'Ocultar'}
          </Text>
        </Pressable>
      </View>

      <Text
        style={{
          fontFamily: displayStyle.fontFamilyNative,
          fontSize: displayStyle.fontSize,
          lineHeight: displayStyle.lineHeight,
          letterSpacing: displayStyle.letterSpacing,
          fontVariant: ['tabular-nums'],
          color: saldoCentavos < 0 ? colors.error : colors.textPrimary,
        }}
      >
        {oculto ? 'R$ ••••••' : formatarBRL(saldoCentavos)}
      </Text>

      <Text
        style={{
          fontFamily: bodyStyle.fontFamilyNative,
          fontSize: bodyStyle.fontSize,
          lineHeight: bodyStyle.lineHeight,
          color: colors.textSecondary,
        }}
      >
        {fraseApoio}
      </Text>

      <Medidor
        realizadoCentavos={realizadoDespesasCentavos}
        previstoCentavos={previstoDespesasCentavos}
        fraseEstado={fraseMedidor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  toggleBtn: {
    minHeight: grid.touchTargetMin,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1,
    justifyContent: 'center',
  },
});
