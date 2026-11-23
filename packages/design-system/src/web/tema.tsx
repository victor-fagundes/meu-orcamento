'use client'
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { ModoTema } from '../base/contratos.ts';

export type TemaEfetivo = 'light' | 'dark';

const CHAVE_TEMA = 'mo-tema';

interface ValorTema {
  readonly modo: ModoTema;
  readonly tema: TemaEfetivo;
  readonly definirModo: (modo: ModoTema) => void;
}

const ContextoTema = createContext<ValorTema | null>(null);

function temaDoSistema(): TemaEfetivo {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function lerModoGuardado(): ModoTema {
  if (typeof window === 'undefined') return 'light';
  try {
    const valor = window.localStorage.getItem(CHAVE_TEMA);
    if (valor === 'light' || valor === 'dark' || valor === 'system') return valor;
  } catch {
    /* storage indisponível */
  }
  return 'light';
}

function gravarModo(modo: ModoTema): void {
  try {
    window.localStorage.setItem(CHAVE_TEMA, modo);
  } catch {
    /* storage indisponível */
  }
}

/** Aplica o tema no elemento raiz via data-theme. "system" segue o aparelho. */
export function ThemeProvider({ modoInicial = 'light', children }: { readonly modoInicial?: ModoTema; readonly children: ReactNode }) {
  const [modo, setModo] = useState<ModoTema>(modoInicial);
  const [temaSistema, setTemaSistema] = useState<TemaEfetivo>('light');
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    setModo(lerModoGuardado());
    setTemaSistema(temaDoSistema());
    setPronto(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return undefined;
    const consulta = window.matchMedia('(prefers-color-scheme: dark)');
    const aoMudar = () => setTemaSistema(consulta.matches ? 'dark' : 'light');
    consulta.addEventListener('change', aoMudar);
    return () => consulta.removeEventListener('change', aoMudar);
  }, []);

  const tema: TemaEfetivo = modo === 'system' ? temaSistema : modo;

  useEffect(() => {
    if (!pronto) return;
    document.documentElement.setAttribute('data-theme', tema);
  }, [pronto, tema]);

  const definirModo = useCallback((proximo: ModoTema) => {
    gravarModo(proximo);
    setModo(proximo);
  }, []);

  const valor = useMemo<ValorTema>(() => ({ modo, tema, definirModo }), [modo, tema, definirModo]);
  return <ContextoTema.Provider value={valor}>{children}</ContextoTema.Provider>;
}

export function useTema(): ValorTema {
  const valor = useContext(ContextoTema);
  if (valor === null) throw new Error('useTema precisa estar dentro de ThemeProvider');
  return valor;
}
