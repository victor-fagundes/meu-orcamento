'use client'
import type { BlocoSaldoProps } from '../../base/contratos.ts';
import { estadoDoSaldo, textoDoSaldo } from '../../modulos/logica.ts';
import { Icone } from '../icone.tsx';
import { Medidor } from '../medidor.tsx';

export function BlocoSaldo({ rotulo, valorCentavos, percentualUsado, fraseApoio, ocultado, onAlternarOcultar }: BlocoSaldoProps) {
  const valor = ocultado ? 'R$ •••••' : valorCentavos === null ? '—' : textoDoSaldo(valorCentavos, false);
  return (
    <section className="mo-bloco-saldo" aria-labelledby="mo-bloco-saldo-rotulo">
      <div className="mo-bloco-saldo__topo">
        <span id="mo-bloco-saldo-rotulo" className="mo-bloco-saldo__rotulo">{rotulo}</span>
        <button
          type="button"
          className="mo-bloco-saldo__ocultar"
          aria-pressed={ocultado}
          aria-label={ocultado ? 'Mostrar valores' : 'Ocultar valores'}
          onClick={onAlternarOcultar}
        >
          <Icone nome={ocultado ? 'visibility_off' : 'visibility'} tamanho={20} />
        </button>
      </div>
      <p className="mo-bloco-saldo__valor">{valor}</p>
      {percentualUsado === null ? (
        fraseApoio ? <p className="mo-bloco-saldo__apoio">{fraseApoio}</p> : null
      ) : (
        <Medidor rotulo={rotulo} valor={percentualUsado} estado={estadoDoSaldo(percentualUsado)} frase={fraseApoio} />
      )}
    </section>
  );
}
