# Spec: 041 — Categorias

**Status:** `ready`  
**Release:** rebuild-web  
**Sprint:** —  
**Depende de:** — (pode seguir em paralelo com a 040)  
**PRD:** 5.9, 5.10, D-07  
**Branch:** `rebuild-web`

## Context

Hoje a categoria é só o texto `itens.grupo`. O PRD v1.0 (5.9, D-07) deixava renomear fora desta versão. O rebuild pede categoria como entidade, com criar, renomear e arquivar. Esta spec faz essa mudança no domínio, no banco, na API e nas server actions. As telas que usam isso são a 044 e a 047.

`itens.grupo` continua texto, como chave de junção por nome. Lançamento aponta para o item, não para o grupo.

O domínio já tem `validateGlobalPct` em `src/domain/alertas.ts`, e essa função aperta o valor para o intervalo 1–100 em vez de recusar. A tela de limites (047) precisa de erro e do valor salvo intacto, então a validação passa a recusar.

Os rótulos visíveis do mês e do ano ainda são "Ainda pode gastar" (`src/components/resumo-dashboard.tsx`) e "Saldo final (R − despesas)" (`src/components/ano-view.tsx`). `docs/design/MICROCOPY.md` troca esses nomes por "Disponível neste mês" e "Sobra no ano", e manda não usar "Saldo" nem "ainda pode gastar". O cálculo não muda: mês = orçado − gasto; ano = receitas − despesas (`src/domain/reconciliacao.ts`). Esta spec não troca a UI. Os rótulos novos entram nas specs 043 e 046.

Na interface o agrupamento se chama categoria. `grupo` fica só no código, como chave em `itens.grupo`. O glossário não lista as quatro frases de nome; elas seguem o padrão de erro do mesmo arquivo (o que aconteceu e o que fazer) e ficam fechadas nesta spec.

## Goals

1. Criar, listar, renomear e arquivar categorias por orçamento e tipo.
2. Preencher a tabela a partir dos grupos que já existem.
3. Exigir categoria ativa em toda escrita de `itens.grupo`.
4. Recusar limite de alerta fora de 1–100 inteiro.
5. Expor as duas frases de exportação pedidas pelo prompt, sem mudar o arquivo quando há movimento.

## Non-goals

- Tela de Orçamento ou de Ajustes (044 e 047).
- Reordenar categorias ou itens.
- Desarquivar.
- Mudar `src/domain/competencia.ts`, `src/lib/auth*`, `src/app/api/auth/**` ou a regra de parcelas.
- Apagar lançamento ao arquivar categoria ou item.

## Domain rules

Tabela `categorias`: `id` (text, pk), `orcamento_id` (fk, cascade), `tipo` (`R|F|V|E`, check), `nome` (text, not null), `arquivada` (boolean, default false), `criado_em`, `atualizado_em`. Índice único de `(orcamento_id, tipo, lower(nome))` onde `arquivada = false`.

Backfill na mesma migration: para cada `(orcamento_id, tipo, grupo)` distinto em `itens`, uma linha. `arquivada` é true só quando todos os itens daquele grupo estão arquivados (`itens.arquivado` diferente de 0).

| Caso | Entrada | Resultado |
|---|---|---|
| Nome vazio | `""` | erro: "Informe o nome da categoria." |
| Só espaços | `"   "` | erro: "Informe o nome da categoria." |
| 41 caracteres após o trim | 41 caracteres | erro: "Use no máximo 40 caracteres." |
| Quebra de linha | `"Lazer\n"` | erro: "Use o nome em uma linha só." |
| Nome válido | `"  Lazer  "` | `"Lazer"` |
| Duplicado no tipo | `"Lazer"` e `"lazer"`, ou `"Ação"` e `"acao"`, ativos | erro: "Escolha outro nome. Já existe uma categoria com esse nome neste tipo." |
| Duplicado entre tipos | `"Outros"` em F e em V | permitido |
| Renomear para o mesmo nome | mesmo id e mesmo nome | no-op, sem erro |
| Outro orçamento | id de categoria ou item de outra conta | não encontrado. A API responde 404, nunca 403 |
| Renomear | nome novo único | na mesma transação: `categorias.nome` e `itens.grupo` do tipo, onde `grupo` era o nome antigo. Lançamentos não mudam |
| Arquivar | categoria ativa | na mesma transação: `arquivada = true` e `itens.arquivado` em todos os itens do grupo. Lançamentos ficam |
| Novo item com grupo novo | `grupo` sem categoria ativa daquele tipo | a categoria nasce na mesma transação do item |
| Novo item com grupo ativo | categoria ativa do tipo | não duplica a categoria |
| Limite | inteiro de 1 a 100 | aceito |
| Limite | 0, 101, fração ou não numérico | erro. O valor salvo não muda |
| Exportação sem movimento | orçamento sem lançamento e sem plano diferente de zero | a ação devolve "Não havia movimento para exportar." e não entrega arquivo |
| Exportação incompleta | falha no meio da geração | "Arquivo incompleto não é compartilhado." e nenhum arquivo parcial |
| Exportação com movimento | há lançamento ou plano | CSV e JSON como na spec 017, centavos inteiros, só a conta da sessão |

Comparação de nome: sem diferença de caixa e sem acento.

## Acceptance criteria

- [ ] AC-1 A migration cria `categorias`, o índice único parcial e o backfill descrito na tabela. `itens.grupo` permanece texto.
- [ ] AC-2 `src/domain/categorias.ts` cobre os casos de nome da tabela, com teste em `src/domain/categorias.test.ts`. Sem import de Next, DB ou React.
- [ ] AC-3 `listarCategorias`, `criarCategoria`, `renomearCategoria` e `arquivarCategoria` em `src/application/categorias.ts` filtram pelo `orcamento_id` da sessão e seguem a tabela.
- [ ] AC-4 `criarItem` cria a categoria na mesma transação quando o grupo ainda não é uma categoria ativa daquele tipo.
- [ ] AC-5 `GET /api/v1/categorias?incluirArquivadas=0|1`, `POST /api/v1/categorias` `{ tipo, nome }`, `PATCH /api/v1/categorias/[id]` `{ nome }` e `POST /api/v1/categorias/[id]/arquivar` respondem com `jsonError` (`src/lib/api-v1.ts`). O corpo é validado com zod.
- [ ] AC-6 Dois usuários no PGlite: um não lê nem altera a categoria do outro, e a resposta é 404.
- [ ] AC-7 `src/app/actions/categorias.ts` repete os casos de uso e chama `revalidatePath` de `/app/orcamento` e `/app/ajustes`.
- [ ] AC-8 `validateGlobalPct` deixa de apertar o valor. Fora de 1–100 inteiro, a função recusa e `saveLimites` não grava.
- [ ] AC-9 As ações `exportCsvAction` e `exportJsonAction` devolvem as duas frases da tabela nos casos sem movimento e incompleto. Com movimento, o arquivo continua o da spec 017.
- [ ] AC-10 `saldoPeriodo` e `saldoFinalAno` em `src/domain/reconciliacao.ts` não mudam de fórmula. `src/domain/competencia.ts` não muda.
- [ ] AC-11 Nenhum `console.log`, `any` ou TODO novo. Dinheiro segue inteiro, em centavos.

## Test plan

Unit: `src/domain/categorias.test.ts` e o teste de limite em `src/domain/alertas.test.ts`.  
Integração: rotas `/api/v1/categorias` com PGlite e dois usuários, em arquivo `src/**/*.test.ts`.  
`npm test` e `npx tsc --noEmit` verdes.

## Open questions

Nenhuma. D-07 fica substituída para categoria neste rebuild: criar, renomear e arquivar entram; reordenar continua fora.
