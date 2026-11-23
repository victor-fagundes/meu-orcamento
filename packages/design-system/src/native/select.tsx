import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { SelectProps } from '../base/contratos.ts';
import { radius, spacing, typography } from '../core/tokens.ts';
import { useCores } from './tema.tsx';

export function Select({ id, rotulo, valor, grupos, onMudar, placeholder = 'Escolha', erro, desabilitado = false }: SelectProps) {
  const cores = useCores();
  const [aberto, setAberto] = useState(false);
  const rotuloAtual = grupos.flatMap((g) => g.opcoes).find((o) => o.valor === valor)?.rotulo ?? placeholder;
  const temErro = erro !== undefined && erro !== '';
  return (
    <View style={styles.bloco}>
      <Text nativeID={`${id}-rotulo`} style={[styles.rotulo, { color: cores.text }]}>{rotulo}</Text>
      <Pressable
        onPress={() => setAberto(true)}
        disabled={desabilitado}
        accessibilityRole="combobox"
        accessibilityLabel={rotulo}
        accessibilityState={{ disabled: desabilitado }}
        style={[styles.entrada, { backgroundColor: cores.field }, temErro ? { borderWidth: 1.5, borderColor: cores.error } : null]}
      >
        <Text style={[styles.valor, { color: valor === null ? cores.textMuted : cores.text }]}>{rotuloAtual}</Text>
      </Pressable>
      {temErro ? <Text style={[styles.erro, { color: cores.error }]}>{erro}</Text> : null}
      <Modal transparent visible={aberto} animationType="slide" onRequestClose={() => setAberto(false)}>
        <View style={styles.fundo}>
          <View style={[styles.folha, { backgroundColor: cores.card }]}>
            <ScrollView>
              {grupos.map((grupo) => (
                <View key={grupo.rotulo}>
                  <Text accessibilityRole="header" style={[styles.grupo, { color: cores.textMuted }]}>{grupo.rotulo}</Text>
                  {grupo.opcoes.map((opcao) => (
                    <Pressable
                      key={opcao.valor}
                      accessibilityRole="menuitem"
                      accessibilityState={{ selected: opcao.valor === valor }}
                      onPress={() => {
                        onMudar(opcao.valor);
                        setAberto(false);
                      }}
                      style={styles.opcao}
                    >
                      <Text style={[styles.opcaoTexto, { color: cores.text }]}>{opcao.rotulo}</Text>
                    </Pressable>
                  ))}
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  bloco: { gap: spacing[2] },
  rotulo: { fontFamily: typography.family, fontSize: typography.caption.size, fontWeight: '700' },
  entrada: { height: 52, paddingHorizontal: spacing[4], borderRadius: radius.lg, justifyContent: 'center' },
  valor: { fontFamily: typography.family, fontSize: typography.body.size },
  erro: { fontFamily: typography.family, fontSize: typography.caption.size },
  fundo: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(25, 28, 32, 0.32)' },
  folha: { borderTopLeftRadius: radius.sheet, borderTopRightRadius: radius.sheet, padding: spacing[4], maxHeight: '80%' },
  grupo: { fontFamily: typography.family, fontSize: typography.caption.size, fontWeight: '700', paddingVertical: spacing[2] },
  opcao: { minHeight: 48, justifyContent: 'center' },
  opcaoTexto: { fontFamily: typography.family, fontSize: typography.body.size },
});
