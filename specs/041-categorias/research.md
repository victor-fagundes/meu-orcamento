# Research: Categorias

## 1. Onde a categoria vive hoje

**Decision**: Nova tabela `categorias`. `itens.grupo` continua o texto que liga o item à categoria. `lancamentos.item_id` não ganha ponteiro para a categoria.

**Rationale**: O orçamento, o resumo, o ano e a exportação já leem `itens.grupo`. Trocar todos esses leitores para um id, nesta história, espalha a mudança para telas que a spec deixou nas histórias 043–047. O lançamento já aponta para o item (`src/db/schema.ts`).

**Alternatives considered**: Substituir `grupo` por `categoria_id` agora. Rejeitado: cada tela que agrupa por nome teria de mudar junto, e a spec manda o lançamento continuar no item. Guardar a categoria só na aplicação, sem tabela. Rejeitado: renomear e arquivar precisam sobreviver ao recarregar, e o índice único precisa do banco.

## 2. Nome igual

**Decision**: A chave de comparação fica no domínio: trim, minúsculas, NFD sem marcas (`Ação` e `acao` são a mesma chave). A quebra de linha é rejeitada no texto original, antes do trim, porque `"Lazer\n".trim()` vira `"Lazer"`. O índice único parcial é `(orcamento_id, tipo, lower(nome))` onde `arquivada = false`. Ele segura diferença de caixa. Acento é regra do domínio, reaplicada dentro da transação ao ler as categorias ativas daquele tipo.

**Rationale**: `normalizeItemLabel` em `src/domain/itens.ts` troca qualquer espaço, inclusive quebra de linha, por um espaço só. Usá-lo aceitaria o nome que a spec recusa. `normalizeHeader` já tira acento, mas também põe em minúsculas e não mede os 40 caracteres do nome visível. O índice em `lower(nome)` é o que PostgreSQL e PGlite garantem sem a extensão `unaccent`.

**Alternatives considered**: Coluna `nome_chave` com a chave dobrada. Rejeitado: a conta é de uma pessoa só; a checagem na transação cobre o caso, e a coluna extra não está na spec. Índice com `unaccent`. Rejeitado: o PGlite local não cria essa extensão hoje.

## 3. Nomes que já existem e passam de 40

**Decision**: O backfill grava o nome que já está em `itens.grupo`, mesmo com mais de 40 caracteres. Nome novo, renomear para outro texto e grupo de item novo passam pela regra de 1–40. Renomear para o mesmo nome é no-op, inclusive se o nome guardado tiver mais de 40.

**Rationale**: A spec pede preservar o que a conta já usa. Encurtar no backfill mudaria o grupo dos itens e o lançamento continuaria certo, mas a lista mudaria de nome sem a pessoa pedir.

**Alternatives considered**: Recusar o backfill acima de 40. Rejeitado: a conta ficaria sem a categoria que os itens já mostram.

## 4. Duas grafias da mesma chave no backfill

**Decision**: O backfill agrupa por orçamento, tipo e `lower(nome)`. Se “Lazer” e “lazer” já existem, fica uma categoria. O nome escolhido é o de um grupo que ainda tem item ativo; se todos estão arquivados, fica o primeiro em `pt-BR`. Os itens da outra grafia passam a usar esse nome na mesma migration. Pares que só diferem por acento não são fundidos no SQL. A próxima criação ou renomeação no domínio trata os dois como o mesmo nome.

**Rationale**: O índice único em `lower(nome)` falha se as duas grafias de caixa forem inseridas. Acento no SQL, sem `unaccent`, não é a mesma chave do domínio. Fundir acento na migration aumenta o risco de juntar nomes que a pessoa distingue por outro motivo que não está nos dados atuais do catálogo.

**Alternatives considered**: Falhar a migration se houver colisão. Rejeitado: uma conta local com dois grupos iguais em caixa diferente não sobe. Fundir acento com `translate` no SQL. Rejeitado: a lista de marcas fica incompleta e diverge da função do domínio.

## 5. Onde o SQL roda

**Decision**: A tabela, o check de tipo (`R|F|V|E`), o índice parcial e o backfill entram na migration do Drizzle e, com o mesmo efeito, no `bootstrapSchema` de `src/db/pglite.ts`. Colunas de tempo seguem o resto do schema: `created_at` e `updated_at`.

**Rationale**: `openPglite` executa SQL escrito à mão e não aplica `drizzle/`. Neon sobe pela migration. Os dois caminhos precisam nascer com as categorias dos itens que já existem. `criado_em` quebraria o padrão de `itens` e `lancamentos`.

**Alternatives considered**: Só a migration Drizzle. Rejeitado: o app local continua sem a tabela. Só o bootstrap. Rejeitado: produção não passa por esse arquivo.

## 6. Transação e quem grava grupo

**Decision**: `db.transaction` envolve renomear, arquivar e o par item novo + categoria. `garantirCategoriaAtiva` é a única função que insere categoria a partir de um grupo. Ela é chamada por `createItem`, por `seedCatalog` e pelos dois `insert` de item em `src/application/import-planilha.ts`. Importar PDF não cria item com grupo novo; fica como está.

**Rationale**: Não há `.transaction` no repositório hoje, e o tipo `Db` (`PostgresJsDatabase`) e o driver do PGlite expõem esse método. Sem um único garantir, o catálogo semeado e a planilha gravariam grupo sem categoria, e a lista da spec ficaria furada. A spec diz que a regra de importação não muda: o alvo da linha continua o da história 022; só o insert passa a garantir a categoria do grupo que já ia ser gravado.

**Alternatives considered**: Trigger no banco. Rejeitado: a frase de nome inválido precisa nascer no domínio, e o PGlite de teste teria de repetir a trigger. Garantir só em `createItem`. Rejeitado: conta nova semeia dezenas de grupos em `ensureCatalog` e eles não apareceriam como categoria.

## 7. Limite que hoje é apertado

**Decision**: `validarLimitePct` no domínio devolve o inteiro ou a recusa. `saveLimites` só grava quando o global e cada categoria enviada passam. Senão devolve erro e não escreve. `getLimites` lê o inteiro já salvo; não reescreve a linha. `validateGlobalPct` deixa de apertar. O painel em `src/components/limites-panel.tsx` já mostra `res.error`.

**Rationale**: `validateGlobalPct` faz `Math.min(100, Math.max(1, trunc))` e devolve 80 para valor que não é finito. A spec pede o valor anterior intacto. A action `salvarLimitesAction` hoje ignora essa distinção e sempre responde sucesso.

**Alternatives considered**: Continuar apertando e só mudar a mensagem. Rejeitado: a spec diz que 0, 101 e fração não substituem o 80. Validar só na rota HTTP. Rejeitado: a action da tela de Ajustes grava pelo mesmo `saveLimites`.

## 8. Exportação e a história 017

**Decision**: `haMovimentoParaExportar` é pura: há lançamento, ou algum mês de algum item tem centavos diferentes de zero. Sem movimento, a action e as rotas `GET /api/v1/export/csv` e `json` devolvem “Não havia movimento para exportar.” e nenhum corpo de arquivo. Exceção ao montar o arquivo vira “Arquivo incompleto não é compartilhado.” Com movimento, `buildExportCsv` e `buildExportJson` permanecem. O painel já baixa só quando `res.ok`.

**Rationale**: A história 017 entrega arquivo mesmo com a lista de lançamentos vazia. A 041 restringe esse vazio ao caso em que também não há plano diferente de zero. O formato dos centavos não muda.

**Alternatives considered**: Tratar “sem lançamento” como sem movimento, mesmo com plano preenchido. Rejeitado: a spec manda entregar o arquivo quando há plano. Mudar o CSV. Rejeitado: a spec manda o arquivo da 017.

## 9. Conta alheia

**Decision**: A aplicação devolve `nao_encontrado` quando o id não existe neste `orcamentoId`. A rota responde 404 e “Categoria não encontrada.” Não existe ramo 403.

**Rationale**: As rotas de item usam 400 para “não encontrado”. A spec desta história pede que a outra conta seja tratada como inexistente, sem dizer que o dado existe e está proibido. 404 é essa frase. O filtro `orcamento_id` já é o padrão de `archiveItem`.

**Alternatives considered**: 400, como o item. Rejeitado: mistura nome inválido com id de outra conta. 403. Rejeitado pela spec.

## 10. Limite por categoria ao renomear

**Decision**: Na mesma transação do renomear, se `limites_alerta.cats_json` tem a chave do nome antigo, ela passa para o nome novo. Arquivar não apaga a chave.

**Rationale**: O override é um mapa pelo nome do grupo (`src/domain/alertas.ts`). Sem mover a chave, o limite que a pessoa gravou volta para o global no instante em que o nome muda. Isso altera um número salvo sem pedido. Não é tela nova.

**Alternatives considered**: Deixar a chave órfã para a história 047. Rejeitado: o alerta muda de comportamento antes da tela existir. Apagar a chave ao arquivar. Rejeitado: a spec não pede limpar o limite.
