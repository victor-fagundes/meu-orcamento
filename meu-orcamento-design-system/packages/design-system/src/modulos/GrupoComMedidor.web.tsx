import React, { useState } from 'react';
import { Medidor } from '../base/Medidor.web';
import { formatarBRL } from '../core/formatters';
import { grid, radius, spacing, typography } from '../core/tokens';
import type { GrupoComMedidorProps } from '../core/types';
import { LinhaItem } from './LinhaItem.web';

export function GrupoComMedidor({
  titulo,
  tipo,
  previstoCentavos,
  realizadoCentavos,
  fraseEstado,
  itens,
  expandidoInicial = true,
  onSelecionarItem,
}: GrupoComMedidorProps): React.JSX.Element {
  const [expandido, setExpandido] = useState(expandidoInicial);
  const titleStyle = typography.scale.titleMd;
  const valorStyle = typography.scale.valorTabular;

  return (
    <section
      aria-label={titulo}
      style={{
        backgroundColor: 'var(--md-surface)',
        border: '1px solid var(--md-border)',
        borderRadius: radius.lg,
        overflow: 'hidden',
      }}
    >
      <button
        type="button"
        onClick={() => setExpandido((prev) => !prev)}
        aria-expanded={expandido}
        style={{
          width: '100%',
          minHeight: grid.touchTargetMin,
          padding: spacing.lg,
          border: 'none',
          backgroundColor: 'transparent',
          display: 'flex',
          flexDirection: 'column',
          gap: spacing.md,
          textAlign: 'left',
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: spacing.md,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--md-font-family)',
              fontSize: titleStyle.fontSize,
              lineHeight: `${titleStyle.lineHeight}px`,
              fontWeight: Number(titleStyle.fontWeight),
              color: 'var(--md-text-primary)',
            }}
          >
            {titulo} {expandido ? '▴' : '▾'}
          </span>

          <span
            className="mo-tabular"
            style={{
              fontFamily: 'var(--md-font-family)',
              fontSize: valorStyle.fontSize,
              lineHeight: `${valorStyle.lineHeight}px`,
              fontWeight: Number(valorStyle.fontWeight),
              fontVariantNumeric: 'tabular-nums',
              color: 'var(--md-text-primary)',
            }}
          >
            {formatarBRL(realizadoCentavos)} / {formatarBRL(previstoCentavos)}
          </span>
        </div>

        <Medidor
          realizadoCentavos={realizadoCentavos}
          previstoCentavos={previstoCentavos}
          fraseEstado={fraseEstado}
          status={tipo === 'Receitas' && realizadoCentavos >= previstoCentavos ? 'positivo' : undefined}
        />
      </button>

      {expandido && (
        <div>
          {itens.map((item) => (
            <LinhaItem key={item.id} item={item} onPress={onSelecionarItem} />
          ))}
        </div>
      )}
    </section>
  );
}
