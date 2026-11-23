import React from 'react';
import { radius } from '../core/tokens';
import type { SkeletonProps } from '../core/types';

export function Skeleton({
  largura = '100%',
  altura = 16,
  arredondado = false,
}: SkeletonProps): React.JSX.Element {
  return (
    <div
      aria-hidden="true"
      style={{
        width: typeof largura === 'number' ? `${largura}px` : largura,
        height: altura,
        borderRadius: arredondado ? radius.full : radius.sm,
        backgroundColor: 'var(--md-surface-muted)',
      }}
    />
  );
}
