import React from 'react';
import { formatarBRL } from '../core/formatters';
import { grid, spacing, typography } from '../core/tokens';
import type { LinhaItemProps } from '../core/types';

export function LinhaItem({ item, onPress }: LinhaItemProps): React.JSX.Element {
  const bodyStyle = typography.scale.bodyMd;
  const valorStyle = typography.scale.valorTabular;
  const smallStyle = typography.scale.bodySm;

  return (
    <button
      type="button"
      onClick={() => onPress(item)}
      style={{
        width: '100%',
        minHeight: grid.touchTargetMin,
        paddingBlock: spacing.md,
        paddingInline: spacing.lg,
        border: 'none',
        borderTop: '1px solid var(--md-border)',
        backgroundColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.md,
        textAlign: 'left',
        cursor: 'pointer',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--md-font-family)',
          fontSize: bodyStyle.fontSize,
          lineHeight: `${bodyStyle.lineHeight}px`,
          color: 'var(--md-text-primary)',
        }}
      >
        {item.nome}
      </span>

      <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <span
          className="mo-tabular"
          style={{
            fontFamily: 'var(--md-font-family)',
            fontSize: valorStyle.fontSize,
            lineHeight: `${valorStyle.lineHeight}px`,
            fontWeight: Number(valorStyle.fontWeight),
            fontVariantNumeric: 'tabular-nums',
            color: 'var(--md-text-primary)',
          }}
        >
          {formatarBRL(item.realizadoCentavos)}
        </span>
        <span
          className="mo-tabular"
          style={{
            fontFamily: 'var(--md-font-family)',
            fontSize: smallStyle.fontSize,
            lineHeight: `${smallStyle.lineHeight}px`,
            fontVariantNumeric: 'tabular-nums',
            color: 'var(--md-text-muted)',
          }}
        >
          de {formatarBRL(item.previstoCentavos)}
        </span>
      </span>
    </button>
  );
}
