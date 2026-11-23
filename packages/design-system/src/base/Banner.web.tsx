import React from 'react';
import { grid, radius, spacing, typography } from '../core/tokens';
import type { BannerProps, BannerVariante } from '../core/types';

function getBannerStyle(variante: BannerVariante): {
  bg: string;
  text: string;
  border: string;
} {
  switch (variante) {
    case 'erro':
      return {
        bg: 'var(--md-error-bg)',
        text: 'var(--md-on-error-bg)',
        border: 'var(--md-error)',
      };
    case 'atencao':
      return {
        bg: 'var(--md-warn-bg)',
        text: 'var(--md-warn-text)',
        border: 'var(--md-warn)',
      };
    case 'info':
      return {
        bg: 'var(--md-info-bg)',
        text: 'var(--md-on-info-bg)',
        border: 'var(--md-info)',
      };
  }
}

export function Banner({ variante, titulo, mensagem, acao }: BannerProps): React.JSX.Element {
  const palette = getBannerStyle(variante);
  const labelStyle = typography.scale.labelMd;
  const bodyStyle = typography.scale.bodySm;

  return (
    <div
      role={variante === 'erro' ? 'alert' : 'status'}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.md,
        padding: spacing.md,
        borderRadius: radius.md,
        borderLeftWidth: 4,
        borderLeftStyle: 'solid',
        borderLeftColor: palette.border,
        backgroundColor: palette.bg,
        color: palette.text,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
        {titulo && (
          <strong
            style={{
              fontFamily: 'var(--md-font-family)',
              fontSize: labelStyle.fontSize,
              lineHeight: `${labelStyle.lineHeight}px`,
              fontWeight: Number(labelStyle.fontWeight),
            }}
          >
            {titulo}
          </strong>
        )}
        <span
          style={{
            fontFamily: 'var(--md-font-family)',
            fontSize: bodyStyle.fontSize,
            lineHeight: `${bodyStyle.lineHeight}px`,
          }}
        >
          {mensagem}
        </span>
      </div>
      {acao && (
        <button
          type="button"
          onClick={acao.onPress}
          style={{
            minHeight: grid.touchTargetMin,
            paddingInline: spacing.md,
            borderRadius: radius.sm,
            border: 'none',
            backgroundColor: 'transparent',
            color: palette.text,
            fontFamily: 'var(--md-font-family)',
            fontSize: labelStyle.fontSize,
            fontWeight: Number(labelStyle.fontWeight),
            textDecoration: 'underline',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          {acao.rotulo}
        </button>
      )}
    </div>
  );
}
