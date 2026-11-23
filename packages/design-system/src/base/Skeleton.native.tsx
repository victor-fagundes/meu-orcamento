import React from 'react';
import { View } from 'react-native';
import { radius } from '../core/tokens';
import type { SkeletonProps } from '../core/types';
import { useTheme } from './ThemeProvider.native';

export function Skeleton({
  largura = '100%',
  altura = 16,
  arredondado = false,
}: SkeletonProps): React.JSX.Element {
  const { colors } = useTheme();
  const widthStyle = typeof largura === 'number' ? largura : (largura as `${number}%`);

  return (
    <View
      accessible={false}
      style={{
        width: widthStyle,
        height: altura,
        borderRadius: arredondado ? radius.full : radius.sm,
        backgroundColor: colors.surfaceMuted,
      }}
    />
  );
}
