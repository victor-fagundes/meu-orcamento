# Research: Lançamentos web

## 1. Onde a tela está hoje

**Decision**: `src/app/app/lancamentos/page.tsx` deixa de montar `LancamentosView`. Monta `LancamentosTela` com as linhas da competência, os itens ativos, os cartões ativos e as parcelas irmãs dos grupos que aparecem no mês. O arquivo antigo fica no repositório até a história 049.

**Rationale**: A página já exige sessão, lê `?mes=` e lista só o `orcamentoId`. O miolo atual usa Material, filtra por tipo em vez de item, e o desfazer não é o `Snackbar` do pacote. Apagar o arquivo agora é a história 049.

**Alternatives considered**: Estilizar `LancamentosView` até parecer a tabela nova. Rejeitado: o Material e o filtro de tipo continuariam no mesmo componente. Criar outra rota. Rejeitado: o endereço permanece `/app/lancamentos`.

## 2. Mês no cabeçalho

**Decision**: Em `casca-abas.ts`, Lançamentos fica com `pedeMes: true`. Resumo e Orçamento continuam verdadeiros. Ano e Ajustes continuam falsos. A página nova não desenha "Mês anterior" nem "Próximo mês". `caminhoComMes` já conserva o resto da query.

**Rationale**: A spec pede o mês no cabeçalho da casca. O teste da casca hoje espera `pedeMes` falso nesta área. A página não pode repetir as setas.

**Alternatives considered**: Deixar as setas dentro da página. Rejeitado: a história 042 já desenha o mês quando a área pede.

## 3. Busca e filtros

**Decision**: As chaves são `q`, `item` e `pagamento`. `item` é o id do item. `pagamento` é `deb`, `pix`, `din` ou `cartao`. Ausente vale todos. O cliente filtra as linhas que o servidor já trouxe e grava a chave com `replace`, sem nova leitura do mês. A busca compara descrição e nome do item em minúsculas, com acento. `CampoBusca` usa o rótulo "Buscar por descrição" e `rotuloLimpar` "Limpar busca". Limpar apaga só `q`.

**Rationale**: A troca de mês da casca faz `push` e perderia estado só de memória. A spec manda conservar texto e filtros. Filtrar no cliente evita uma ida ao servidor a cada letra. A ordem já vem de `listLancamentosCompetencia`: data decrescente, `createdAt` decrescente.

**Alternatives considered**: Filtrar no SQL a cada tecla. Rejeitado: o mês já está na página. Guardar a busca só em `useState`. Rejeitado: o mês seguinte nasceria sem o texto.

## 4. Lista, parcela e selo

**Decision**: `src/domain/lancamentos-lista.ts` monta o texto da parcela, o selo e as linhas da prévia. "Parcela N de T · restam X" usa X = T − N. À vista, sem `grupoParcelaId` ou com total 1, não tem texto. O selo é "Fatura MM/AAAA" quando o meio é cartão e o dia de fechamento está entre 1 e 28. Sem fechamento, não há selo. A prévia de valores iguais diz "Prévia: N parcelas de R$ X". A de valores diferentes diz "Prévia: N parcelas" e uma linha "Jun/2026 · R$ 33,34" por parcela. A `Tabela` recebe células já formatadas com `formatarBRL` e `formatarDataBR`. A coluna Valor é `numero`. Com a chave de ocultar, a célula é "R$ •••••".

**Rationale**: A tabela do pacote só aceita string e não converte centavos. A frase e o selo são regra de leitura, testável sem React. O fechamento precisa vir na leitura da linha, porque o selo não é uma coluna do banco.

**Alternatives considered**: Estender a célula da tabela para um selo desenhado. Rejeitado: a pessoa precisa ler "Fatura 06/2026"; a string na descrição basta. Recalcular a competência na tabela. Rejeitado: a competência gravada é a que a lista usa.

## 5. Ocultar

**Decision**: A chave é a mesma do Resumo, `mo-ocultar-valores`. `"1"` oculta. O cliente lê na montagem. Não há botão nesta tela e não há segunda chave. Oculto, só a coluna Valor troca. O `CampoMoeda` do painel aberto recebe o centavo real.

**Rationale**: A spec manda a mesma preferência e a mesma máscara. Mascarar o campo impediria corrigir o valor.

**Alternatives considered**: Ignorar a chave. Rejeitado: o Resumo e o Orçamento já a aplicam a cifras. Gravar a preferência de novo. Rejeitado: a história 043 é a dona da chave.

## 6. Registrar e a prévia

**Decision**: "Registrar" abre `FormularioContainer` com título "Registrar lançamento" e salvar com o texto "Salvar". O item é `Select` em quatro grupos, nesta ordem: Receitas, Fixas, Variáveis, Anuais. A opção mostra "Mercado · Alimentação". Item arquivado não entra. O pagamento é outro `Select`: Débito, Pix, Dinheiro, Crédito. Crédito abre o `Select` do cartão, só ativos. "Parcelar" é `Switch` e só existe no crédito. Desligado, a quantidade é 1. Ligado, começa em 2. O campo aceita 1 a 60. Fora disso, "Parcelas devem ser entre 1 e 60." A prévia chama `buildLancamentoDraft` antes de gravar. Sem dia de fechamento, a prévia não leva selo e mostra "Sem dia de fechamento, a competência é o mês da compra." Salvar chama `criarLancamentoAction`. O painel fecha e o foco volta a "Registrar". A linha aparece no mês da competência, que pode não ser o mês aberto. Falha deixa o painel aberto e mostra "Não foi possível salvar. Os campos continuam preenchidos." O `catch` da action não mostra a mensagem crua.

**Rationale**: O draft já reparte R$ 100,00 em 3× e já força uma parcela fora do cartão. `lerBRL` devolve `null` na terceira casa e no texto vazio, e devolve negativo com sinal. A tela trata `null` e valor menor ou igual a zero com "Informe um valor maior que zero." `toCents` não serve aqui porque transforma inválido em zero.

**Alternatives considered**: Parcelar também em Pix, como o artboard estático. Rejeitado: a spec e o domínio só parcelam no crédito. Mudar `competencia.ts`. Rejeitado: a spec conserva a conta da fatura.

## 7. Editar

**Decision**: A linha da `Tabela`, quando selecionável, recebe `tabIndex`, Enter e Espaço, e o nome acessível "Editar {descrição}". Não há coluna Excluir. O painel "Editar lançamento" reabre os mesmos campos com o valor da parcela. Não há quantidade de parcelas. O item arquivado que já é o da linha entra no `Select`; os outros arquivados não. O cartão inativo que já é o da linha entra; os outros inativos não. À vista, Salvar chama `editarLancamentoAction` com alcance `one`. Num grupo, Salvar abre `Dialogo` "Corrigir parcelamento" com "Só esta parcela" (`one`) e "Esta e as próximas" (`future`). Nenhuma começa marcada. Confirmar fica desabilitado até a escolha. Não há `all` na correção. Cancelar volta ao painel sem chamar a action. Depois de gravar, o painel fecha e "Lançamento salvo." fica 5 segundos, sem desfazer. Se a linha continua na lista do mês aberto, o foco volta para ela. Se a competência a tirou do mês, o foco vai para "Registrar".

**Rationale**: `planEditLancamento` já aplica o valor por parcela, avança a data e não mexe na quantidade. O `Dialogo` de hoje não tem miolo nem confirmação desabilitada, então o alcance não cabe sem essas duas props. O artboard mostra "Todas do parcelamento" na correção; a spec não oferece.

**Alternatives considered**: Um terceiro alcance `all` na edição. Rejeitado na spec. Deixar o painel aberto depois de salvar. Rejeitado na clarificação.

## 8. Excluir e desfazer

**Decision**: "Excluir lançamento" fica no fim do painel de edição, variante destrutiva. O diálogo à vista não tem alcance. O diálogo de grupo oferece `one`, `future` e `all`, com os rótulos "Só esta parcela", "Esta e as próximas" e "Todas do parcelamento". A quantidade vem de `planDeleteLancamento` sobre as parcelas do grupo, inclusive as de outros meses. Confirmar fica desabilitado até a escolha. Sucesso fecha o painel, foca "Registrar" e mostra o `Snackbar` "Lançamento excluído." ou "N lançamentos excluídos." com "Desfazer" por 10 segundos. O payload é o `removed` que a action já devolve. Desfazer chama `desfazerExclusaoAction` e não reabre o painel. Aos 10 segundos o estado some. Uma segunda exclusão substitui esse estado. "Lançamento salvo." não aparece enquanto o desfazer está na tela. Falha ao excluir mantém o painel, devolve o foco a "Excluir lançamento" e mostra "Não foi possível excluir. O lançamento continua na lista." Falha ao desfazer mostra "Não foi possível desfazer. A exclusão continua." e conserva o botão até o fim dos 10 segundos. Recarregar não restaura, porque o payload não vai para o banco.

**Rationale**: A exclusão já é imediata e o desfazer já reinsere os mesmos ids. O tempo do snackbar é da tela: o componente do pacote não tem duração. A contagem do alcance precisa das parcelas que não estão no mês aberto, senão "Todas" mentiria o número.

**Alternatives considered**: Guardar o desfazer no banco. Rejeitado: a spec perde o desfazer ao recarregar. `MenuAcoes` na linha. Rejeitado: a spec tira o excluir da linha.

## 9. Vazio, carregando e erro

**Decision**: Mês sem linha e sem `q` monta `CartaoVazio` com "Nenhum lançamento em {mês}", a frase do artboard e "Registrar lançamento". Busca e filtros não aparecem. Com `q` e sem linha, a tela mostra `Nenhum resultado para "{texto}"`, a frase de conferir a descrição e "Limpar busca". Sem `q` e com filtro que esconde tudo, mostra "Nenhum lançamento com esses filtros." `loading.tsx` monta `Skeleton` e não renderiza moeda. `error.tsx` monta `EstadoErro` com "Não foi possível carregar o mês." e "Tentar de novo".

**Rationale**: O vazio da spec é o mês sem lançamento, não o filtro. O carregamento do App Router já tem o lugar dos dois estados, como no Resumo e no Orçamento.

**Alternatives considered**: Uma frase só, a do microcopy antigo. Rejeitado: a spec separou título, frase e ação, com o nome do mês.

## 10. O que não muda

**Decision**: Não muda schema, `competencia.ts`, `splitParcelas`, `planEditLancamento`, `planDeleteLancamento`, o Android, `globals.css` nem `@material/web`. Não há FAB. Não há intervalo de datas. Não há campo de observação. A telemetria das três actions permanece, sem descrição nem valor no evento.

**Rationale**: A spec conserva a fatura e os centavos. A API e o celular não são esta tela.
