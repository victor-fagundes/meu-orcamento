# Quickstart: Ano web

Validação depois da implementação. A spec está `ready`. Isto não substitui o Vitest nem o Playwright.

## Pré-requisitos

- Branch `046-ano-web`
- `npm test` e `npx tsc --noEmit` verdes
- App em `http://localhost:3000`
- Conta demo local: `demo@local.test` / `demo1234`

## Teste automático

```bash
npm test -- src/domain/ano-grade.test.ts src/domain/reconciliacao.test.ts
npm test --prefix packages/design-system -- tests/modulos/tabela-meses.test.ts tests/web/modulos-2.test.tsx
npx playwright test e2e/ano.spec.ts
npx tsc --noEmit
```

`ano-grade.test.ts` cobre a sobra de R$ 5.000,00 menos R$ 2.400,00, o plano igual em dois anos, o arquivado, a ordem, o vazio e o mês atual só no ano de hoje. A competência entra como texto já gravado: junho para o cartão de 26/05/2026 e janeiro de 2027 para o de 26/12/2026. Os três meses de R$ 100,00 em 3× somam 10000 centavos.

`reconciliacao.test.ts` continua verde. `saldoFinalAno` não muda.

`tabela-meses.test.ts` cobre "6.500", "—", "0", "−0", "−40", o Total "6" para doze meses de 50 centavos e a máscara "•••••".

O Playwright entra com a conta demo, no claro e no escuro. Abre o Ano, confere "Sobra no ano (receitas − despesas)", troca para Planejado e aciona "Próximo ano". A captura final vai para `tests/visual/out/`. Os casos de `contracts/ano.md` ficam verdes antes do smoke.

## 1. Grade e sobra

1. Entrar com a conta demo e abrir `/app/ano`.
2. Esperado: o cabeçalho da casca diz "Ano" e não tem "Mês anterior". O conteúdo diz "Ano · realizado", "Ano anterior", "Próximo ano" e a frase "Valores em R$.".
3. Esperado: a última linha é "Sobra no ano (receitas − despesas)". Não há "Saldo final" nem "Total despesas".
4. Marcar Planejado.
5. Esperado: o título passa a "Ano · planejado" e a legenda a "Planejado de {ano}". O ano ao lado das setas não muda.

## 2. Troca de ano

1. Anotar um número do Planejado.
2. Acionar "Próximo ano" e esperar a resposta.
3. Esperado: o ano ao lado das setas muda. O mesmo número do Planejado continua. O Realizado desse ano novo só mostra lançamento da competência dele.
4. Esperado: em ano que não é o de hoje, nenhuma coluna diz "mês atual".

## 3. Ocultar e estreito

1. No Resumo, ocultar os valores. Voltar ao Ano.
2. Esperado: onde havia número, "•••••". O "—" continua "—". Não há um segundo controle de ocultar.
3. Em 390 px, rolar a grade até Dez e Total.
4. Esperado: não há botão flutuante. Em 1280 px também não há.
