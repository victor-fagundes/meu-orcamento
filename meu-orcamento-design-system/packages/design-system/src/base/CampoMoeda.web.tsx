import React, { useId, useState } from 'react';
import { formatarBRL, lerBRL } from '../core/formatters';
import { grid, radius, spacing, typography } from '../core/tokens';
import type { CampoMoedaProps } from '../core/types';

export function CampoMoeda({
  id,
  rotulo,
  valorCentavos,
  onChangeCentavos,
  placeholder = 'R$ 0,00',
  erro,
  ajuda,
  obrigatorio = false,
  disabled = false,
  permitirNegativo = false,
}: CampoMoedaProps): React.JSX.Element {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-erro`;
  const helpId = `${inputId}-ajuda`;
  const [focused, setFocused] = useState(false);

  const labelStyle = typography.scale.labelMd;
  const bodyStyle = typography.scale.valorTabular;
  const smallStyle = typography.scale.bodySm;

  const textoFormatado = formatarBRL(valorCentavos);

  const handleChange = (raw: string): void => {
    const ehNegativo = permitirNegativo && raw.includes('-');
    const digitos = raw.replace(/\D/g, '');
    const novoCentavos = digitos === '' ? 0 : lerBRL(digitos);
    onChangeCentavos(ehNegativo && novoCentavos > 0 ? -novoCentavos : novoCentavos);
  };

  const borderColor = erro
    ? 'var(--md-error)'
    : focused
      ? 'var(--md-action)'
      : 'var(--md-border-strong)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs, width: '100%' }}>
      <label
        htmlFor={inputId}
        style={{
          fontFamily: 'var(--md-font-family)',
          fontSize: labelStyle.fontSize,
          lineHeight: `${labelStyle.lineHeight}px`,
          fontWeight: Number(labelStyle.fontWeight),
          color: 'var(--md-text-primary)',
        }}
      >
        {rotulo}
        {obrigatorio ? ' *' : ''}
      </label>
      <input
        id={inputId}
        type="text"
        inputMode="numeric"
        value={textoFormatado}
        placeholder={placeholder}
        disabled={disabled}
        required={obrigatorio}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? errorId : ajuda ? helpId : undefined}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => handleChange(e.target.value)}
        className="mo-tabular"
        style={{
          height: grid.touchTargetMin,
          minHeight: grid.touchTargetMin,
          paddingInline: spacing.md,
          borderRadius: radius.sm,
          borderStyle: 'solid',
          borderWidth: focused || erro ? 2 : 1,
          borderColor,
          backgroundColor: disabled ? 'var(--md-surface-muted)' : 'var(--md-surface)',
          color: 'var(--md-text-primary)',
          fontFamily: 'var(--md-font-family)',
          fontSize: bodyStyle.fontSize,
          lineHeight: `${bodyStyle.lineHeight}px`,
          fontWeight: Number(bodyStyle.fontWeight),
          fontVariantNumeric: 'tabular-nums',
          outline: 'none',
          width: '100%',
          boxSizing: 'border-box',
        }}
      />
      {erro ? (
        <span
          id={errorId}
          role="alert"
          style={{
            fontFamily: 'var(--md-font-family)',
            fontSize: smallStyle.fontSize,
            lineHeight: `${smallStyle.lineHeight}px`,
            color: 'var(--md-error)',
          }}
        >
          {erro}
        </span>
      ) : (
        ajuda && (
          <span
            id={helpId}
            style={{
              fontFamily: 'var(--md-font-family)',
              fontSize: smallStyle.fontSize,
              lineHeight: `${smallStyle.lineHeight}px`,
              color: 'var(--md-text-secondary)',
            }}
          >
            {ajuda}
          </span>
        )
      )}
    </div>
  );
}
