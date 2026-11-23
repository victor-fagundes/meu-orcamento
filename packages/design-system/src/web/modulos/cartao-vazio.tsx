'use client'
import type { CartaoVazioProps } from '../../base/contratos.ts';
import { Botao } from '../botao.tsx';

export function CartaoVazio({ titulo, frase, acao }: CartaoVazioProps) {
  return (
    <section className="mo-cartao-vazio">
      <h2 className="mo-cartao-vazio__titulo">{titulo}</h2>
      <p className="mo-cartao-vazio__frase">{frase}</p>
      {acao ? <Botao variante="primario" onPress={acao.onPress}>{acao.rotulo}</Botao> : null}
    </section>
  );
}
