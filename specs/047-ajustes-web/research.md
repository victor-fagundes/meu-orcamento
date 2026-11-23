# Research: Ajustes web

## 1. Onde a tela está hoje

**Decision**: `src/app/app/ajustes/page.tsx` deixa de montar `AjustesCards`. O endereço `/app/ajustes` redireciona para `/app/ajustes/categorias`. O arquivo `ajustes-cards.tsx`, os painéis Material e o simulador ficam no repositório até a história 049 e não são importados pelas páginas novas.

**Rationale**: A página atual é um sanfona com Importar planilha, Importar fatura e Simulador de competência. A spec tira os três do menu e pede páginas, não cartões que abrem no mesmo rolamento. Apagar os arquivos agora é a história 049.

**Alternatives considered**: Esconder os três cartões e estilizar o resto. Rejeitado: o Material e a ordem antiga continuariam no mesmo componente. Criar outro prefixo de rota. Rejeitado: a aba e o Gerenciar já apontam para `/app/ajustes`.

## 2. Menu e páginas

**Decision**: O menu tem dois grupos. Dia a dia: Categorias e itens, Conta, Cartões, Limites de alerta, Itens arquivados. Dados e arquivos: Exportar, Dados de exemplo. Excluir conta fica fora dos grupos, com `destrutivo`, e leva a `/app/ajustes/excluir`. Sair da conta vem depois e abre diálogo, sem rota. Os ícones são os que `icons-paths.ts` já tem: `category`, `person`, `credit_card`, `notifications`, `archive`, `upload`, `science`, `delete`, `logout`.

As rotas são `categorias`, `conta`, `cartoes`, `limites`, `exportar`, `exemplo` e `excluir`. Itens arquivados é `/app/ajustes/categorias?aba=arquivados`. A mesma lista serve a aba e o menu. `?tipo=R|F|V|E` só marca o tipo vindo do Gerenciar. Não filtra os outros. Ausente, nenhum tipo fica marcado e os quatro aparecem. Não se usa `tipoDaQuery`, porque ele cai em Fixas e esconderia o resto.

Os rótulos desta tela são Receitas, Despesas fixas, Despesas variáveis e Anuais. `TIPOS_LABEL` continua com "Anuais / eventuais" para quem já o usa.

**Rationale**: A spec fecha a ordem e os dois grupos. O Gerenciar da história 044 já abre `/app/ajustes/categorias?tipo=F`. Uma segunda rota de arquivados duplicaria a lista.

**Alternatives considered**: Uma query `secao` numa página só. Rejeitado: o endereço de categorias já existe e o carregamento de cada página ficaria junto. Filtrar pelo tipo da query. Rejeitado: a spec manda os outros tipos continuarem alcançáveis.

## 3. Largo e estreito

**Decision**: A partir de 720 px o menu e a página aparecem juntos. Abaixo de 720 px a página ocupa a tela. Voltar, um `Botao` de texto, mostra só o menu sem mudar o endereço. Escolher uma entrada navega e esconde o menu. Abrir a aba cai em Categorias e itens também em 390 px. Não há botão flutuante. A página nova não repete `id="conteudo"`: a casca já marca esse alvo.

**Rationale**: 720 px é o corte em que a casca troca a barra inferior pela lateral. A spec pede os dois juntos em 1280 px e o vai-e-volta em 390 px. Os dois caem nos lados certos desse corte. A aba tem de mostrar Categorias, então o menu estreito é o destino de Voltar, não a primeira pintura.

**Alternatives considered**: Corte só em 390 px. Rejeitado: entre 391 e 719 a casca já está no modo estreito e o menu interno não caberia ao lado. Rota `/menu` para o Voltar. Rejeitado: recarregar essa rota esconderia Categorias, e a spec abre a aba nessa página.

## 4. Sair da casca

**Decision**: `casca-app.tsx` perde o `Botao` Sair. O único Sair é o diálogo de Ajustes, no menu e em Conta, com o mesmo texto: "Sair da conta", "A sessão desta conta será encerrada neste navegador.", Cancelar e Sair. Cancelar devolve o foco a quem abriu. Sair chama `authClient.signOut` e vai para `/login`. `e2e/casca.spec.ts` deixa de clicar o Sair da casca. O teste de Ajustes abre o diálogo e cancela, sem encerrar a conta demo.

**Rationale**: A história 042 deixou o Sair sem diálogo para a pessoa não ficar presa. Esta história tira esse atalho. `/login` já é o destino do Sair atual e não mostra a casca. A história 048 redesenha essa entrada.

**Alternatives considered**: Manter o botão da casca apontando para o mesmo diálogo. Rejeitado: a spec diz que a casca não oferece outro Sair. Ir para `/` depois de excluir, como o painel antigo. Rejeitado: a home não é a entrada da sessão encerrada.

## 5. Tema

**Decision**: O `ThemeProvider` de `packages/design-system/src/web/tema.tsx` passa a envolver o `body` em `src/app/layout.tsx`. O script de `mo-tema` permanece, para a primeira pintura não piscar. Conta oferece Claro, Escuro e Sistema com `Chips`, uma só marcada. Claro grava `light`, Escuro grava `dark`, Sistema grava `system`. A troca vale na hora. Sistema escuta o aparelho e não grava `light` nem `dark` no lugar. Chave ausente ou valor desconhecido continua Claro. Esqueci a senha é um link para `/esqueci-senha` e não chama `signOut`.

**Rationale**: O provider já faz a leitura, a gravação e o acompanhamento do aparelho. A app ainda não o monta. O script atual trata qualquer valor que não seja `light` como acompanhamento do aparelho, então `system` e a ausência já batem com a spec antes do provider hidratar.

**Alternatives considered**: Um segundo `localStorage`. Rejeitado: a chave `mo-tema` é a da história 040. Controlar o tema só com o script, sem provider. Rejeitado: o script não escuta a troca do aparelho depois do carregamento.

## 6. Categorias

**Decision**: A página usa `listarCategorias` e a contagem de itens ativos (`arquivado === 0`) do mesmo tipo e do mesmo nome. A ordem dos tipos é R, F, V, E. Dentro do tipo, `localeCompare` com `pt-BR`. A linha mostra "1 item" ou "n itens", inclusive "0 itens". Categoria arquivada não entra. Renomear e Arquivar ficam no `MenuAcoes`, com `destrutivo` falso. O diálogo de arquivar é o `Dialogo` da tela, não o diálogo embutido do menu: título "Arquivar {nome}?", texto "Os itens saem do Orçamento. Os lançamentos antigos continuam.", confirmar "Arquivar". Criar e renomear usam as actions que já existem. Nome recusado não grava e deixa o formulário aberto. Nome aceito, inclusive o nome que a categoria já tem, fecha o formulário e põe o foco na linha `categoria:{id}`.

**Rationale**: Criar, renomear e arquivar já estão na aplicação e já respeitam a história 041. O diálogo embutido do `MenuAcoes` repete o rótulo no título, na descrição e no botão, e não cabe a frase da spec.

**Alternatives considered**: Reimplementar a validação na tela. Rejeitado: a regra ficaria em dois lugares. Marcar Arquivar como `destrutivo` no menu. Rejeitado: o diálogo automático não tem a frase "Os itens saem do Orçamento".

## 7. Itens arquivados

**Decision**: A lista lê os itens com `arquivado === 1` daquele orçamento e se cada um tem lançamento. Com lançamento, a terceira coluna é "Histórico mantido". Sem lançamento, "Nenhum lançamento". As colunas são Item, Tipo · grupo e Lançamentos. O tipo usa os rótulos desta tela. A ordem é `localeCompare` do nome do item em `pt-BR`. Vazio: "Nenhum item arquivado." e a frase "Somente leitura. Arquivados não entram em novos lançamentos nem na lista ativa do Orçamento." Não há renomear, arquivar, desarquivar, excluir nem reordenar.

**Rationale**: `listItensArquivados` já filtra o orçamento, mas não diz se há lançamento e ainda usa `TIPOS_LABEL`. A spec separa as duas frases da terceira coluna. A ordem não estava na spec; o português do nome deixa a lista estável.

**Alternatives considered**: Ordenar pela data de arquivamento. Rejeitado: o item não guarda essa data. Mostrar "Histórico mantido" também sem lançamento. Rejeitado: a spec reserva essa frase para quem tem lançamento.

## 8. Cartões

**Decision**: `optionalDay` deixa de usar 28 para os dois dias. Fechamento continua 1 a 28. Vencimento passa a 1 a 31. Vazio continua `null`. Apelido continua com trim, espaços internos únicos e no máximo 60 caracteres. `validateCreateCartao` segue sendo a única regra. A tela usa as actions, não `POST /api/v1/cartoes`. Essa rota continua com `?? 1` e não entra nesta história.

A linha ativa, em `textoLinhaCartao`: com os dois dias, "Fecha dia {n} · vence dia {m}". Só fechamento, "Fecha dia {n}". Sem fechamento, "Sem dia de fechamento, a competência é o mês da compra." e, se houver vencimento, " · vence dia {m}". Não se inventa dia ausente. Editar e Desativar só na lista ativa. Inativo mostra o apelido e "não aparece em novos lançamentos", sem editar, sem apagar e sem reativar. Lista ativa vazia: "Nenhum cartão ativo." Adicionar continua.

Não existe atualização de cartão. `atualizarCartao` grava apelido, dias, instituição e últimos 4 no cartão daquele `orcamentoId` e não mexe em `ativo` nem em lançamento. Desativar continua `inativarCartao`. O formulário com fechamento mostra as duas frases da spec. Sem fechamento, mostra o aviso do mês da compra.

Gravar com sucesso fecha o formulário e foca a linha `cartao:{id}`. Dado recusado deixa o formulário aberto. O diálogo de desativar é "Desativar {apelido}?" e "O cartão sai dos pagamentos novos. Lançamentos antigos permanecem."

**Rationale**: O domínio hoje recusa vencimento 31 porque os dois dias compartilham o teto 28. A spec separa os tetos. Editar não tem função: o painel antigo só cria e inativa. A rota HTTP inventa o dia 1 quando o corpo vem vazio; mudá-la agora alteraria um contrato que esta tela não usa.

**Alternatives considered**: Aceitar 31 também no fechamento. Rejeitado: a spec mantém o fechamento em 1 a 28. Tratar editar como criar outro cartão. Rejeitado: o cartão antigo continuaria ativo.

## 9. Limite global

**Decision**: A página mostra o `globalPct` salvo, o campo "Limite global (%)" e "Salvar limites". Não lista `cats`. O inteiro de 1 a 100 passa por `validarLimitePct` e grava só `globalPct`. `catsJson` não é reescrito. A frase de sucesso é "Limites salvos." Fora da faixa, inclusive vazio, fração e texto, a tela não chama a action, mostra "Fora de 1 a 100. O valor salvo foi mantido." e conserva o que foi digitado. Ao reabrir, o campo volta ao valor salvo. Falha da action mostra "Não foi possível salvar. Os campos continuam preenchidos." `ERRO_LIMITE_PCT` continua para os outros chamadores. `limiteDaCategoria` e o cálculo do alerta não mudam.

**Rationale**: `salvarLimitesAction` hoje substitui `cats` pelo que a tela manda. Mandar um objeto vazio apagaria limites por categoria que a spec manda conservar. A frase da página não é a frase genérica do domínio.

**Alternatives considered**: Reusar `saveLimites` lendo os cats atuais e gravando de volta. Rejeitado: uma leitura a mais e uma escrita desnecessária no JSON. Mostrar "Informe um inteiro de 1 a 100." Rejeitado: a spec fixa a outra frase.

## 10. Exportar e exemplo

**Decision**: Exportar CSV e Exportar JSON continuam nas actions que já devolvem o arquivo da própria conta. Sem movimento, a tela mostra `MSG_SEM_MOVIMENTO` e não baixa arquivo. Geração que não fecha mostra `MSG_ARQUIVO_INCOMPLETO` e não baixa arquivo parcial. As duas frases não aparecem juntas. Não se acrescenta "Tente de novo."

Dados de exemplo: o primeiro toque em Carregar exemplo não chama a action. A página mostra "Confirmar exemplo?" e "Toque de novo para confirmar. Seus planos atuais serão substituídos nos itens do exemplo." O botão passa a "Confirmar exemplo". O segundo toque chama `carregarExemploAction`. Sucesso: "Exemplo aplicado: {n} itens tiveram o plano preenchido. Nenhum lançamento foi criado." Falha: "Não foi possível aplicar o exemplo." e o plano não muda. Sair da página desmonta o componente e desfaz o arme. `applyExamplePlans` não muda: continua nos itens cujo tipo, grupo e nome ainda são a chave de `EXAMPLE_PLANS_BRL`, inclusive arquivado, e grava os doze meses em centavos. `e2e/resumo.spec.ts` deixa de procurar o sanfona e a frase "itens atualizados". Passa por `/app/ajustes/exemplo` e pela frase nova.

**Rationale**: O arquivo e o preenchimento do exemplo já estão certos. A tela antiga junta o botão de confirmar com a pergunta e usa outra frase de sucesso. O Resumo depende desse caminho para semear a conta demo.

**Alternatives considered**: Gerar o arquivo de novo na página. Rejeitado: a spec manda o arquivo que a exportação já entrega. Pular o item arquivado no exemplo. Rejeitado: a função atual, e a spec, casam tipo, categoria e nome, sem exigir item ativo.

## 11. Excluir a conta

**Decision**: `confirmarFraseExclusao` vive em `src/domain/exclusao-conta.ts`. Depois do trim das pontas, só `EXCLUIR` confirma. Vazio não confirma e não é erro. Qualquer outra frase, inclusive `excluir` e `Excluir`, não confirma e a tela mostra "Frase diferente não apaga. Digite EXCLUIR para confirmar." O botão Excluir definitivamente só habilita na frase certa. A action usa a mesma função e não chama `toUpperCase`. Frase recusada não apaga. Sucesso apaga a conta na hora, encerra a sessão e vai para `/login`. Falha mostra "Não foi possível excluir a conta.", mantém a sessão e não mostra a mensagem crua do banco. Cancelar no segundo passo volta ao aviso, limpa o campo e não apaga. O primeiro passo usa a frase da zona de risco. O menu e Conta abrem a mesma rota.

**Rationale**: A action e o painel atuais aceitam `excluir` por causa de `toUpperCase`. A spec exige a palavra em maiúsculas. A regra precisa existir no servidor, senão um pedido direto apagaria com a frase errada.

**Alternatives considered**: Validar só no botão. Rejeitado: a action continuaria apagando `excluir`. Esperar 30 dias. Rejeitado: a decisão D-06 e a spec apagam na hora.

## 12. Formulário, campo e foco

**Decision**: Não existe `CampoNumero` no pacote. Dia, últimos 4 e limite usam `Campo` com `teclado="numerico"`. O tipo usa `Select`, já exportado pelo pacote, com um grupo e as quatro opções. No renomear, o `Select` fica desabilitado. Não se cria componente novo.

`FormularioContainer` ganha `folhaNaEstreita`, falso por padrão. Com ele verdadeiro e a largura abaixo de 720 px, a classe `mo-formulario--folha` encosta o formulário na base. De 720 px para cima, o painel continua com 460 px à direita. Categorias e cartões passam o prop. Orçamento e Lançamentos não passam, e o CSS atual deles não muda.

O foco entra no formulário ao abrir, por causa de `prenderFoco`. Fechar sem gravar devolve o foco a quem abriu. Depois de gravar com sucesso, a tela fecha o formulário e move o foco para a linha criada ou editada, no quadro seguinte, para não perder para a restauração do trap. Diálogo cancelado devolve o foco a quem abriu.

`loading.tsx` usa `Skeleton` e não mostra vazio, zero nem "Nenhum cartão ativo." `error.tsx` mostra "Não foi possível carregar." e "Tentar de novo". Falha ao salvar categoria, cartão ou limite mostra "Não foi possível salvar. Os campos continuam preenchidos." Nenhuma action devolve `e.message` para a pessoa.

**Rationale**: A spec lista `CampoNumero`, mas o pacote só tem `Campo`. A folha de baixo está na spec e no corte estreito. Ligar isso para todo formulário mudaria as telas já verificadas. O trap atual devolve o foco ao botão que abriu; a clarificação manda a linha gravada.

**Alternatives considered**: Criar `CampoNumero`. Rejeitado: seria um componente fora do que o pacote já publica, para o mesmo teclado. Media query geral em `.mo-formulario`. Rejeitado: Orçamento e Lançamentos passariam a abrir em folha. Deixar o foco no botão que abriu, depois de gravar. Rejeitado: a clarificação escolheu a linha.

## 13. O que não muda

**Decision**: Não muda schema, `competencia.ts`, `limiteDaCategoria`, `EXAMPLE_PLANS_BRL`, `buildExportCsv`, `buildExportJson`, `TIPOS_LABEL`, a rota `POST /api/v1/cartoes`, o Android, `globals.css` nem `@material/web`. Importar planilha, importar fatura e o simulador não ganham link. Não há desarquivar, reativar, reordenar nem prazo de 30 dias. Dado de outro orçamento continua fora das queries.

**Rationale**: A spec conserva essas regras e empurra a remoção do front antigo para a história 049.
