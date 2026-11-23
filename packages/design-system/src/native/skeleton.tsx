import { View } from 'react-native';
import type { SkeletonProps } from '../base/contratos.ts';
import { radius } from '../core/tokens.ts';
import { useCores } from './tema.tsx';

const raio = { bloco: radius.lg, linha: radius.full, cartao: radius.xl } as const;

export function Skeleton({ altura, largura = '100%', forma = 'bloco' }: SkeletonProps) {
  const cores = useCores();
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{ height: altura, width: largura, borderRadius: raio[forma], backgroundColor: cores.line }}
    />
  );
}
