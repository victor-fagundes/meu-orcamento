# Quickstart: Revisão pontual do computador

## Pré-requisitos

`npm run dev` e a conta de demonstração, num mês com despesas, um grupo zerado e um grupo perto do limite.

## Teste puro

```text
npx vitest run src/components/resumo-filtro.test.ts
```

Esperado: com PIX filtrado, o saldo do mês permanece e a frase cita o gasto do PIX. O endereço do mês carrega o tipo.

## Roteiro

1. Abrir o Resumo. Os três números aparecem antes da média e dos filtros.
2. Filtrar PIX. Ainda pode gastar continua um valor, e a frase diz quanto foi no PIX.
3. Cada tipo tem o próprio "Ver …". Abrir "Ver despesas variáveis" cai no Orçamento em variáveis.
4. Avançar o mês. Variáveis continuam selecionadas.
5. O cartão mostra o que ainda cabe. O grupo zerado só aparece em "Sem movimento neste mês".
6. A barra perto do limite não é o amarelo do M da marca. Os gráficos de realizado continuam amarelos.

Lançamentos, Ano e Ajustes não mudam neste roteiro. Foco do diálogo e Arquivar são a spec 037.
