# Data Model: Ajustes web

Não há tabela nova, coluna nova nem migração. Tudo é filtrado pelo `orcamentoId` da sessão. O tema não é coluna.

## Conta e tema

| Dado | Onde | Regra |
|---|---|---|
| Nome e e-mail | Sessão já gravada | Só leitura nesta história |
| Iniciais | Derivadas do nome | Primeira letra do primeiro nome e primeira letra do último, em maiúsculas. Um nome só usa a primeira letra |
| Tema | `localStorage` `mo-tema` | `light`, `dark` ou `system`. Ausente ou desconhecido vale `system`. `system` acompanha o aparelho e não grava `light` nem `dark` |

A exclusão apaga a linha do usuário. O que já depende dela em cascata sai junto: sessão, orçamento, itens, categorias, cartões, lançamentos e limites. Não há prazo de retenção.

## Categoria

Sem coluna nova. Ativa entra na aba Categorias. Arquivada sai dessa aba.

| Campo de tela | Regra |
|---|---|
| Tipo | R, F, V, E, nesta ordem, com os rótulos Receitas, Despesas fixas, Despesas variáveis, Anuais |
| Nome | A regra já entregue: trim, uma linha, no máximo 40, único entre as ativas do mesmo tipo, sem acento e sem caixa. Arquivada não bloqueia. O mesmo nome em outro tipo é outro registro |
| Itens | Contagem dos itens ativos com o mesmo tipo e o mesmo nome. "1 item"; qualquer outro número, inclusive 0, "{n} itens" |
| Arquivar | A categoria e os itens daquele tipo e daquele nome passam a arquivados. Lançamento não muda de item |

`?tipo=` marca um tipo. Não apaga os outros da tela.

## Item arquivado

O item arquivado já existe. A coluna Lançamentos é derivada: "Histórico mantido" se houver lançamento daquele item; "Nenhum lançamento" se não houver. A ordem é o nome do item em português. Não há transição de volta para ativo nesta história.

## Cartão

A coluna `dia_vencimento` já é inteiro opcional. A mudança é a validação, não o schema.

| Campo | Regra |
|---|---|
| Apelido | Obrigatório. Trim, espaços internos únicos, no máximo 60. Não precisa ser único |
| Fechamento | Vazio ou inteiro de 1 a 28 |
| Vencimento | Vazio ou inteiro de 1 a 31 |
| Instituição | Opcional. Trim e no máximo 80 |
| Últimos 4 | Vazio ou exatamente quatro dígitos |
| Ativo | Novo cartão nasce ativo. Desativar grava inativo. Não há apagar nem reativar |

Editar atualiza apelido, dias, instituição e últimos 4. Não altera `ativo` e não altera lançamento. A competência já gravada permanece.

Texto da linha ativa:

| Dias gravados | Texto |
|---|---|
| Fechamento e vencimento | "Fecha dia {n} · vence dia {m}" |
| Só fechamento | "Fecha dia {n}" |
| Sem fechamento | "Sem dia de fechamento, a competência é o mês da compra." |
| Sem fechamento e com vencimento | A frase acima, mais " · vence dia {m}" |

Inativo não usa esse texto. Mostra o apelido e "não aparece em novos lançamentos".

## Limite

`global_pct` continua o inteiro de 1 a 100. Esta história só o atualiza. `cats_json` não é lido na página e não é escrito pelo salvar desta página. O cálculo do alerta continua usando o global e o que já estiver em `cats_json`.

## Exportação e exemplo

Não há coluna nova. Há movimento quando existe lançamento ou algum mês de algum plano é diferente de zero. O arquivo continua o CSV ou o JSON que a exportação já monta, em centavos, só daquele orçamento.

O exemplo escreve os doze centavos do plano nos itens cuja chave `tipo|grupo|nome` ainda está em `EXAMPLE_PLANS_BRL`. Não cria item e não cria lançamento. Item renomeado ou criado pela pessoa não entra. Item arquivado com a chave original entra.

## Frase de exclusão

Não é coluna. Depois do trim das pontas, o texto tem de ser exatamente `EXCLUIR`. `excluir`, `Excluir`, `EXCLUIR agora` e vazio não confirmam.
