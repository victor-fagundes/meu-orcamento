# @meu-orcamento/design-system · guia de uso

Pacote de tokens, formatadores e componentes do Meu Orçamento. Os textos de produto estão em `docs/design/`: `COMPONENTES.md`, `MODULOS.md`, `MICROCOPY.md`, `GRID.md`, `TOKENS.md`, `ICONES.md`, `TEMA-ESCURO.md` e `IMPLEMENTACAO.md`.

## Instalação
```bash
npm install
npm test          # contraste WCAG, formatadores e sincronia do CSS
npm run typecheck # TypeScript estrito
npm run gen:css   # regenera src/core/tokens.css a partir de tokens.ts
```

## Uso dos tokens
```ts
import { lightColors, spacing, radius, formatarBRL, lerBRL } from '@meu-orcamento/design-system';

const estilo = { backgroundColor: lightColors.action, padding: spacing[4], borderRadius: radius.lg };
formatarBRL(18640); // "R$ 186,40"
lerBRL('186,40');   // 18640
```

Na web, importe o CSS gerado: `import '@meu-orcamento/design-system/tokens.css';` e use `var(--md-action)`.

## Next.js (web)
O pacote é TypeScript puro e não precisa de transpilação especial. Em `next.config.ts`:
```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@meu-orcamento/design-system'],
};

export default nextConfig;
```
Quando os componentes `.web.tsx` existirem, o Next resolve `browser`/`default` automaticamente.

## Expo (React Native)
O campo `react-native` do `package.json` aponta para o mesmo ponto de entrada nesta versão. Em `metro.config.js`:
```js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = ['react-native', 'require', 'default'];
config.watchFolders = [...config.watchFolders, '../../packages'];

module.exports = config;
```
Quando houver `.native.tsx` e `.web.tsx`, o Metro escolhe `.native.tsx` por extensão de plataforma, sem alterar o `package.json`.

## Regras
- Dinheiro é sempre inteiro em centavos. Use `lerBRL` na entrada e `formatarBRL` na saída.
- Não escreva hexadecimal nem medida fora de `tokens.ts`. Valor novo entra primeiro em `tokens.ts` e depois no CSS, via `npm run gen:css`.
- `tokens.css` não se edita à mão: o teste `tokens-sync` falha se divergir.

## Componentes base (v0.2)
Disponíveis em duas entradas, escolhidas automaticamente pelo bundler:
- **Web** (`browser` / `default`): `src/web.ts`. Importe o CSS base uma vez no layout raiz:
  ```ts
  import '@meu-orcamento/design-system/tokens.css';
  import '@meu-orcamento/design-system/web.css';
  ```
- **React Native** (`react-native`): `src/native.ts`. Usa as cores de `lightColors`; o tema escuro entra com o `ThemeProvider` numa versão seguinte.

Componentes nesta versão (todos com contrato único e versões web e React Native): `Icone`, `Botao`, `Campo`, `CampoMoeda`, `Select`, `Chips`, `Checkbox`, `Medidor`, `Banner`, `Snackbar`, `Skeleton`, `EstadoErro`, `Dialogo`, `Fab`, `FormularioContainer`, `NavegacaoPrincipal`, `ThemeProvider` e `useTema`/`useCores`. O `Fab` não renderiza nada no web, por decisão de produto.

Módulos nesta versão (`src/web/modulos` e `src/native/modulos`): `CabecalhoTela`, `BlocoSaldo`, `GradeTotais`, `GrupoComMedidor`, `LinhaLancamento`, `CartaoVazio`, `LinhaItem`, `LinhaAjuste`, `RodapeAcoes` e `CabecalhoSheet`. `TabelaMeses` é só web, como em `MODULOS.md`. O módulo de formulário é a composição de `Campo`, `CampoMoeda` e `Select` dentro de `FormularioContainer`, com `RodapeAcoes` no fim.

## Checklist de revisão de tela
A checklist completa está em `CHECKLIST.md`, nesta mesma pasta. Ela é obrigatória no PR de cada tela.
