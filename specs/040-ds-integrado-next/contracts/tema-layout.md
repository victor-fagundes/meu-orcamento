# Contract: Tema e layout

Referência: [data-model.md](../data-model.md) e AC-1 a AC-6 da spec.

## Fonte

| Peça | Contrato |
| --- | --- |
| Arquivo | `packages/design-system/fonts/Manrope-VariableFont_wght.ttf` |
| API | `next/font/local` em `src/app/layout.tsx` |
| Peso | 200–800 |
| Variável | `--font-manrope` no `<html>` |
| `--font-family` | `var(--font-manrope), "Segoe UI", sans-serif` no CSS gerado |
| Roboto | Sai do layout. Não se redefine `--font-roboto` |
| `@font-face` | Não sai de `buildCss()` e não usa caminho relativo |

Se o build não resolver o arquivo do pacote, a mesma fonte vai para `public/fonts/` e o `next/font` aponta para essa cópia.

## Script de tema

Roda no `<head>`, antes da primeira pintura. `<html>` tem `suppressHydrationWarning`.

- Lê `mo-tema`.
- `dark` → `data-theme="dark"`.
- `light` → `data-theme="light"`.
- `system`, vazio ou outro valor → `dark` se `prefers-color-scheme: dark`, senão `light`.
- Não grava `localStorage`.

## ThemeProvider

| Operação | Efeito |
| --- | --- |
| Montar | Lê `mo-tema` depois da pintura e alinha o modo. Não troca o `data-theme` que o script já pôs para outro valor |
| `definirModo('light' \| 'dark' \| 'system')` | Grava a chave e atualiza `data-theme` com o tema resolvido |
| Modo `system` | Ouve `prefers-color-scheme` e atualiza `data-theme` |

Expõe o modo guardado (`light`, `dark` ou `system`) e o tema resolvido (`light` ou `dark`). Fora do provider, `useTema` lança erro, como hoje.

## CSS no layout

Uma importação de `@meu-orcamento/design-system/tokens.css`. Uma de `@meu-orcamento/design-system/web.css`. `globals.css` e `material-theme.css` continuam importados por onde já estão. Não se removem nesta história.

## App Router

Cada arquivo em `packages/design-system/src/web/` que usa estado, efeito, evento ou `window` começa com `'use client'`. O pacote entra em `transpilePackages`. A raiz depende dele por `file:./packages/design-system`.

## Fora deste contrato

Seletor de tema na tela de Ajustes (história posterior). Apagar `@material/web`. Trocar a fonte das telas atuais além da saída do Roboto no layout.
