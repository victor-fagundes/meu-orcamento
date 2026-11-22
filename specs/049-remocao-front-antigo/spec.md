# Spec: 049 — Remoção do front antigo

**Status:** `ready`  
**Release:** rebuild-web  
**Sprint:** —  
**Depende de:** 043, 044, 045, 046, 047 e 048 `verified` pelo PM  
**PRD:** 7  
**Branch:** `rebuild-web`

**Gate:** o status `ready` aceita este texto. A remoção só começa depois que 043–048 estiverem `verified`. Não marcar `verified` nesta spec: isso é do PM.

## Context

As telas novas passam a ser a única interface web. `@material/web`, o tema Material e os componentes antigos deixam de ter uso. A pasta `android/` e o Material 3 do aparelho ficam para a spec 057. Esta spec só limpa o web.

## Goals

1. Tirar `@material/web` e o CSS antigo do app web.
2. Confirmar que as telas 043–048 seguem de pé sem essa dependência.
3. Deixar o repositório web sem o tema Material das telas antigas.

## Non-goals

- Apagar `android/` ou o Material 3 do aparelho (057).
- Apagar specs antigas.
- Mudar domínio, banco, auth ou a API v1.
- Começar esta remoção antes do `verified` das telas.

## Domain rules

| Busca | Resultado esperado no web |
|---|---|
| `git grep "md-"` | Só ocorrência que pertença ao design system |
| `git grep "material"` | Só o que for do DS, ou menção histórica em spec/doc que não carrega a biblioteca |
| Dependência | `@material/web` sai do `package.json` |
| Arquivos | Saem `src/types/material-web.d.ts`, `src/app/material-theme.css`, `src/components/material/**` e o CSS antigo de `src/app/globals.css` |
| Telas | Resumo, Orçamento, Lançamentos, Ano, Ajustes e Entrada continuam nas rotas atuais, só com o DS |

Nenhuma regra de centavos, competência ou categoria muda nesta spec.

## Acceptance criteria

- [ ] AC-1 043–048 estão `verified` pelo PM antes do primeiro commit desta spec.
- [ ] AC-2 `@material/web` não está em `package.json` nem em `package-lock.json`. O app não importa o pacote.
- [ ] AC-3 `src/types/material-web.d.ts`, `src/app/material-theme.css` e `src/components/material/**` não existem. `globals.css` não guarda o tema antigo; o que sobrar são imports dos tokens do DS, se ainda forem necessários.
- [ ] AC-4 `git grep "md-"` no web só encontra o design system. `git grep "material"` não encontra import nem CSS de Material 3 nas telas.
- [ ] AC-5 `npm test`, `npx tsc --noEmit`, `npm run build`, `npm run lint` e os E2E de 043–048 passam.
- [ ] AC-6 A regra de tokens continua passando em `src/app` e `src/components`.
- [ ] AC-7 Nenhum `console.log`, `any` ou TODO novo. A pasta `android/` não é alterada.

## Test plan

`npm test`, `npx tsc --noEmit`, `npm run build`, `npm run lint` e a suíte E2E das telas 043–048.  
Busca `git grep` dos AC-4 registrada no PR.

## Open questions

Nenhuma. O gate é o `verified` do PM nas specs 043–048.
