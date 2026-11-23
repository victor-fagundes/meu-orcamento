import React from 'react';
import { calcularPercentualCentavos } from '../core/formatters';
import { radius, spacing, typography } from '../core/tokens';
import type { MedidorProps, MedidorStatus } from '../core/types';

function inferirStatus(percentual: number, status?: MedidorStatus): MedidorStatus {
  if (status) return status;
  if (percentual > 100) return 'excedido';
  if (percentual >= 80) return 'atencao';
  return 'normal';
}

function getMedidorColors(status: MedidorStatus): { bar: string; text: string } {
  switch (status) {
    case 'excedido':
      return { bar: 'var(--md-error)', text: 'var(--md-error)' };
    case 'atencao':
      return { bar: 'var(--md-warn)', text: 'var(--md-warn-text)' };
    case 'positivo':
      return { bar: 'var(--md-success)', text: 'var(--md-success)' };
    case 'normal':
      return { bar: 'var(--md-action)', text: 'var(--md-text-secondary)' };
  }
}

export function Medidor({
  realizadoCentavos,
  previstoCentavos,
  fraseEstado,
  status,
  accessibilityLabel,
}: MedidorProps): React.JSX.Element {
  const percentual = calcularPercentualCentavos(realizadoCentavos, previstoCentavos);
  const clamped = Math.max(0, Math.min(100, percentual));
  const statusResolvido = inferirStatus(percentual, status);
  const palette = getMedidorColors(statusResolvido);
  const smallStyle = typography.scale.bodySm;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs, width: '100%' }}>
      <div
        role="progressbar"
        aria-label={accessibilityLabel ?? fraseEstado}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clamped}
        style={{
          width: '100%',
          height: 8,
          borderRadius: radius.full,
          backgroundColor: 'var(--md-surface-muted)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${clamped}%`,
            height: '100%',
            borderRadius: radius.full,
            backgroundColor: palette.bar,
            transition: 'width var(--md-duration-normal) var(--md-easing-standard)',
          }}
        />
      </div>
      <span
        style={{
          fontFamily: 'var(--md-font-family)',
          fontSize: smallStyle.fontSize,
          lineHeight: `${smallStyle.lineHeight}px`,
          color: palette.text,
        }}
      >
        {fraseEstado}
      </span>
    </div>
  );
}
