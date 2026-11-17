# Quickstart: Orçamento no Android

```text
npx vitest run src/domain/resumo-mes.test.ts
```

A frase de um grupo conhecido precisa ser a mesma do computador. A spec precisa estar `ready`. Casca 030 e Resumo 031 no aparelho.

1. Em despesas fixas, o que ainda cabe e cada grupo batem com o computador no mesmo mês.
2. Um grupo zerado só aparece em "Sem movimento neste mês".
3. Avançar o mês conserva o tipo.
4. Abrir Aluguel, mudar o valor, salvar. O grupo muda. Cancelar uma segunda vez não muda.
5. "Arquivar Aluguel" e "Confirmar arquivar Aluguel" tiram Aluguel da lista ativa. O lançamento antigo continua em Lançamentos.
6. A barra perto do limite não é o amarelo da marca.
