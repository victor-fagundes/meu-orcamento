import React, { createContext, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { darkColors, lightColors, type ResolvedTheme, type ThemeMode } from '../core/tokens';
import type { ThemeContextValue, ThemeProviderProps } from '../core/types';

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children, initialMode = 'system' }: ThemeProviderProps): React.JSX.Element {
  const [mode, setMode] = useState<ThemeMode>(initialMode);
  const scheme = useColorScheme();
  const systemTheme: ResolvedTheme = scheme === 'dark' ? 'dark' : 'light';
  const resolvedTheme: ResolvedTheme = mode === 'system' ? systemTheme : mode;

  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      resolvedTheme,
      colors: resolvedTheme === 'dark' ? darkColors : lightColors,
      setMode,
    }),
    [mode, resolvedTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return {
      mode: 'light',
      resolvedTheme: 'light',
      colors: lightColors,
      setMode: () => {},
    };
  }
  return ctx;
}
