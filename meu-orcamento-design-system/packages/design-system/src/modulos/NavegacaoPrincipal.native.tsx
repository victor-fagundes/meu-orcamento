import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Icone } from '../base/Icone.native';
import { useTheme } from '../base/ThemeProvider.native';
import { grid, radius, spacing, typography } from '../core/tokens';
import type { AbaPrincipalItem, NavegacaoPrincipalProps } from '../core/types';

const ABAS_PADRAO: readonly AbaPrincipalItem[] = [
  { id: 'resumo', rotulo: 'Resumo', icone: 'dashboard' },
  { id: 'orcamento', rotulo: 'Orçamento', icone: 'assignment' },
  { id: 'lancamentos', rotulo: 'Lançamentos', icone: 'list' },
  { id: 'ano', rotulo: 'Ano', icone: 'calendar_month' },
  { id: 'ajustes', rotulo: 'Ajustes', icone: 'settings' },
];

export function NavegacaoPrincipal({
  abaAtiva,
  emSubtelaAjustes = false,
  onSelecionarAba,
  abas = ABAS_PADRAO,
}: NavegacaoPrincipalProps): React.JSX.Element {
  const { colors } = useTheme();
  const labelStyle = typography.scale.labelSm;
  const abaEfetiva = emSubtelaAjustes ? 'ajustes' : abaAtiva;

  return (
    <View
      accessibilityRole="tablist"
      style={[
        styles.bar,
        {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      ]}
    >
      {abas.map((aba) => {
        const ativa = aba.id === abaEfetiva;
        return (
          <Pressable
            key={aba.id}
            onPress={() => onSelecionarAba(aba.id)}
            accessibilityRole="tab"
            accessibilityState={{ selected: ativa }}
            accessibilityLabel={aba.rotulo}
            style={styles.tab}
          >
            <View
              style={[
                styles.pill,
                {
                  backgroundColor: ativa ? colors.selected : 'transparent',
                },
              ]}
            >
              <Icone
                nome={aba.icone}
                tamanho={20}
                cor={ativa ? colors.onSelected : colors.textSecondary}
                decorativo
              />
            </View>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: labelStyle.fontFamilyNative,
                fontSize: labelStyle.fontSize,
                lineHeight: labelStyle.lineHeight,
                color: ativa ? colors.onSelected : colors.textSecondary,
              }}
            >
              {aba.rotulo}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  tab: {
    flex: 1,
    minHeight: grid.touchTargetMin,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
