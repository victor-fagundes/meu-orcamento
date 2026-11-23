# Research: Orçamento web

## 1. Onde a tela está hoje

**Decision**: `src/app/app/orcamento/page.tsx` deixa de montar `OrcamentoView`. Monta `OrcamentoTela` com os itens ativos, o realizado do mês, os limites e `alertasDoMes`. O arquivo antigo fica no repositório até a história 049.

**Rationale**: A página já exige sessão, lê `?mes=` e `?tipo=`, e soma o realizado por item do `orcamentoId`. O miolo atual desenha o mês de novo, usa Material e não tem "Nova categoria", o interruptor nem o banner no componente do pacote. Apagar o arquivo agora é a história 049.

**Alternatives considered**: Estilizar `OrcamentoView` até parecer a lista nova. Rejeitado: o mês duplicado e o Material continuariam no mesmo componente. Criar outra rota. Rejeitado: o endereço permanece `/app/orcamento`.

## 2. Mês no cabeçalho, tipo e categorias abertas

**Decision**: Em `casca-abas.ts`, Orçamento fica com `pedeMes: true`. Resumo continua verdadeiro. As outras três continuam falsas. A página nova não desenha "Mês anterior" nem "Próximo mês". O clique do mês na casca troca só o valor de `mes` e conserva o resto da query. `tipo` ausente ou inválido vale `F`. As categorias abertas são a chave repetida `aberta`. Trocar de tipo navega sem `aberta`. Abrir ou fechar uma categoria faz `replace` dessa chave. O cliente não usa `key` com o mês.

**Rationale**: A casca hoje faz `router.push` só com `?mes=`, e o tipo que o Resumo mandou se perde. A spec manda conservar o tipo e as categorias já abertas. Guardar o aberto na query sobrevive ao novo desenho do servidor. Voltar a um tipo sem `aberta` começa fechado, que é o que a clarificação pediu.

**Alternatives considered**: Estado só no cliente. Rejeitado: a navegação do mês pode remontar a página e fechar o que a pessoa abriu. `sessionStorage` por tipo. Rejeitado: ao voltar para Fixas a lista reabriria, e a spec manda começar fechada.

## 3. Lista, frase e total

**Decision**: `src/domain/orcamento-lista.ts` agrupa os itens ativos do tipo pelo nome da categoria. Realizado e planejado da categoria são a soma dos itens, em centavos. Categorias com soma maior que zero vêm primeiro. Dentro de cada bloco, `localeCompare` em `pt-BR`. O total do tipo usa `formatarBRLInteiro` e a frase "de R$ x planejados". A linha da categoria e a do item usam `formatarBRL`. `GrupoComMedidor` e `LinhaItem` passam a receber `limiteAtencao`, com padrão 80, e chamam `fraseDoEstado` com esse limite. O limite da categoria vem de `limiteDaCategoria`. O medidor continua parando em 100.

**Rationale**: A frase do pacote já é a da spec, mas hoje ignora o limite da categoria. A soma é a conta que o mês já mostra no grupo. O total do tipo corta centavos, como os cartões do Resumo. A linha mostra centavos, como "Estourou em R$ X".

**Alternatives considered**: Recalcular o alerta dentro do componente. Rejeitado: o limite já está em `alertasDoMes` e em `limiteDaCategoria`. Ordenar no SQL. Rejeitado: o bloco "com valor primeiro" depende do mês aberto, não da tabela.

## 4. Banner

**Decision**: A página chama `bannerFromAlertas` no resultado que `loadAlertasMes` já devolve. Erro usa `Banner` `erro`. Atenção usa `Banner` `atencao`. A frase é a `msg` que o mês já calculou. `textoDemaisAlertas` devolve `null` com zero, "E mais 1 alerta." com um, e "E mais N alertas." com dois ou mais. Sem alerta, a página não monta o banner. Trocar o tipo não muda a lista.

**Rationale**: A spec não muda quem entra no alerta. `bannerFromAlertas` já escolhe o primeiro erro, ou o primeiro alerta se só houver atenção. A frase nova é a da linha, não a do banner.

**Alternatives considered**: Trocar o texto de `alertasDoMes` pela frase do consumo. Rejeitado: a clarificação separou as duas frases. Esconder o banner em Receitas. Rejeitado: o banner é do mês.

## 5. Ocultar

**Decision**: A chave é a mesma do Resumo, `mo-ocultar-valores`. `"1"` oculta. O cliente lê na montagem. Não há botão nesta tela e não há segunda chave. Oculto, o total, o realizado e o planejado da categoria e do item mostram "R$ •••••", e o nome visível é essa máscara. O medidor, `fraseDoEstado` e o banner continuam com o texto. O `CampoMoeda` do plano aberto recebe o centavo real. `GrupoComMedidor` e `LinhaItem` ganham `ocultado`.

**Rationale**: A spec manda a mesma preferência e a mesma máscara. Criar "Ocultar valores" aqui seria o segundo controle. Mascarar o campo impediria gravar o mês, e a clarificação mandou mostrar o valor no plano.

**Alternatives considered**: Ignorar a chave. Rejeitado na clarificação. Gravar a preferência de novo. Rejeitado: a história 043 já é a dona da chave.

## 6. Criar

**Decision**: "Nova categoria" abre `FormularioContainer` com o nome. O tipo gravado é o tipo marcado. A action é `criarCategoriaAction`. A categoria entra na lista fechada. "Novo item" abre outro painel com nome e categoria. As sugestões são as categorias ativas do tipo. Um nome novo segue `criarItemAction`, que já cria a categoria na mesma gravação quando ela não existe. O item nasce com os doze meses em zero: a action não recebe plano. Depois de gravar, a query ganha `aberta` com o nome da categoria e não remove as que já estavam. Cancelar, toque fora e voltar chamam o cancelar do painel. O fundo de `FormularioContainer` passa a chamar `onCancelar` no clique fora do painel.

**Rationale**: As frases de nome já estão na história 041 e em `validateCreateItem`. O plano é outro gesto, o da história de gravar o mês. A categoria do item precisa abrir porque a lista começa fechada.

**Alternatives considered**: Pedir o valor no "Novo item". Rejeitado: a spec grava o plano no painel do item. Abrir a categoria e fechar as outras. Rejeitado na clarificação.

## 7. Plano

**Decision**: O painel é `FormularioContainer`, título igual ao nome do item, salvar com o texto "Salvar plano". O campo é `CampoMoeda` com o valor do mês aberto. O interruptor é `Switch`, desligado ao abrir. `lerValorDoPlano` em `src/domain/plano.ts` devolve centavos ou uma das três frases: vazio, negativo, terceira casa. `aplicarValorAoMes` grava só o índice do mês aberto. `aplicarValorAoMesESeguintes` grava esse índice e os posteriores. O índice vem da competência aberta, não de `new Date()`. "Salvar plano" chama `salvarPlanoAction` com os doze meses, fecha o painel e devolve o foco ao item. "Copiar mês anterior" usa `copiarMesAnterior` com esse índice, grava e deixa o painel aberto. Em janeiro mostra "Janeiro não tem mês anterior neste ano." e não chama a action. "Aplicar a todos os meses" usa `aplicarATodos` e deixa o painel aberto. "Copiar ano anterior" usa `copiarAnoAnterior`, mostra "Não há plano do ano anterior para copiar." e não chama a action. Valor inválido ou falha deixam o painel aberto. A falha mostra "Não foi possível salvar. Os campos continuam preenchidos."

**Rationale**: `copiarMesAnterior` e `aplicarATodos` já existem e cobrem janeiro e os doze meses. Falta a cópia só para a frente, que é o interruptor. `toCents` transforma negativo e vazio em zero, então não serve para as três frases. O mês civil de hoje, usado no sheet antigo, gravaria o mês errado quando a pessoa está em outro mês.

**Alternatives considered**: Doze campos no painel. Rejeitado: a spec edita o mês aberto e usa o interruptor e as três ações. Fechar o painel em toda gravação. Rejeitado: a frase de janeiro e a de ano anterior precisam continuar visíveis.

## 8. Arquivar

**Decision**: Cada item tem um controle "Arquivar" separado do botão que abre o plano. `Dialogo` abre com título "Arquivar {nome}?" e a frase "Ele sai do Orçamento e de novos lançamentos. Os lançamentos antigos continuam." Confirmar chama `arquivarItemAction`. Cancelar, toque fora, voltar e Esc chamam `onCancelar`. O fundo do diálogo passa a fechar no clique de fora. Não há desarquivar, reordenar, renomear categoria nem arquivar categoria nesta tela.

**Rationale**: `Dialogo` já prende o foco e devolve ao fechar, mas o clique no fundo ainda não cancela. A action já tira o item dos ativos e conserva o lançamento. O nome no título é o do item acionado, mesmo quando outro item tem o mesmo nome.

**Alternatives considered**: Reusar o passo armado de `arquivar-rotulo.ts` no lugar do diálogo. Rejeitado: a spec pede o diálogo com título e frase, não o botão que muda de rótulo.

## 9. Gerenciar, vazio, carregando e erro

**Decision**: "Gerenciar" abre `/app/ajustes/categorias?tipo=` com o tipo marcado. Essa rota lista as categorias ativas daquele tipo, só leitura, com o nome do tipo. Renomear e arquivar categoria não nascem aqui; a história 047 coloca essas ações. Sem item ativo no tipo, a página monta `CartaoVazio` com "Nenhum item neste tipo", "Crie um item para planejar o mês." e "Novo item", e mantém os dois botões do topo. `loading.tsx` monta `Skeleton` e não renderiza moeda. `error.tsx` monta `EstadoErro` com "Não foi possível carregar o mês." e "Tentar de novo".

**Rationale**: O link precisa de um endereço que exista. A lista filtrada prova o tipo. Construir o menu de Ajustes nesta história duplicaria a 047. O vazio da spec é por tipo, não por mês. O carregamento do App Router já tem o lugar dos dois estados, como no Resumo.

**Alternatives considered**: Apontar Gerenciar para `/app/ajustes` sem tipo. Rejeitado: a spec pede o filtro. Tratar vazio como mês sem lançamento. Rejeitado: outro tipo pode ter movimento.

## 10. O que não muda

**Decision**: Não muda schema, `alertasDoMes`, `totaisDoMes`, a regra de competência, o Android, `globals.css` nem `@material/web`. Não há FAB. Não há intervalo de datas.

**Rationale**: A spec conserva o alerta e a competência. A API e o celular não são esta tela.
