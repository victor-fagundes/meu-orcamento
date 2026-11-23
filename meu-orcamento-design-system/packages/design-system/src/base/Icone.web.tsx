import React from 'react';
import { iconPaths } from '../core/icons-paths';
import type { IconeProps } from '../core/types';

export function Icone(props: IconeProps): React.JSX.Element {
  const { nome, tamanho = 24, cor = 'currentColor' } = props;
  const pathData = iconPaths[nome];
  const isDecorative = props.decorativo === true;

  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill={cor}
      aria-hidden={isDecorative ? true : undefined}
      aria-label={isDecorative ? undefined : props.accessibilityLabel}
      role={isDecorative ? undefined : 'img'}
      style={{ display: 'inline-block', flexShrink: 0 }}
    >
      <path d={pathData} />
    </svg>
  );
}
