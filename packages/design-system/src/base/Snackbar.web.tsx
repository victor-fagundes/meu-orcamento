import React, { useEffect } from 'react';
import { grid, radius, spacing, typography } from '../core/tokens';
import type { SnackbarProps } from '../core/types';

export function Snackbar({
  visivel,
  mensagem,
  onFechar,
  onDesfazer,
  rotuloDesfazer = 'Desfazer',
  duracaoMs,
}: SnackbarProps): React.JSX.Element | null {
  const timeout = duracaoMs ?? (onDesfazer ? 10000 : 5000);

  useEffect(() => {
    if (!visivel) return;
    const timer = window.setTimeout(onFechar, timeout);
    return () => window.clearTimeout(timer);
  }, [visivel, timeout, onFechar]);

  if (!visivel) {
    return null;
  }

  const bodyStyle = typography.scale.bodyMd;
  const labelStyle = typography.scale.labelMd;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        left: '50%',
        bottom: spacing.xl,
        transform: 'translateX(-50%)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.lg,
        minHeight: grid.touchTargetMin,
        maxWidth: 'calc(100vw - 32px)',
        paddingInline: spacing.lg,
        paddingBlock: spacing.sm,
        borderRadius: radius.md,
        backgroundColor: 'var(--md-text-primary)',
        color: 'var(--md-text-inverse)',
        boxShadow: 'var(--md-shadow-lg)',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--md-font-family)',
          fontSize: bodyStyle.fontSize,
          lineHeight: `${bodyStyle.lineHeight}px`,
        }}
      >
        {mensagem}
      </span>
      {onDesfazer && (
        <button
          type="button"
          onClick={() => {
            onDesfazer();
            onFechar();
          }}
          style={{
            minHeight: grid.touchTargetMin,
            paddingInline: spacing.sm,
            border: 'none',
            backgroundColor: 'transparent',
            color: 'var(--md-selected)',
            fontFamily: 'var(--md-font-family)',
            fontSize: labelStyle.fontSize,
            fontWeight: Number(labelStyle.fontWeight),
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          {rotuloDesfazer}
        </button>
      )}
    </div>
  );
}
