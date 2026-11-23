import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../base/ThemeProvider.native';
import { formatarBRL } from '../core/formatters';
import { radius, spacing, typography } from '../core/tokens';
import type { TabelaMesesProps } from '../core/types';

const NOMES_MESES: readonly string[] = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
];

export function TabelaMeses({ ano, mesAtivo, linhas }: TabelaMesesProps): React.JSX.Element {
  const { colors } = useTheme();
  const labelStyle = typography.scale.labelSm;
  const valorStyle = typography.scale.valorTabular;

  return (
    <ScrollView
      horizontal
      style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}
    >
      <View>
        <View style={[styles.row, { borderBottomColor: colors.border }]}>
          <Text style={[styles.firstCol, { fontFamily: labelStyle.fontFamilyNative, color: colors.textSecondary }]}>
            Grupo ({ano})
          </Text>
          {NOMES_MESES.map((m, idx) => {
            const ativo = idx + 1 === mesAtivo;
            return (
              <Text
                key={m}
                style={[
                  styles.cell,
                  {
                    fontFamily: labelStyle.fontFamilyNative,
                    backgroundColor: ativo ? colors.selected : 'transparent',
                    color: ativo ? colors.onSelected : colors.textSecondary,
                  },
                ]}
              >
                {m}
              </Text>
            );
          })}
          <Text style={[styles.cell, { fontFamily: labelStyle.fontFamilyNative, color: colors.textPrimary }]}>
            Total
          </Text>
        </View>

        {linhas.map((linha) => {
          const ehSobra = linha.tipo === 'sobra';
          return (
            <View
              key={linha.id}
              style={[
                styles.row,
                {
                  borderBottomColor: colors.border,
                  backgroundColor: ehSobra ? colors.surfaceMuted : 'transparent',
                },
              ]}
            >
              <Text style={[styles.firstCol, { fontFamily: valorStyle.fontFamilyNative, color: colors.textPrimary }]}>
                {linha.rotulo}
              </Text>
              {linha.valoresCentavos.map((val, idx) => {
                const ativo = idx + 1 === mesAtivo;
                return (
                  <Text
                    key={`${linha.id}-${idx}`}
                    style={[
                      styles.cell,
                      {
                        fontFamily: valorStyle.fontFamilyNative,
                        fontVariant: ['tabular-nums'],
                        backgroundColor: ativo ? colors.selected : 'transparent',
                        color: ativo ? colors.onSelected : colors.textPrimary,
                      },
                    ]}
                  >
                    {formatarBRL(val, { omitirSimbolo: true })}
                  </Text>
                );
              })}
              <Text
                style={[
                  styles.cell,
                  {
                    fontFamily: valorStyle.fontFamilyNative,
                    fontVariant: ['tabular-nums'],
                    color: ehSobra && linha.totalAnoCentavos < 0 ? colors.error : colors.textPrimary,
                  },
                ]}
              >
                {formatarBRL(linha.totalAnoCentavos)}
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: radius.lg,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  firstCol: {
    width: 140,
    padding: spacing.md,
    fontSize: 13,
  },
  cell: {
    width: 96,
    padding: spacing.md,
    textAlign: 'right',
    fontSize: 13,
  },
});
