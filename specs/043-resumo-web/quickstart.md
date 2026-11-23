# Quickstart: Resumo web

Validação depois da implementação. A spec está `ready`. Isto não substitui o Vitest nem o Playwright.

## Pré-requisitos

- Branch `rebuild-web`
- `npm test` e `npx tsc --noEmit` verdes
- App em `http://localhost:3000`
- Conta demo local: `demo@local.test` / `demo1234`

## Teste automático

```bash
npm test -- src/domain/resumo-semana.test.ts src/components/casca-abas.test.ts
npx playwright test e2e/resumo.spec.ts
npx tsc --noEmit
```

`resumo-semana.test.ts` cobre o saldo de R$ 600,00, o negativo, o percentual cortado, os dias, o traço do pagamento, as cinco semanas, fevereiro com quatro, a média de R$ 10,00 e de R$ 1,00, e o mês vazio.

`casca-abas.test.ts` passa a esperar `pedeMes` verdadeiro só em Resumo.

O Playwright entra com a conta demo, no claro e no escuro. Confere o rótulo, os quatro nomes, a ausência de banner e de intervalo de datas, filtra um pagamento, limpa, oculta, abre o sininho e abre um cartão no Orçamento. A captura final vai para `tests/visual/out/`. Os casos de `contracts/resumo.md` ficam verdes antes do smoke.

## 1. Disponível e cartões

1. Entrar com a conta demo e abrir `/app/resumo`.
2. Esperado: um bloco "Disponível neste mês". Cabeçalho com "Mês anterior" e "Próximo mês". A página não repete essas setas.
3. Esperado: Receitas, Fixas, Variáveis e Anuais, nesta ordem, cada um com "de R$ … planejados" ou "—" se um pagamento estiver escolhido.
4. Ativar Fixas.
5. Esperado: `/app/orcamento` do mesmo mês com `tipo=F`.

## 2. Filtro e limpar

1. Voltar ao Resumo e escolher um pagamento que não seja Todas.
2. Esperado: disponível "—" e planejado dos cartões "—".
3. Acionar "Limpar filtros".
4. Esperado: pagamento, tipo e categoria em Todas. O mês não muda.

## 3. Ocultar

1. Acionar "Ocultar valores".
2. Esperado: o controle se chama "Mostrar valores" e está pressionado. O disponível, os cartões e o gráfico mostram "R$ •••••".
3. Recarregar a página.
4. Esperado: continua oculto. "Mostrar valores" devolve os números.

## 4. Semana e sininho

1. Com os valores à vista, ler o gráfico.
2. Esperado: Semana 1 em diante, com valor em texto, e a média diária.
3. Abrir "Ver detalhes" de uma semana e fechar.
4. Esperado: o foco volta a esse controle.
5. Abrir o sininho.
6. Esperado: ou a lista de alertas do mês, ou "Nenhum alerta neste mês." Não há banner acima do disponível.

## 5. Largura e tema

1. Em 390 px o valor principal usa o tamanho médio. Em 1280 px usa o tamanho grande. Os cartões ficam em duas colunas.
2. Trocar para escuro.
3. Esperado: o bloco, os cartões, o gráfico e o sininho continuam legíveis.
4. Não há seletor de data inicial e final, nem botão flutuante.
