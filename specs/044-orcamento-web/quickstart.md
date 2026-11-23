# Quickstart: Orçamento web

Validação depois da implementação. A spec está `ready`. Isto não substitui o Vitest nem o Playwright.

## Pré-requisitos

- Branch `044-orcamento-web`
- `npm test` e `npx tsc --noEmit` verdes
- App em `http://localhost:3000`
- Conta demo local: `demo@local.test` / `demo1234`

## Teste automático

```bash
npm test -- src/domain/plano.test.ts src/domain/orcamento-lista.test.ts src/components/casca-abas.test.ts
npx playwright test e2e/orcamento.spec.ts
npx tsc --noEmit
```

`plano.test.ts` cobre janeiro sem cópia, a cópia do mês aberto, o interruptor até dezembro, os doze meses, o ano anterior intacto, e as três frases de valor inválido.

`orcamento-lista.test.ts` cobre a ordem com valor primeiro, a frase com limite da categoria, o total sem centavos e "E mais 1 alerta." / "E mais 2 alertas."

`casca-abas.test.ts` passa a esperar `pedeMes` verdadeiro em Resumo e em Orçamento, e a troca de mês conservando `tipo` e `aberta`.

O Playwright entra com a conta demo, no claro e no escuro. Confere Fixas, uma categoria fechada, cria categoria e item, grava o plano, arquiva pelo nome e abre Gerenciar. A captura final vai para `tests/visual/out/`. Os casos de `contracts/orcamento.md` ficam verdes antes do smoke.

## 1. Tipo e frase

1. Entrar com a conta demo e abrir `/app/orcamento`.
2. Esperado: cabeçalho com "Mês anterior" e "Próximo mês". A página não repete essas setas. Fixas marcada. Categorias fechadas, com frase visível.
3. Abrir duas categorias.
4. Esperado: as duas continuam abertas.
5. Ir ao mês seguinte e voltar.
6. Esperado: o mesmo tipo e as mesmas categorias abertas.

## 2. Criar, plano e arquivar

1. Criar uma categoria e um item nela.
2. Esperado: a categoria do item abre e o item aparece. Não há renomear nem arquivar categoria.
3. Abrir o item, gravar R$ 400,00 com o interruptor desligado.
4. Esperado: o painel fecha e o foco volta ao item.
5. Abrir de novo e acionar "Copiar ano anterior".
6. Esperado: "Não há plano do ano anterior para copiar." O painel continua aberto.
7. Arquivar o item.
8. Esperado: o título traz o nome. Cancelar deixa o item na lista. Confirmar tira o item da lista.

## 3. Ocultar e vazio

1. No Resumo, acionar "Ocultar valores" e voltar ao Orçamento.
2. Esperado: o total e as cifras da lista mostram "R$ •••••". A frase continua legível. Abrir o plano mostra o valor.
3. Abrir um tipo sem item, se a conta tiver um.
4. Esperado: "Nenhum item neste tipo" e "Novo item".

## 4. Gerenciar, largura e tema

1. Em Fixas, acionar "Gerenciar".
2. Esperado: `/app/ajustes/categorias?tipo=F`.
3. Em 1280 px o painel do plano usa a largura de 460 px do pacote. Em 390 px ele cabe na largura do conteúdo.
4. Trocar para escuro. Não há intervalo de datas nem botão flutuante.
