# Quickstart: Shell da aplicação

Validação depois da implementação. A spec está `ready`. Isto não substitui o Vitest nem o Playwright.

## Pré-requisitos

- Branch `rebuild-web`
- `npm test` e `npx tsc --noEmit` verdes
- App em `http://localhost:3000`
- Conta demo local: `demo@local.test` / `demo1234`

## Teste automático

```bash
npm test -- src/components/casca-abas.test.ts
npx playwright test e2e/casca.spec.ts
npx tsc --noEmit
```

`casca-abas.test.ts` cobre a ordem, o prefixo `/app/ajustes/conta`, a query `?mes=` que não troca a aba, e `pedeMes` falso nas cinco.

O Playwright entra com a conta demo, percorre as cinco áreas em 1280 px e em 390 px, mede a barra, abre o endereço de uma tela sob Ajustes (ou `/app/ajustes` se a subtela ainda não existir) e confirma uma aba só. Também olha 720 px e 719 px. Os casos de `contracts/casca.md` ficam verdes antes do smoke.

## 1. Cinco áreas

1. Entrar com a conta demo.
2. Esperado: cabeçalho, cinco nomes nesta ordem (Resumo, Orçamento, Lançamentos, Ano, Ajustes) e uma área aberta.
3. Escolher cada área.
4. Esperado: o endereço é o que a pessoa já usa, e só essa aba está marcada.

## 2. Largura

1. Em 1280 px e em 720 px, a navegação é a lateral de 240 px. A inferior não está.
2. Em 719 px e em 390 px, a lateral não está. A inferior tem 76 px e os mesmos cinco nomes.
3. Com Orçamento aberto, estreitar de 1280 px para 390 px.
4. Esperado: continua Orçamento, e só a barra inferior.

## 3. Ajustes

1. Abrir `/app/ajustes`.
2. Esperado: Ajustes é a única aba marcada. Continuam cinco abas.
3. Repetir em 390 px.

## 4. Mês, criar e sair

1. Nas cinco áreas, em 1280 px e em 390 px.
2. Esperado: título da área, nenhum “Mês anterior”, nenhum “Próximo mês”, nenhum botão flutuante.
3. “Sair” encerra e abre `/login`. Sem sessão, `/app/resumo` não mostra a casca.

## 5. Grade e teclado

1. Em 1280 px, o miolo das colunas não passa de 960 px e a margem lateral é 40 px.
2. Em 390 px, a margem lateral é 16 px e o fim do conteúdo fica visível acima da barra.
3. Tab até as cinco áreas, no claro e no escuro. O foco é visível e cada controle tem nome.
4. Com preferência de menos movimento, a troca de área não anima.
