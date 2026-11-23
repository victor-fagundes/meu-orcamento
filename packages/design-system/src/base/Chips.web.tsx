import React from 'react';
import { grid, radius, spacing, typography } from '../core/tokens';
import type { ChipsProps } from '../core/types';

export function Chips({
  opcoes,
  selecionadoId,
  onSelecionar,
  accessibilityLabel,
}: ChipsProps): React.JSX.Element {
  const labelStyle = typography.scale.labelMd;

  return (
    <div
      role="tablist"
      aria-label={accessibilityLabel}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: spacing.sm,
      }}
    >
      {opcoes.map((chip) => {
        const selecionado = chip.id === selecionadoId;
        return (
          <button
            key={chip.id}
            type="button"
            role="tab"
            aria-selected={selecionado}
            onClick={() => onSelecionar(chip.id)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: spacing.xs,
              minHeight: grid.touchTargetMin,
              paddingInline: spacing.lg,
              borderRadius: radius.full,
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: selecionado ? 'var(--md-selected)' : 'var(--md-border)',
              backgroundColor: selecionado ? 'var(--md-selected)' : 'var(--md-surface)',
              color: selecionado ? 'var(--md-on-selected)' : 'var(--md-text-secondary)',
              fontFamily: 'var(--md-font-family)',
              fontSize: labelStyle.fontSize,
              lineHeight: `${labelStyle.lineHeight}px`,
              fontWeight: Number(labelStyle.fontWeight),
              cursor: 'pointer',
            }}
          >
            <span>{chip.rotulo}</span>
            {chip.contador !== undefined && (
              <span className="mo-tabular">({chip.contador})</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
