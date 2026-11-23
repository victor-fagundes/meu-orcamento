import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { iconPaths } from '../core/icons-paths';
import type { IconeProps } from '../core/types';
import { useTheme } from './ThemeProvider.native';

export function Icone(props: IconeProps): React.JSX.Element {
  const { colors } = useTheme();
  const { nome, tamanho = 24, cor = colors.textPrimary } = props;
  const pathData = iconPaths[nome];
  const isDecorative = props.decorativo === true;

  return (
    <Svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill={cor}
      accessible={!isDecorative}
      accessibilityRole={isDecorative ? undefined : 'image'}
      accessibilityLabel={isDecorative ? undefined : props.accessibilityLabel}
    >
      <Path d={pathData} fill={cor} />
    </Svg>
  );
}
