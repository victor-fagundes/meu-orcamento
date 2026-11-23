# Contract: Categorias

Sessão obrigatória, pelo mesmo caminho de `requireApiSession` e `requireSessionOrcamento`. Sem sessão a API responde 401 “Não autenticado”. O `orcamentoId` vem da sessão. O cliente não o envia.

As frases de nome saem do domínio. A rota não reescreve o texto.

## Listar

`GET /api/v1/categorias?incluirArquivadas=0|1`

Ausente vale `0`. Outro valor responde 400.

Resposta 200:

```json
{ "categorias": [{ "id": "…", "tipo": "V", "nome": "Lazer", "arquivada": false }] }
```

Só o orçamento da sessão. Com `0`, só `arquivada: false`. Ordem: R, F, V, E e, dentro do tipo, nome em `pt-BR`.

## Criar

`POST /api/v1/categorias`

```json
{ "tipo": "V", "nome": "  Lazer  " }
```

201:

```json
{ "id": "…", "tipo": "V", "nome": "Lazer", "arquivada": false }
```

| Entrada | Status | Corpo |
|---|---|---|
| JSON inválido | 400 | “JSON inválido” |
| `tipo` fora de R, F, V, E | 400 | “Tipo inválido.” |
| vazio ou só espaços | 400 | “Informe o nome da categoria.” |
| 41 caracteres depois do trim | 400 | “Use no máximo 40 caracteres.” |
| contém quebra de linha | 400 | “Use o nome em uma linha só.” |
| chave já ativa no mesmo tipo | 400 | “Escolha outro nome. Já existe uma categoria com esse nome neste tipo.” |
| mesmo nome em outro tipo | 201 | a nova linha |
| mesmo nome de uma arquivada, sem ativa | 201 | ativa nova; a arquivada permanece |

## Renomear

`PATCH /api/v1/categorias/{id}`

```json
{ "nome": "Casa" }
```

200 devolve a categoria. O mesmo nome é 200 e não escreve. Nome inválido ou chave ocupada usa a mesma tabela do criar, em 400. Id ausente neste orçamento é 404 “Categoria não encontrada.” Itens do mesmo tipo cujo `grupo` era o nome antigo passam ao nome novo. Itens de outro tipo não mudam. Lançamentos não mudam. A chave de limite daquele nome, se existir, acompanha o nome novo.

## Arquivar

`POST /api/v1/categorias/{id}/arquivar`

200:

```json
{ "id": "…", "arquivada": true }
```

A categoria e todos os itens daquele grupo e tipo ficam arquivados. Lançamentos permanecem. Id de outra conta ou inexistente: 404 “Categoria não encontrada.” Não há rota de desarquivar nem de reordenar.

## Item novo

`POST /api/v1/itens` permanece. O `grupo` passa pela mesma regra de nome. Se não houver categoria ativa daquele tipo com essa chave, ela nasce na mesma transação do item. Se já houver, o item usa a existente. Falha na regra de nome devolve 400 com a frase da categoria e não grava item.

A action `criarItemAction` repete esse resultado.

## Server actions

`src/app/actions/categorias.ts` expõe listar, criar, renomear e arquivar com o mesmo resultado da aplicação. Sucesso chama `revalidatePath` de `/app/orcamento` e `/app/ajustes`. Nenhuma página nova.

## Isolamento

Dois orçamentos no mesmo teste: o segundo não recebe a categoria do primeiro na lista, e renomear ou arquivar o id do primeiro responde 404. O corpo não diz que a categoria existe.
