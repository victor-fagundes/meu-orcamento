# `@meu-orcamento/design-system`

Pacote multiplataforma compartilhado entre **Web (Next.js + React)** e **App Mobile (React Native + Expo)** para o projeto **Meu Orçamento**.

## Estrutura do Pacote

```text
packages/design-system/
├── assets/fonts/            # Fonte Manrope (Regular, Medium, SemiBold, Bold)
├── src/
│   ├── core/                # Fonte única de verdade (tokens, CSS, ícones SVG, formatadores, tipos)
│   ├── base/                # Componentes primitivos (.web.tsx e .native.tsx)
│   ├── modulos/             # Módulos de negócio reutilizáveis (.web.tsx e .native.tsx)
│   ├── index.ts             # Entry-point tipado padrão (aponta para contratos multiplataforma)
│   ├── index.web.ts         # Entry-point Web
│   └── index.native.ts      # Entry-point React Native / Expo
├── tests/                   # Testes automatizados Vitest (contraste WCAG 2.2 AA e formatadores)
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

## Configuração no Next.js (`next.config.ts`)

Para garantir que o Next.js resolva prioritariamente `.web.tsx` e `.web.ts` e transpile o pacote do monorepo sem conflito com arquivos `.native.tsx`:

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@meu-orcamento/design-system'],
  webpack: (config) => {
    config.resolve.extensions = [
      '.web.tsx',
      '.web.ts',
      '.web.js',
      ...config.resolve.extensions,
    ];
    return config;
  },
  turbopack: {
    resolveExtensions: [
      '.web.tsx',
      '.web.ts',
      '.web.js',
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
      '.json',
    ],
  },
};

export default nextConfig;
```

Importe os tokens CSS no layout raiz (`app/layout.tsx`):

```tsx
import '@meu-orcamento/design-system/tokens.css';
import { ThemeProvider } from '@meu-orcamento/design-system';
```

## Configuração no Expo (`metro.config.js`)

Para o Metro Bundler priorizar `.native.tsx` e `.native.ts` no iOS/Android e resolver pacotes do monorepo:

```js
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [monorepoRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

config.resolver.sourceExts = [
  'native.tsx',
  'native.ts',
  'native.js',
  ...config.resolver.sourceExts,
];

config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = config;
```

## Carregamento da Fonte Manrope no Expo

```tsx
import { useFonts } from 'expo-font';
import { ThemeProvider } from '@meu-orcamento/design-system';

export function AppRoot({ children }: { children: React.ReactNode }) {
  const [loaded] = useFonts({
    'Manrope-Regular': require('@meu-orcamento/design-system/assets/fonts/Manrope-Regular.ttf'),
    'Manrope-Medium': require('@meu-orcamento/design-system/assets/fonts/Manrope-Medium.ttf'),
    'Manrope-SemiBold': require('@meu-orcamento/design-system/assets/fonts/Manrope-SemiBold.ttf'),
    'Manrope-Bold': require('@meu-orcamento/design-system/assets/fonts/Manrope-Bold.ttf'),
  });

  if (!loaded) return null;
  return <ThemeProvider initialMode="system">{children}</ThemeProvider>;
}
```
