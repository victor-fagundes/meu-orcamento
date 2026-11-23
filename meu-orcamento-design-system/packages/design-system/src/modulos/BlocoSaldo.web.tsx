import React, { useState } from 'react';
import { Medidor } from '../base/Medidor.web';
import { formatarBRL } from '../core/formatters';
import { grid, radius, spacing, typography } from '../core/tokens';
import type { BlocoSaldoProps } from '../core/types';

export function BlocoSaldo({
  rotulo = 'Disponível neste mês',
  saldoCentavos,
  fraseApoio,
  previstoDespesasCentavos,
  realizadoDespesasCentavos,
  fraseMedidor,
  ocultoInicial = false,
  onToggleOculto,
}: BlocoSaldoProps): React.JSX.Element {
  const [oculto, setOculto] = useState(ocultoInicial);

  const labelStyle = typography.scale.labelMd;
  const displayStyle = typography.scale.displayLg;
  const bodyStyle = typography.scale.bodySm;

  const alternarVisibilidade = (): void => {
    const proximo = !oculto;
    setOculto(proximo);
    onToggleOculto?.(proximo);
  };

  const valorCor = saldoCentavos < 0 ? 'var(--md-error)' : 'var(--md-text-primary)';

  return (
    <section
      aria-label={rotulo}
      style={{
        backgroundColor: 'var(--md-surface)',
        border: '1px solid var(--md-border)',
        borderRadius: radius.lg,
        padding: spacing.xl,
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.md,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing.md,
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
          {rotulo}
        </span>
        <button
          type="button"
          onClick={alternarVisibilidade}
          aria-pressed={oculto}
          aria-label={oculto ? 'Mostrar saldo' : 'Ocultar saldo'}
          style={{
            minHeight: grid.touchTargetMin,
            paddingInline: spacing.md,
            borderRadius: radius.sm,
            border: '1px solid var(--md-border)',
            backgroundColor: 'var(--md-surface)',
            color: 'var(--md-text-secondary)',
            fontFamily: 'var(--md-font-family)',
            fontSize: bodyStyle.fontSize,
            cursor: 'pointer',
          }}
        >
          {oculto ? 'Mostrar' : 'Ocultar'}
        </button>
      </div>

      <div
        className="mo-tabular"
        style={{
          fontFamily: 'var(--md-font-family)',
          fontSize: displayStyle.fontSize,
          lineHeight: `${displayStyle.lineHeight}px`,
          fontWeight: Number(displayStyle.fontWeight),
          letterSpacing: `${displayStyle.letterSpacing}px`,
          fontVariantNumeric: 'tabular-nums',
          color: valorCor,
        }}
      >
        {oculto ? 'R$ ••••••' : formatarBRL(saldoCentavos)}
      </div>

      <p
        style={{
          margin: 0,
          fontFamily: 'var(--md-font-family)',
          fontSize: bodyStyle.fontSize,
          lineHeight: `${bodyStyle.lineHeight}px`,
          color: 'var(--md-text-secondary)',
        }}
      >
        {fraseApoio}
      </p>

      <Medidor
        realizadoCentavos={realizadoDespesasCentavos}
        previstoCentavos={previstoDespesasCentavos}
        fraseEstado={fraseMedidor}
      />
    </section>
  );
}
