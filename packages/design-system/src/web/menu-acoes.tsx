'use client'
import { useEffect, useRef, useState } from 'react';
import type { AcaoMenu, MenuAcoesProps } from '../base/contratos.ts';
import { Dialogo } from './dialogo.tsx';
import { Icone } from './icone.tsx';

export function MenuAcoes({ rotulo, acoes }: MenuAcoesProps) {
  const [aberto, setAberto] = useState(false);
  const [pendente, setPendente] = useState<AcaoMenu | null>(null);
  const gatilho = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!aberto) return undefined;
    const aoTecla = (evento: KeyboardEvent) => {
      if (evento.key !== 'Escape') return;
      setAberto(false);
      gatilho.current?.focus();
    };
    window.addEventListener('keydown', aoTecla);
    return () => window.removeEventListener('keydown', aoTecla);
  }, [aberto]);

  const escolher = (acao: AcaoMenu) => {
    if (acao.destrutivo) {
      setPendente(acao);
      setAberto(false);
      return;
    }
    acao.onEscolher();
    setAberto(false);
  };

  const tituloPendente = pendente?.rotulo ?? '';

  return (
    <div className="mo-menu-acoes">
      <button
        ref={gatilho}
        type="button"
        className="mo-botao-icone"
        aria-label={rotulo}
        aria-expanded={aberto}
        aria-haspopup="menu"
        onClick={() => setAberto((valor) => !valor)}
      >
        <Icone nome="more_vert" />
      </button>
      {aberto ? (
        <ul className="mo-menu-acoes__lista" role="menu">
          {acoes.map((acao) => (
            <li key={acao.id} role="none">
              <button type="button" role="menuitem" onClick={() => escolher(acao)}>
                {acao.rotulo}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
      <Dialogo
        aberto={pendente !== null}
        titulo={tituloPendente}
        descricao={tituloPendente}
        textoConfirmar={tituloPendente}
        tipoConfirmar="destrutivo"
        textoCancelar="Cancelar"
        onCancelar={() => setPendente(null)}
        onConfirmar={() => {
          pendente?.onEscolher();
          setPendente(null);
        }}
      />
    </div>
  );
}
