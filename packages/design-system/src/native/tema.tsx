import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { Appearance } from 'react-native';
import type { ModoTema } from '../base/contratos.ts';
import { darkColors, lightColors, type ColorToken } from '../core/tokens.ts';

type Paleta = Record<ColorToken, string>;

interface ValorTema {
  readonly modo: ModoTema;
  readonly cores: Paleta;
  readonly definirModo: (modo: ModoTema) => void;
}

const ContextoTema = createContext<ValorTema | null>(null);

export function ThemeProvider({ modoInicial = 'system', children }: { readonly modoInicial?: ModoTema; readonly children: ReactNode }) {
  const [modo, setModo] = useState<ModoTema>(modoInicial);
  const efetivo = modo === 'system' ? (Appearance.getColorScheme() === 'dark' ? 'dark' : 'light') : modo;
  const valor = useMemo<ValorTema>(
    () => ({ modo, cores: efetivo === 'dark' ? darkColors : lightColors, definirModo: setModo }),
    [modo, efetivo],
  );
  return <ContextoTema.Provider value={valor}>{children}</ContextoTema.Provider>;
}

export function useTema(): ValorTema {
  const valor = useContext(ContextoTema);
  if (valor === null) throw new Error('useTema precisa estar dentro de ThemeProvider');
  return valor;
}

/** Paleta do tema atual. Fora do ThemeProvider, usa a clara. */
export function useCores(): Paleta {
  const valor = useContext(ContextoTema);
  return valor?.cores ?? lightColors;
}
