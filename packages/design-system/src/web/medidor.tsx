import type { MedidorProps } from '../base/contratos.ts';
import { larguraDaBarra, tokenDoEstado } from '../base/estado.ts';

export function Medidor({ rotulo, valor, estado, frase }: MedidorProps) {
  const largura = larguraDaBarra(valor);
  const cor = `var(--md-${tokenDoEstado[estado].replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)})`;
  return (
    <div className="mo-medidor">
      <div className="mo-medidor__cabecalho">
        <span>{rotulo}</span>
      </div>
      <div
        className="mo-medidor__trilha"
        role="progressbar"
        aria-label={rotulo}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={largura}
      >
        <div className="mo-medidor__barra" style={{ width: `${largura}%`, background: cor }} />
      </div>
      <span className="mo-medidor__frase" style={{ color: cor }}>{frase}</span>
    </div>
  );
}
