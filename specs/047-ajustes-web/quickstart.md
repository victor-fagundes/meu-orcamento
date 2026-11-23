# Quickstart: Ajustes web

Validação depois da implementação. A spec precisa estar `ready` antes do código. Isto não substitui o Vitest nem o Playwright.

## Pré-requisitos

- Branch `047-ajustes-web`
- `npm test` e `npx tsc --noEmit` verdes
- App em `http://localhost:3000`
- Conta demo local: `demo@local.test` / `demo1234`

Não excluir a conta demo no smoke. Não confirmar Sair nela, salvo num teste que entre de novo depois.

## Teste automático

```bash
npm test -- src/domain/cartoes.test.ts src/domain/iniciais.test.ts src/domain/exclusao-conta.test.ts
npx playwright test e2e/ajustes.spec.ts e2e/casca.spec.ts e2e/orcamento.spec.ts e2e/resumo.spec.ts
npx tsc --noEmit
```

`cartoes.test.ts` cobre fechamento 28 aceito, fechamento 29 recusado, vencimento 31 aceito, vencimento 32 recusado e dia vazio. A linha do cartão cobre "Fecha dia 2 · vence dia 9" e o aviso sem fechamento.

`iniciais.test.ts` cobre Victor Fagundes → VF e um nome só → a primeira letra.

`exclusao-conta.test.ts` cobre `EXCLUIR`, espaços nas pontas, `excluir`, `Excluir` e vazio. Só a primeira confirma.

O Playwright entra com a conta demo, no claro e no escuro. Confere o menu sem Importar e sem Simulador, cancela Sair da conta, abre o formulário de cartão com vencimento 32 e não grava. A captura final vai para `tests/visual/out/`. Os casos de `contracts/ajustes.md` ficam verdes antes do smoke.

`casca.spec.ts` não procura mais um Sair na casca. `orcamento.spec.ts` espera Despesas fixas em `/app/ajustes/categorias?tipo=F`, com os outros tipos na página. `resumo.spec.ts` semeia o exemplo em `/app/ajustes/exemplo` e espera "Exemplo aplicado:".

## 1. Menu e conta

1. Entrar com a conta demo e abrir `/app/ajustes`.
2. Esperado: a página é Categorias e itens. O menu mostra os dois grupos, Excluir conta isolado e Sair da conta. Não há Importar planilha, Importar fatura nem Simulador de competência. A aba Ajustes é a única marcada.
3. Abrir Conta. Escolher Escuro e recarregar.
4. Esperado: Escuro continua marcado. Escolher Sistema não grava Escuro no lugar.
5. Abrir Sair da conta e cancelar.
6. Esperado: a sessão continua e o foco volta a Sair da conta. A casca não tem outro Sair.

## 2. Categorias e cartões

1. Em Categorias, criar "  Lazer  " em Despesas variáveis.
2. Esperado: a linha é Lazer, com "0 itens". O formulário fechou e o foco está nessa linha.
3. Criar "lazer" de novo.
4. Esperado: "Escolha outro nome. Já existe uma categoria com esse nome neste tipo." O formulário continua aberto e nada novo aparece.
5. Em 390 px, voltar ao menu, abrir Cartões e adicionar um cartão sem apelido.
6. Esperado: "Informe o apelido do cartão." e o formulário aberto. Não há botão flutuante.

## 3. Limite, exportação e exemplo

1. Em Limites de alerta, com o valor salvo em 80, tentar salvar 150.
2. Esperado: "Fora de 1 a 100. O valor salvo foi mantido." Reabrir a página mostra 80. Não há limite por categoria.
3. Em Exportar, ler Exportar CSV e Exportar JSON. Se a conta não tiver movimento, o botão mostra "Não havia movimento para exportar." e nenhum arquivo baixa.
4. Em Dados de exemplo, tocar Carregar exemplo uma vez e sair da página.
5. Esperado: o plano não mudou. Voltar e confirmar. A mensagem começa com "Exemplo aplicado:" e diz que nenhum lançamento foi criado.
