# Quickstart: Remoção do front antigo

Validação depois da implementação. A spec está `ready`. Isto não substitui as suítes já aceitas.

## Pré-requisitos

- Branch de trabalho `rebuild-web`
- `npm test`, `npx tsc --noEmit`, `npm run build` e `npm run lint` verdes
- App em `http://localhost:3000`
- Conta demo local: `demo@local.test` / `demo1234`

Não criar a conta demo de novo. Não confirmar Sair nela.

## Teste automático

```bash
npm test
npx tsc --noEmit
npm run build
npm run lint
npx playwright test e2e/casca.spec.ts e2e/resumo.spec.ts e2e/orcamento.spec.ts e2e/lancamentos.spec.ts e2e/ano.spec.ts e2e/ajustes.spec.ts e2e/entrada.spec.ts
```

Esses Playwright entram pela conta demo e cobrem o caminho principal de cada área. `e2e/resumo.spec.ts` continua esperando zero elementos `.alert-banner`.

## Busca

Na raiz do repositório:

```bash
git grep -n "md-" -- ":!android" ":!specs" ":!docs"
git grep -n "material" -- ":!android" ":!package-lock.json"
```

A primeira só pode achar `packages/design-system`. A segunda não pode achar import de `@material/web` nem CSS da biblioteca nas telas. Menção em spec ou documento pode aparecer. `android/` fica de fora.

`package.json` não lista `@material/web`. `src/components/material`, `src/types/material-web.d.ts` e `src/app/material-theme.css` não existem.

## 1. As seis áreas

1. Abrir `/login` e entrar com `demo@local.test` / `demo1234`.
2. Esperado: o Resumo abre, com a casca das cinco áreas.
3. Abrir Orçamento, Lançamentos, Ano e Ajustes.
4. Esperado: cada uma abre no endereço atual. O disponível do mês é o mesmo de antes desta história.
5. Repetir uma área no escuro.
6. Esperado: a leitura permanece a da tela já verificada.

## 2. Entrada e a raiz

1. Sair da sessão de teste, ou usar uma janela sem sessão.
2. Abrir `/`.
3. Esperado: `/login`, sem o texto "Comece a planejar o mês em minutos." e sem a casca.
4. Abrir `/login` de novo com a conta demo.
5. Abrir `/`.
6. Esperado: `/app/resumo`.
