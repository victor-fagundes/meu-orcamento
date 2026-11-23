import { formatarBRL, calcularPercentual, estadoConsumo } from '../core/formatters.ts';
import type { Centavos, EstadoConsumo } from '../core/types.ts';

/**
 * Frase de estado de um grupo ou item. Sempre presente: a cor nunca é o único sinal.
 * Regras de ORÇAMENTO e estados da ficha de componentes.
 */
export function fraseDoEstado(realizado: Centavos, planejado: Centavos, limiteAtencao = 80): string {
  const estado: EstadoConsumo = estadoConsumo(realizado, planejado, limiteAtencao);
  switch (estado) {
    case 'sem-plano':
      return 'Sem valor planejado';
    case 'estourou':
      return `Estourou em ${formatarBRL(realizado - planejado)}`;
    case 'no-limite':
      return 'No limite do planejado';
    case 'atencao':
      return `Perto do limite · ${calcularPercentual(realizado, planejado)}%`;
    case 'ok':
      return 'Dentro do planejado';
  }
}

/** Estado do medidor do bloco de saldo a partir do percentual usado. */
export function estadoDoSaldo(percentualUsado: number, limiteAtencao = 80): EstadoConsumo {
  if (percentualUsado > 100) return 'estourou';
  if (percentualUsado === 100) return 'no-limite';
  if (percentualUsado >= limiteAtencao) return 'atencao';
  return 'ok';
}

/** Texto exibido para o saldo, com ou sem ocultação. */
export function textoDoSaldo(valorCentavos: number, ocultado: boolean): string {
  return ocultado ? 'R$ •••••' : formatarBRL(valorCentavos);
}
