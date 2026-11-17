# Data Model: Um item só no Orçamento

Sem tabela nova. Tudo vive em `itens` e, para o histórico, em `lancamentos.itemId`.

## Item de orçamento

| Campo | Papel nesta história |
|---|---|
| `orcamentoId` | Isola a conta. A correção e a prévia só leem itens desta sessão. |
| `tipo` | R, F, V ou E. No match por nome único, permanece o do item do catálogo. |
| `grupo` | Categoria dentro do tipo. Não é a aba. Grupos proibidos como destino de linha nova: Receitas, Despesas Fixas, Despesas Variáveis, Anuais. |
| `nome` | Identidade de match, via `normalizeHeader` (sem acento, sem diferença de maiúsculas). |
| `planoCentavosJson` | 12 inteiros em centavos, índice 0 = janeiro. |
| `arquivado` | 0 ativo, 1 arquivado. Extra corrigido passa a 1. Não é apagado. |

## Linha de planejamento (prévia, não persistida)

| Campo | Regra |
|---|---|
| `nome` | Texto da planilha. |
| `tipoSugerido` | Tipo da seção, antes do match. |
| `tipo` / `grupo` | Depois do match: os do catálogo, ou Outros do tipo da seção, ou vazio se a pessoa ainda precisa escolher. |
| `plano` / `monthWrite` | Iguais aos da 020. Vazio ou zero literal não apaga. Positivo substitui. Negativo ou ilegível zera o mês. |
| `alvo` | `catalogo` \| `outros` \| `escolher`. |

## Correção da duplicata

Par: um item ativo do catálogo e um ou mais itens ativos de mesmo nome cujo grupo é um dos quatro nomes de aba.

Para cada mês `m`:

- Catálogo já tem centavos `> 0` → esse mês não muda.
- Catálogo está em `0` e algum extra tem centavos `> 0` → o catálogo recebe o maior desses valores.
- Extra não contribui mês `0`.

Depois, cada extra do par fica `arquivado = 1`. `lancamentos` que apontam para o extra não mudam de `itemId`.

Estado seguinte: abrir de novo não acha extra ativo, então o plano do catálogo não é reescrito.

## Grupo na tela

Agregado do mês aberto: soma do plano dos itens ativos e soma do realizado. Não é uma tabela.

Ordem: grupos com plano ou realizado `> 0` primeiro; os dois lados em ordem pt-BR. Grupo zerado continua na lista.

## Seletor de lançamento

Item ativo, com o plano de 12 meses disponível para a escolha inicial. Itens arquivados não entram, como na spec 003.
