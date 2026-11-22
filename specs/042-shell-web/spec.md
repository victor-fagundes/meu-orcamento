# Spec: 042 — Shell da aplicação

**Status:** `ready`  
**Release:** rebuild-web  
**Sprint:** —  
**Depende de:** 040  
**PRD:** 5.1, 7  
**Branch:** `rebuild-web`

## Context

As cinco áreas do produto são Resumo, Orçamento, Lançamentos, Ano e Ajustes. No computador a navegação é lateral; abaixo de 720 px, inferior. As rotas atuais permanecem: `/app/resumo`, `/app/orcamento`, `/app/lancamentos`, `/app/ano`, `/app/ajustes`.

O shell usa `ShellApp` e `NavegacaoPrincipal` da spec 040. As medidas vêm de `docs/design/GRID.md`: lateral de 240 a partir de 720, barra inferior de 76 abaixo disso, conteúdo de no máximo 960, 12 colunas, margem 40 e espaço 24. Não há botão flutuante no web: o `Fab` do DS já não renderiza nada nessa plataforma, e `docs/design/COMPONENTES.md` reserva o FAB ao celular. A ação de criar fica no topo do conteúdo de cada tela.

## Goals

1. Entregar a casca logada: cabeçalho, navegação e área de conteúdo.
2. Manter a aba certa, inclusive nas subtelas de Ajustes.
3. Reservar o lugar do mês (‹ ›) no cabeçalho quando a tela pedir.

## Non-goals

- O miolo de Resumo, Orçamento, Lançamentos, Ano, Ajustes ou Entrada (043–048).
- FAB, no web.
- Barra inferior nativa do Android.

## Domain rules

| Situação | Resultado |
|---|---|
| Largura ≥ 720 px | Barra lateral de 240, cinco abas, ícone e rótulo |
| Largura &lt; 720 px | Barra inferior, altura 76, as mesmas cinco abas |
| Aba da rota | `aria-current="page"` só na aba da rota |
| Subtela de Ajustes | A aba Ajustes continua a ativa |
| Conteúdo | Largura máxima 960, 12 colunas, margem 40, espaço 24, pelos tokens `grid` |
| Criar | Botão no topo da área, nunca flutuante |
| Mês | O cabeçalho mostra ‹ › só quando a tela declara navegação de mês |

Medidas vêm dos tokens da spec 040. Estilo novo não usa hexadecimal, `px`, `rem` ou `dp` literal.

## Acceptance criteria

- [ ] AC-1 Com sessão, as cinco rotas renderizam dentro de `ShellApp`. Sem sessão, o shell logado não aparece.
- [ ] AC-2 Em 1280 px a barra lateral tem as cinco abas, ícone e rótulo, e a aba da rota tem `aria-current="page"`.
- [ ] AC-3 Em 390 px a barra lateral some e a barra inferior mostra as mesmas cinco abas.
- [ ] AC-4 Em qualquer subtela de Ajustes, a aba Ajustes permanece a ativa.
- [ ] AC-5 A área de conteúdo respeita largura máxima, colunas, margem e espaço do token `grid`.
- [ ] AC-6 Não há FAB nem ação de criar flutuante. O cabeçalho aceita título e, quando a tela pede, a navegação de mês.
- [ ] AC-7 A regra de tokens do ESLint passa em `src/app` e `src/components`. A tela nova não importa `@material/web`.
- [ ] AC-8 Todo controle tem nome acessível. O foco é visível. Light, dark e `prefers-reduced-motion` (transição zerada) funcionam.
- [ ] AC-9 O E2E troca as cinco abas no desktop e no estreito. A captura final vai para `tests/visual/out/`, sem pixel-diff bloqueante.
- [ ] AC-10 Nenhum `console.log`, `any` ou TODO novo.

## Test plan

E2E Playwright: entrar, percorrer as cinco rotas em 1280 px e em 390 px, abrir uma subtela de Ajustes e ver Ajustes ativa.  
`npm run lint`, `npm test`, `npx tsc --noEmit`.

## Open questions

Nenhuma.
