import React from 'react';
import { formatarBRL } from '../core/formatters';
import { radius, spacing, typography } from '../core/tokens';
import type { TabelaMesesProps } from '../core/types';

const NOMES_MESES: readonly string[] = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
];

export function TabelaMeses({
  ano,
  mesAtivo,
  linhas,
  onSelecionarMes,
}: TabelaMesesProps): React.JSX.Element {
  const labelStyle = typography.scale.labelSm;
  const valorStyle = typography.scale.valorTabular;

  return (
    <div
      style={{
        width: '100%',
        overflowX: 'auto',
        backgroundColor: 'var(--md-surface)',
        border: '1px solid var(--md-border)',
        borderRadius: radius.lg,
      }}
    >
      <table
        aria-label={`Consolidado anual ${ano}`}
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontFamily: 'var(--md-font-family)',
        }}
      >
        <thead>
          <tr style={{ borderBottom: '1px solid var(--md-border)' }}>
            <th
              scope="col"
              style={{
                position: 'sticky',
                left: 0,
                backgroundColor: 'var(--md-surface)',
                padding: spacing.md,
                textAlign: 'left',
                fontSize: labelStyle.fontSize,
                fontWeight: Number(labelStyle.fontWeight),
                color: 'var(--md-text-secondary)',
              }}
            >
              Grupo / Linha ({ano})
            </th>
            {NOMES_MESES.map((mesNome, idx) => {
              const mesNumero = idx + 1;
              const ativo = mesNumero === mesAtivo;
              return (
                <th
                  key={mesNome}
                  scope="col"
                  style={{
                    padding: spacing.md,
                    textAlign: 'right',
                    backgroundColor: ativo ? 'var(--md-selected)' : 'transparent',
                    color: ativo ? 'var(--md-on-selected)' : 'var(--md-text-secondary)',
                    fontSize: labelStyle.fontSize,
                    fontWeight: Number(labelStyle.fontWeight),
                  }}
                >
                  {onSelecionarMes ? (
                    <button
                      type="button"
                      onClick={() => onSelecionarMes(mesNumero)}
                      style={{
                        border: 'none',
                        backgroundColor: 'transparent',
                        color: 'inherit',
                        font: 'inherit',
                        cursor: 'pointer',
                      }}
                    >
                      {mesNome}
                    </button>
                  ) : (
                    mesNome
                  )}
                </th>
              );
            })}
            <th
              scope="col"
              style={{
                padding: spacing.md,
                textAlign: 'right',
                fontSize: labelStyle.fontSize,
                fontWeight: Number(labelStyle.fontWeight),
                color: 'var(--md-text-primary)',
              }}
            >
              Total Ano
            </th>
          </tr>
        </thead>
        <tbody>
          {linhas.map((linha) => {
            const ehSobra = linha.tipo === 'sobra';
            const ehSubtotal = linha.tipo === 'subtotal';
            const destaqueLinha = ehSobra || ehSubtotal;

            return (
              <tr
                key={linha.id}
                style={{
                  borderTop: ehSobra ? '2px solid var(--md-border-strong)' : '1px solid var(--md-border)',
                  backgroundColor: ehSobra ? 'var(--md-surface-muted)' : 'transparent',
                }}
              >
                <th
                  scope="row"
                  style={{
                    position: 'sticky',
                    left: 0,
                    backgroundColor: ehSobra ? 'var(--md-surface-muted)' : 'var(--md-surface)',
                    padding: spacing.md,
                    textAlign: 'left',
                    fontSize: valorStyle.fontSize,
                    fontWeight: destaqueLinha ? 700 : 500,
                    color: 'var(--md-text-primary)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {linha.rotulo}
                </th>
                {linha.valoresCentavos.map((valor, idx) => {
                  const ativo = idx + 1 === mesAtivo;
                  const corValor =
                    ehSobra && valor < 0
                      ? 'var(--md-error)'
                      : ehSobra && valor > 0
                        ? 'var(--md-success)'
                        : ativo
                          ? 'var(--md-on-selected)'
                          : 'var(--md-text-primary)';
                  return (
                    <td
                      key={`${linha.id}-${idx}`}
                      className="mo-tabular"
                      style={{
                        padding: spacing.md,
                        textAlign: 'right',
                        fontSize: valorStyle.fontSize,
                        fontWeight: destaqueLinha ? 700 : 400,
                        fontVariantNumeric: 'tabular-nums',
                        backgroundColor: ativo ? 'var(--md-selected)' : 'transparent',
                        color: corValor,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {formatarBRL(valor, { omitirSimbolo: true })}
                    </td>
                  );
                })}
                <td
                  className="mo-tabular"
                  style={{
                    padding: spacing.md,
                    textAlign: 'right',
                    fontSize: valorStyle.fontSize,
                    fontWeight: 700,
                    fontVariantNumeric: 'tabular-nums',
                    color:
                      ehSobra && linha.totalAnoCentavos < 0
                        ? 'var(--md-error)'
                        : ehSobra && linha.totalAnoCentavos > 0
                          ? 'var(--md-success)'
                          : 'var(--md-text-primary)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {formatarBRL(linha.totalAnoCentavos)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
