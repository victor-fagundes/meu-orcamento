# Quickstart: Um item só no Orçamento

Validação manual depois da implementação. Não substitui o Vitest do domínio.

## Pré-requisitos

- App em `http://localhost:3000`
- Conta demo: `demo@local.test` / `demo1234`
- A conta ainda tem, em Despesas fixas, grupos zerados (Moradia, Educação, Transporte, Saúde, Outros) e um grupo “Despesas Fixas” com Aluguel em R$ 1.700

## 1. Primeira abertura

1. Entrar e ir em Orçamento → Despesas fixas.
2. Esperado: um Aluguel ativo, em Moradia, com o plano que estava no grupo extra. O grupo “Despesas Fixas” não aparece.
3. Ajustes → itens arquivados: o Aluguel extra está na lista.
4. Recarregar a página. Esperado: o plano de Moradia não dobra e não surge outro arquivado.

## 2. Novo lançamento

1. Abrir Lançamentos → Novo.
2. Esperado: o item inicial do Aluguel é o de Moradia, não um Aluguel em zero.
3. Grupos ainda zerados no mês seguem na aba, abaixo dos que têm valor.

## 3. Importar de novo

1. Em Ajustes, pré-visualizar a aba de planejamento cuja seção “Despesas Fixas” tem Aluguel e uma linha que não existe no catálogo (por exemplo Streaming).
2. Esperado: Aluguel mostra grupo Moradia. Streaming mostra Outros. Luz, se existir na seção e no catálogo como Habitação, mostra Habitação e continua variável.
3. Confirmar. Esperado: não nasce grupo “Despesas Fixas”. Streaming fica em Outros do tipo da seção.
4. Cancelar uma segunda prévia. Esperado: nenhum plano muda.

## Teste automático

```bash
pnpm test -- src/domain/import-planilha.test.ts src/domain/item-unico.test.ts
```

Os casos 1 a 6 de `contracts/plano-alvo.md` e a cópia do maior mês em `contracts/lista-e-seletor.md` precisam estar verdes antes do smoke.
