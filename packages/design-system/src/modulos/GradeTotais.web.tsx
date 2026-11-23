import React from 'react';
import { formatarBRL } from '../core/formatters';
import { grid, radius, spacing, typography } from '../core/tokens';
import type { GradeTotaisProps } from '../core/types';

export function GradeTotais({ totais, onSelecionarGrupo }: GradeTotaisProps): React.JSX.Element {
  const labelStyle = typography.scale.labelSm;
  const valorStyle = typography.scale.titleMd;
  const smallStyle = typography.scale.bodySm;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(156px, 1fr))',
        gap: spacing.md,
      }}
    >
      {totais.map((card) => {
        const ehReceita = card.tipo === 'Receitas';
        const corDestaque = ehReceita ? 'var(--md-success)' : 'var(--md-text-primary)';
        return (
          <button
            key={card.tipo}
            type="button"
            onClick={onSelecionarGrupo ? () => onSelecionarGrupo(card.tipo) : undefined}
            style={{
              textAlign: 'left',
              minHeight: grid.touchTargetMin,
              padding: spacing.lg,
              borderRadius: radius.md,
              border: '1px solid var(--md-border)',
              backgroundColor: 'var(--md-surface)',
              cursor: onSelecionarGrupo ? 'pointer' : 'default',
              display: 'flex',
              flexDirection: 'column',
              gap: spacing.xs,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--md-font-family)',
                fontSize: labelStyle.fontSize,
                lineHeight: `${labelStyle.lineHeight}px`,
                fontWeight: Number(labelStyle.fontWeight),
                color: 'var(--md-text-secondary)',
              }}
            >
              {card.tipo}
            </span>
            <span
              className="mo-tabular"
              style={{
                fontFamily: 'var(--md-font-family)',
                fontSize: valorStyle.fontSize,
                lineHeight: `${valorStyle.lineHeight}px`,
                fontWeight: Number(valorStyle.fontWeight),
                fontVariantNumeric: 'tabular-nums',
                color: corDestaque,
              }}
            >
              {formatarBRL(card.realizadoCentavos)}
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
              Previsto: {formatarBRL(card.previstoCentavos)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
