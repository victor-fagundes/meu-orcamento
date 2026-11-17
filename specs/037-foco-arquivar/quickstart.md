# Quickstart: Foco do diálogo e Arquivar no computador

Validação manual no computador, mais um teste puro. Não substitui o PM marcar `verified`.

## Pré-requisitos

- App no ar com `npm run dev`.
- Conta de demonstração com pelo menos dois itens ativos no Orçamento do mês aberto (por exemplo Aluguel e Luz) e um lançamento.
- Teclado. Mouse só para confirmar que o fundo do diálogo fecha.

## Teste puro

```text
npx vitest run src/components/arquivar-rotulo.test.ts
```

Esperado: "Arquivar" no repouso, "Arquivar Aluguel?" armado, nomes anunciados com o item, índice de `2026-11` igual a 10, competência inválida cai em janeiro.

## Roteiro no navegador

1. Entrar e abrir Orçamento num mês conhecido, com um tipo que tenha Aluguel.
2. Clicar Aluguel. O foco está no valor daquele mês. O texto não está selecionado. Digitar não apaga o valor inteiro de uma vez.
3. Escape. O diálogo fecha e o foco volta ao botão de Aluguel.
4. Abrir de novo e clicar no fundo. Não grava.
5. Abrir "Novo item". O foco está no nome, não na categoria. Escape fecha sem criar.
6. Abrir "Novo lançamento" pela barra. O foco está no valor. Escape volta ao botão que abriu.
7. Em Lançamentos, editar um lançamento. O foco está no valor. Cancelar não grava.
8. Abrir alertas. O foco está em Fechar.
9. No Orçamento, acionar Arquivar em Aluguel. O texto visível vira "Arquivar Aluguel?". Acionar Arquivar em Luz. Só Luz fica armada. Aluguel volta a "Arquivar".
10. Confirmar Luz. Luz sai da lista ativa. Um lançamento antigo de Luz, se existir, continua em Lançamentos.
11. Em Resumo, Orçamento, Lançamentos e Ano, o primeiro Tab no topo alcança "Ir para o conteúdo". Acioná-lo leva o foco ao miolo da tela. Ajustes também tem esse destino, na região que já existia.

## Fora deste roteiro

Android, filtros do Resumo, cor da barra de limite e grupos em "Sem movimento" pertencem às specs 029 e 032.
