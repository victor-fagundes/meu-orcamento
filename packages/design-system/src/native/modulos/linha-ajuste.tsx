import { Pressable, Text, View } from 'react-native';
import type { LinhaAjusteProps } from '../../base/contratos.ts';
import { spacing, typography } from '../../core/tokens.ts';
import { Icone } from '../icone.tsx';
import { useCores } from '../tema.tsx';

export function LinhaAjuste({ icone, rotulo, apoio, onAbrir, destrutivo = false }: LinhaAjusteProps) {
  const cores = useCores();
  const corTexto = destrutivo ? cores.error : cores.text;
  return (
    <Pressable onPress={onAbrir} accessibilityRole="button" accessibilityLabel={apoio ? `${rotulo}, ${apoio}` : rotulo} style={{ minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: spacing[3], paddingHorizontal: spacing[4] }}>
      <Icone nome={icone} tamanho={20} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: typography.family, fontSize: typography.body.size, color: corTexto }}>{rotulo}</Text>
        {apoio ? <Text style={{ fontFamily: typography.family, fontSize: typography.caption.size, color: cores.textMuted }}>{apoio}</Text> : null}
      </View>
      <Text style={{ fontSize: 20, color: cores.textMuted }}>›</Text>
    </Pressable>
  );
}
