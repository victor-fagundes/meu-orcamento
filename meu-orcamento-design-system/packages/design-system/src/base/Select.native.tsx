import React, { useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { grid, radius, spacing, typography } from '../core/tokens';
import type { SelectOpcao, SelectProps } from '../core/types';
import { useTheme } from './ThemeProvider.native';

export function Select({
  rotulo,
  valor,
  onChangeValor,
  opcoes,
  placeholder = 'Selecione...',
  erro,
  obrigatorio = false,
  disabled = false,
}: SelectProps): React.JSX.Element {
  const { colors } = useTheme();
  const [aberto, setAberto] = useState(false);

  const labelStyle = typography.scale.labelMd;
  const bodyStyle = typography.scale.bodyMd;
  const smallStyle = typography.scale.bodySm;

  const selecionada = opcoes.find((o) => o.valor === valor);

  const secoes = useMemo(() => {
    const mapa = new Map<string, SelectOpcao[]>();
    for (const op of opcoes) {
      const chave = op.grupo ?? '';
      const lista = mapa.get(chave) ?? [];
      lista.push(op);
      mapa.set(chave, lista);
    }
    return Array.from(mapa.entries());
  }, [opcoes]);

  return (
    <View style={styles.wrapper}>
      <Text
        style={{
          fontFamily: labelStyle.fontFamilyNative,
          fontSize: labelStyle.fontSize,
          lineHeight: labelStyle.lineHeight,
          color: colors.textPrimary,
        }}
      >
        {rotulo}
        {obrigatorio ? ' *' : ''}
      </Text>
      <Pressable
        onPress={disabled ? undefined : () => setAberto(true)}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={`${rotulo}: ${selecionada?.rotulo ?? placeholder}`}
        accessibilityState={{ disabled, expanded: aberto }}
        style={[
          styles.trigger,
          {
            borderWidth: erro ? 2 : 1,
            borderColor: erro ? colors.error : colors.borderStrong,
            backgroundColor: disabled ? colors.surfaceMuted : colors.surface,
          },
        ]}
      >
        <Text
          style={{
            fontFamily: bodyStyle.fontFamilyNative,
            fontSize: bodyStyle.fontSize,
            color: selecionada ? colors.textPrimary : colors.textMuted,
          }}
        >
          {selecionada ? selecionada.rotulo : placeholder}
        </Text>
        <Text style={{ color: colors.textSecondary, fontSize: 16 }}>▾</Text>
      </Pressable>

      {erro && (
        <Text
          accessibilityLiveRegion="polite"
          style={{
            fontFamily: smallStyle.fontFamilyNative,
            fontSize: smallStyle.fontSize,
            lineHeight: smallStyle.lineHeight,
            color: colors.error,
          }}
        >
          {erro}
        </Text>
      )}

      <Modal visible={aberto} transparent animationType="slide" onRequestClose={() => setAberto(false)}>
        <Pressable style={[styles.backdrop, { backgroundColor: colors.overlay }]} onPress={() => setAberto(false)}>
          <Pressable
            style={[styles.sheet, { backgroundColor: colors.surface }]}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={[styles.handle, { backgroundColor: colors.borderStrong }]} />
            <Text
              style={{
                fontFamily: typography.scale.titleMd.fontFamilyNative,
                fontSize: typography.scale.titleMd.fontSize,
                color: colors.textPrimary,
                marginBottom: spacing.md,
              }}
            >
              {rotulo}
            </Text>
            <ScrollView>
              {secoes.map(([grupo, itens]) => (
                <View key={grupo || 'geral'} style={styles.section}>
                  {grupo !== '' && (
                    <Text
                      style={{
                        fontFamily: typography.scale.labelSm.fontFamilyNative,
                        fontSize: typography.scale.labelSm.fontSize,
                        color: colors.textSecondary,
                        paddingVertical: spacing.xs,
                      }}
                    >
                      {grupo}
                    </Text>
                  )}
                  {itens.map((op) => {
                    const ativa = op.valor === valor;
                    return (
                      <Pressable
                        key={op.valor}
                        disabled={op.disabled}
                        onPress={() => {
                          onChangeValor(op.valor);
                          setAberto(false);
                        }}
                        accessibilityRole="menuitem"
                        accessibilityState={{ selected: ativa, disabled: op.disabled }}
                        style={[
                          styles.option,
                          {
                            backgroundColor: ativa ? colors.selected : 'transparent',
                            opacity: op.disabled ? 0.5 : 1,
                          },
                        ]}
                      >
                        <Text
                          style={{
                            fontFamily: bodyStyle.fontFamilyNative,
                            fontSize: bodyStyle.fontSize,
                            color: ativa ? colors.onSelected : colors.textPrimary,
                          }}
                        >
                          {op.rotulo}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: '100%', gap: spacing.xs },
  trigger: {
    height: grid.touchTargetMin,
    minHeight: grid.touchTargetMin,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    padding: spacing.lg,
    maxHeight: '75%',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: radius.full,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  section: {
    marginBottom: spacing.sm,
  },
  option: {
    minHeight: grid.touchTargetMin,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
  },
});
