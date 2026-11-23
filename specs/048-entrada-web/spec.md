# Spec: 048 — Entrada web

**Status:** `ready`  
**Release:** rebuild-web  
**Sprint:** —  
**Depende de:** 040  
**PRD:** 5.11  
**Branch:** `rebuild-web`

## Context

Entrar, criar conta e recuperar a senha já existem em `/login`, `/cadastro` e `/esqueci-senha`, com Better Auth. Esta spec troca a apresentação para o DS e completa os estados que a tela ainda não trata como fluxo único: link enviado, sessão expirada e sair.

A autenticação em `src/lib/auth*` e `src/app/api/auth/**` não muda. Sessão expirada é um estado da entrada, com banner, não uma regra nova de token.

## Referências visuais e de DS
- Identidade: `docs/identidade-visual/decisoes/DECISOES_identidade_visual.md` (seções aplicáveis: 1 Marca, 5 Layout, 6 Formulários e confirmações, 7 Estados e mensagens)
- Tela de referência: `docs/identidade-visual/telas-web/web-entrar.dc.html`, `web-entrar-erro.dc.html`, `web-criar-conta.dc.html`, `web-esqueci.dc.html`, `web-esqueci-enviado.dc.html`, `web-sessao-expirada.dc.html`, `web-sair.dc.html`
- Componentes do DS usados: `Campo`, `Botao`, `Banner`
- Tokens: apenas os de `packages/design-system/src/core/tokens.ts`

## Critérios de aceite visuais
- AC-V1: hierarquia e textos iguais à tela de referência.
- AC-V2: todos os componentes vêm do DS.
- AC-V3: estados (vazio, erro, carregando) iguais aos da referência.

## Goals

1. Levar login, cadastro, esqueci a senha, link enviado, sessão expirada e sair para o layout do DS.
2. Não revelar qual campo falhou quando a credencial está errada.
3. Exigir senha de no mínimo 8 caracteres no campo.

## Non-goals

- Trocar Better Auth, cookie ou o contrato da API de auth.
- Login social.
- Bearer token para o app nativo (isso é ADR da spec 050).
- Shell das cinco abas: quem não tem sessão não vê o shell da 042.

## Domain rules

| Caso | Entrada | Resultado |
|---|---|---|
| Desktop | Largura ≥ 720 px | Duas colunas: marca à esquerda, formulário à direita |
| Estreito | Largura &lt; 720 px | Uma coluna |
| Login certo | E-mail e senha válidos | Sessão e ida ao Resumo |
| Login errado | Credencial rejeitada | Uma mensagem só. O texto não diz se o e-mail ou a senha é que está errado. Os campos permanecem |
| Cadastro | Nome, e-mail, senha | Senha com menos de 8 caracteres: "Use pelo menos 8 caracteres." no campo senha, e nada é gravado |
| Esqueci a senha | E-mail enviado | A tela de confirmação diz que o link foi enviado. Não revela se o e-mail existe |
| Sessão expirada | Sessão que venceu | A entrada abre com `Banner` de aviso. Não há sessão |
| Sair | Confirmação já feita na 047, ou a ação desta tela quando a sessão cai aqui | A sessão acaba e a entrada volta |

Falha ao salvar mostra "Não foi possível salvar. Os campos continuam preenchidos." (`docs/design/MICROCOPY.md`).

## Acceptance criteria

- [ ] AC-1 `/login`, `/cadastro` e `/esqueci-senha` usam só componentes do DS. Em 1280 px são duas colunas; em 390 px, uma.
- [ ] AC-2 Credencial errada mostra um erro que não aponta o campo. E-mail e senha digitados continuam nos controles.
- [ ] AC-3 Senha com 7 caracteres no cadastro mostra "Use pelo menos 8 caracteres." no campo senha e não cria conta. Com 8, o cadastro segue o fluxo atual.
- [ ] AC-4 Depois do envio em esqueci a senha, a pessoa vê a confirmação de link enviado, sem dizer se aquele e-mail está cadastrado.
- [ ] AC-5 Sessão expirada abre a entrada com `Banner` de aviso e sem sessão.
- [ ] AC-6 Sair encerra a sessão e mostra a entrada.
- [ ] AC-7 A regra de tokens do ESLint passa. Todo campo tem rótulo visível ligado. Foco visível. Light, dark e `prefers-reduced-motion`. Nada de `@material/web`.
- [ ] AC-8 O E2E cobre login com senha errada, cadastro com senha curta e o envio de esqueci a senha até a confirmação. A captura vai para `tests/visual/out/`, sem pixel-diff bloqueante.
- [ ] AC-9 `src/lib/auth*` e `src/app/api/auth/**` não mudam. Nenhum `console.log`, `any` ou TODO novo.

## Test plan

E2E Playwright do AC-8. Os testes de auth já existentes permanecem verdes. Checklist de `packages/design-system/CHECKLIST.md` no PR.

## Open questions

Nenhuma.
