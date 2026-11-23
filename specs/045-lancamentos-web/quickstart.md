# Quickstart: Lançamentos web

Validação depois da implementação. A spec está `ready`. Isto não substitui o Vitest nem o Playwright.

## Pré-requisitos

- Branch `045-lancamentos-web`
- `npm test` e `npx tsc --noEmit` verdes
- App em `http://localhost:3000`
- Conta demo local: `demo@local.test` / `demo1234`
- Um cartão ativo com fechamento no dia 25

## Teste automático

```bash
npm test -- src/domain/lancamentos-lista.test.ts src/domain/lancamentos.test.ts src/domain/edit-lancamento.test.ts src/domain/delete-lancamento.test.ts src/components/casca-abas.test.ts
npx playwright test e2e/lancamentos.spec.ts
npx tsc --noEmit
```

`lancamentos-lista.test.ts` cobre a busca com acento, o filtro combinado, "Parcela 2 de 6 · restam 4", o selo "Fatura 06/2026" e a prévia de R$ 100,00 em 3×.

`lancamentos.test.ts`, `edit-lancamento.test.ts` e `delete-lancamento.test.ts` continuam verdes sem mudança de regra.

`casca-abas.test.ts` passa a esperar `pedeMes` verdadeiro em Resumo, Orçamento e Lançamentos.

O Playwright entra com a conta demo, no claro e no escuro. Registra um à vista, registra um parcelado, edita só uma parcela e desfaz uma exclusão. A captura final vai para `tests/visual/out/`. Os casos de `contracts/lancamentos.md` ficam verdes antes do smoke.

## 1. Mês e tabela

1. Entrar com a conta demo e abrir `/app/lancamentos`.
2. Esperado: cabeçalho com "Mês anterior" e "Próximo mês". A página não repete essas setas. A tabela tem Data, Descrição, Item, Pagamento e Valor.
3. Buscar `uber99`.
4. Esperado: `Nenhum resultado para "uber99"` e "Limpar busca". O mês não muda.

## 2. À vista e parcelado

1. Registrar um débito de R$ 186,40 com descrição vazia e item Supermercado, se a conta tiver esse item. Senão, usar o primeiro item ativo.
2. Esperado: o painel fecha, o foco volta a "Registrar" e "Lançamento salvo." aparece sem desfazer. A descrição gravada é o nome do item.
3. Registrar R$ 100,00 em 26/05/2026 no cartão de fechamento 25, em 3×.
4. Esperado: a prévia mostra R$ 33,34, R$ 33,33 e R$ 33,33. Junho, julho e agosto têm uma linha cada, com a data 26/05/2026.

## 3. Editar, excluir e desfazer

1. Abrir uma parcela que não seja a última e salvar outro valor em "Só esta parcela".
2. Esperado: o painel fecha. Se a linha continua no mês, o foco volta para ela. As outras parcelas do grupo não mudam.
3. Excluir essa linha, ou "Esta e as próximas" se for grupo.
4. Esperado: o painel fecha e o foco vai para "Registrar".
5. Acionar "Desfazer" antes de 10 segundos.
6. Esperado: as mesmas linhas voltam na lista e o painel não reabre.

## 4. Ocultar, vazio e largura

1. No Resumo, acionar "Ocultar valores" e voltar a Lançamentos.
2. Esperado: a coluna Valor mostra "R$ •••••". Abrir a linha mostra o valor.
3. Abrir um mês sem lançamento, se a conta tiver um.
4. Esperado: "Nenhum lançamento em {mês}" e "Registrar lançamento".
5. Em 1280 px o painel usa a largura de 460 px do pacote. Em 390 px ele cabe na largura do conteúdo.
6. Trocar para escuro. Não há intervalo de datas nem botão flutuante.
