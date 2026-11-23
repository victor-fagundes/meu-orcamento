import React from 'react';
import { grid, radius, spacing, typography } from '../core/tokens';
import type { BotaoProps, BotaoVariante } from '../core/types';
import { Icone } from './Icone.web';

function getButtonColors(variante: BotaoVariante): {
  bg: string;
  color: string;
  border: string;
} {
  switch (variante) {
    case 'primario':
      return {
        bg: 'var(--md-action)',
        color: 'var(--md-on-action)',
        border: 'transparent',
      };
    case 'secundario':
      return {
        bg: 'var(--md-surface)',
        color: 'var(--md-text-primary)',
        border: 'var(--md-border-strong)',
      };
    case 'destrutivo':
      return {
        bg: 'var(--md-error)',
        color: 'var(--md-text-inverse)',
        border: 'transparent',
      };
    case 'texto':
      return {
        bg: 'transparent',
        color: 'var(--md-action)',
        border: 'transparent',
      };
  }
}

export function Botao({
  children,
  variante = 'primario',
  onPress,
  type = 'button',
  disabled = false,
  loading = false,
  icone,
  larguraTotal = false,
  accessibilityLabel,
}: BotaoProps): React.JSX.Element {
  const isDisabled = disabled || loading;
  const palette = getButtonColors(variante);
  const labelStyle = typography.scale.labelMd;

  return (
    <button
      type={type}
      onClick={isDisabled ? undefined : onPress}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      aria-label={accessibilityLabel}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        height: grid.touchTargetMin,
        minHeight: grid.touchTargetMin,
        width: larguraTotal ? '100%' : 'auto',
        paddingInline: variante === 'texto' ? spacing.md : spacing.lg,
        borderRadius: radius.md,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: palette.border,
        backgroundColor: palette.bg,
        color: palette.color,
        fontFamily: 'var(--md-font-family)',
        fontSize: labelStyle.fontSize,
        lineHeight: `${labelStyle.lineHeight}px`,
        fontWeight: Number(labelStyle.fontWeight),
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.56 : 1,
        transition: 'opacity var(--md-duration-fast) var(--md-easing-standard)',
      }}
    >
      {loading ? (
        <span aria-hidden="true">•••</span>
      ) : (
        icone && <Icone nome={icone} tamanho={20} cor="currentColor" decorativo />
      )}
      <span>{children}</span>
    </button>
  );
}
