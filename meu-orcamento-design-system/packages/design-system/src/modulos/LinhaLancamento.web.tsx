import React from 'react';
import { formatarBRL, formatarDataBR } from '../core/formatters';
import { grid, radius, spacing, typography } from '../core/tokens';
import type { LinhaLancamentoProps } from '../core/types';

export function LinhaLancamento({
  id,
  descricao,
  valorCentavos,
  tipo,
  dataISO,
  nomeItem,
  meioPagamento,
  faturaMesAno,
  onPress,
}: LinhaLancamentoProps): React.JSX.Element {
  const bodyStyle = typography.scale.bodyMd;
  const valorStyle = typography.scale.valorTabular;
  const smallStyle = typography.scale.bodySm;
  const labelSm = typography.scale.labelSm;

  const sinal = tipo === 'receita' ? '+' : '-';
  const corValor = tipo === 'receita' ? 'var(--md-success)' : 'var(--md-text-primary)';

  return (
    <button
      type="button"
      onClick={onPress ? () => onPress(id) : undefined}
      style={{
        width: '100%',
        minHeight: grid.touchTargetMin,
        paddingBlock: spacing.md,
        paddingInline: spacing.lg,
        border: 'none',
        borderBottom: '1px solid var(--md-border)',
        backgroundColor: 'var(--md-surface)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.md,
        textAlign: 'left',
        cursor: onPress ? 'pointer' : 'default',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.xs }}>
        <span
          style={{
            fontFamily: 'var(--md-font-family)',
            fontSize: bodyStyle.fontSize,
            lineHeight: `${bodyStyle.lineHeight}px`,
            color: 'var(--md-text-primary)',
          }}
        >
          {descricao}
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: spacing.sm }}>
          <span
            style={{
              fontFamily: 'var(--md-font-family)',
              fontSize: smallStyle.fontSize,
              lineHeight: `${smallStyle.lineHeight}px`,
              color: 'var(--md-text-secondary)',
            }}
          >
            {formatarDataBR(dataISO)} • {nomeItem} • {meioPagamento}
          </span>
          {faturaMesAno && (
            <span
              style={{
                paddingInline: spacing.sm,
                paddingBlock: 2,
                borderRadius: radius.xs,
                backgroundColor: 'var(--md-surface-muted)',
                color: 'var(--md-text-secondary)',
                fontFamily: 'var(--md-font-family)',
                fontSize: labelSm.fontSize,
                lineHeight: `${labelSm.lineHeight}px`,
                fontWeight: Number(labelSm.fontWeight),
              }}
            >
              Fatura {faturaMesAno}
            </span>
          )}
        </div>
      </div>

      <span
        className="mo-tabular"
        style={{
          fontFamily: 'var(--md-font-family)',
          fontSize: valorStyle.fontSize,
          lineHeight: `${valorStyle.lineHeight}px`,
          fontWeight: Number(valorStyle.fontWeight),
          fontVariantNumeric: 'tabular-nums',
          color: corValor,
          flexShrink: 0,
        }}
      >
        {sinal} {formatarBRL(Math.abs(valorCentavos))}
      </span>
    </button>
  );
}
