# Data Model: Categorias

## Categoria

Tabela `categorias`. Uma linha por agrupamento dentro de um tipo, num orçamento.

| Campo | Regra |
|---|---|
| `id` | Texto, chave primária. `crypto.randomUUID()`, como em `itens`. |
| `orcamento_id` | Obrigatório. Referência a `orcamentos`, cascade. Toda query leva o id da sessão. |
| `tipo` | `R`, `F`, `V` ou `E`. Check no banco. Na leitura: Receitas, Despesas fixas, Despesas variáveis, Anuais. |
| `nome` | Texto obrigatório, já sem espaços nas pontas. Nome novo: 1 a 40 caracteres, sem `\n` nem `\r`. O backfill pode guardar um nome antigo mais longo. |
| `arquivada` | Booleano, padrão false. Índice único ignora as arquivadas. |
| `created_at`, `updated_at` | Preenchidos pelo banco, no mesmo padrão de `itens`. |

Índice único parcial: `(orcamento_id, tipo, lower(nome))` onde `arquivada = false`.

A chave do domínio é outra camada: minúsculas e sem acento. Ela não é coluna. A transação lê as categorias ativas daquele tipo e recusa a chave repetida antes de gravar.

## Item

`itens` não ganha coluna.

| Campo | Papel nesta história |
|---|---|
| `grupo` | Continua texto e passa a ser o `nome` da categoria daquele `tipo`. |
| `arquivado` | Inteiro. 0 ativo, 1 arquivado. Arquivar a categoria põe 1 em todos os itens daquele grupo e tipo. |
| `plano_centavos_json` | Doze inteiros. Entra na pergunta “há plano diferente de zero”. Não muda de forma. |

Escrita de `grupo`: ao terminar, existe categoria ativa com aquele tipo e aquele nome neste orçamento. Item novo sem essa categoria cria as duas linhas na mesma transação.

## Lançamento

`lancamentos.item_id` permanece. Renomear categoria não altera lançamento. Arquivar categoria não apaga lançamento. Competência de parcela não muda.

## Backfill

Para cada `(orcamento_id, tipo, lower(grupo))` distinto em `itens`:

- Nasce uma categoria.
- `arquivada` é true só quando nenhum item daquele grupo e tipo está com `arquivado = 0`.
- Se houver duas grafias que só diferem na caixa, os itens passam para um único `grupo` (o que ainda tem item ativo; senão o primeiro em `pt-BR`) e nasce uma categoria só.

O backfill é idempotente: não insere de novo um par que já tem categoria ativa com a mesma chave `lower(nome)`.

## Estado da categoria

```text
(não existe) --criar / item novo / backfill--> ativa
ativa --renomear para outro nome único--> ativa (itens do tipo acompanham o nome)
ativa --renomear para o mesmo nome--> ativa (no-op)
ativa --arquivar--> arquivada (itens do grupo ficam arquivados)
arquivada --criar o mesmo nome--> ativa nova (a arquivada continua)
```

Não há transição de volta para ativa. Não há ordem persistida.

## Limite de alerta

`limites_alerta` permanece. `global_pct` e cada valor em `cats_json` só são gravados se forem inteiros de 1 a 100. Gravação recusada não dá `UPDATE`.

Ao renomear, a chave de `cats_json` igual ao nome antigo passa a ser o nome novo, na mesma transação. Arquivar não remove a chave.

## Exportação

Não há tabela nova. Há movimento quando existe lançamento da conta ou algum inteiro de `plano_centavos_json` diferente de zero. Sem movimento, nenhum arquivo. Com movimento, o documento continua o da história 017: itens, cartões e lançamentos, valores em centavos inteiros, só da conta da sessão.
