# Contract: Front web depois da limpeza

As rotas das histórias 042–048 permanecem. A biblioteca antiga não é instalada nem importada. Estilo novo usa token do DS. `src/domain`, `src/lib/auth.ts`, `src/app/api/**` e `android/` não mudam.

## Rotas

| Endereço | Continua |
|---|---|
| `/app/resumo` | Resumo, dentro da casca |
| `/app/orcamento` | Orçamento, dentro da casca |
| `/app/lancamentos` | Lançamentos, dentro da casca |
| `/app/ano` | Ano, dentro da casca |
| `/app/ajustes` e as páginas já aceitas embaixo dele | Ajustes, dentro da casca |
| `/login`, `/cadastro`, `/esqueci-senha` | Entrada, sem a casca |

Sem sessão, `/app` continua indo para `/login`, com o aviso de sessão expirada só quando a marca já pedia isso. Com sessão, `/login` e `/cadastro` continuam indo para `/app/resumo`.

## `/`

Sem sessão, `/` abre `/login`. Com sessão, `/` abre `/app/resumo`. A vitrine com "Comece a planejar o mês em minutos." não aparece. Não há página nova no lugar.

## Biblioteca antiga

O web não depende de `@material/web`. O layout não carrega o registro dessa biblioteca. Não existem `src/components/material/**`, `src/types/material-web.d.ts` nem `src/app/material-theme.css`.

`globals.css` não guarda classe `.auth-*`, `.home-*`, `.app-nav-*` nem variável do tema antigo. Pode zerar a margem do `body` e pintar fundo e texto com `--md-surface`, `--md-text` e `--font-family`.

Uma busca por `md-` no web só encontra o design system. Uma busca por `material` não encontra import nem CSS dessa biblioteca nas telas. Menção em spec ou documento pode continuar.

## O que a pessoa confere

O disponível do mesmo mês, com os mesmos lançamentos, é o mesmo valor. Claro, escuro e menos movimento permanecem os das telas já verificadas. O app do celular não muda.
