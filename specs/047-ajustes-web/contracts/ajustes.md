# Contract: Ajustes web

A pessoa entrou na própria conta. Outro orçamento não aparece e não muda. A aba Ajustes fica marcada em todas as rotas abaixo. A casca não tem Sair. Em 1280 px e em 390 px não há botão flutuante. A página não repete `id="conteudo"`.

## Menu

`/app/ajustes` abre `/app/ajustes/categorias`.

Dia a dia, nesta ordem: Conta, Categorias e itens, Cartões, Limites de alerta, Itens arquivados. Dados e arquivos, nesta ordem: Importar planilha, Importar fatura, Exportar, Simulador de competência, Dados de exemplo. Excluir conta fica fora dos grupos, em destaque destrutivo. Sair da conta vem em seguida e abre diálogo.

A partir de 720 px o menu e a página ficam juntos. Abaixo de 720 px a página fica sozinha. Voltar mostra o menu. Escolher uma entrada abre a página. Abrir a aba mostra Categorias e itens, também abaixo de 720 px.

## Conta

`/app/ajustes/conta` mostra as iniciais, o nome, o e-mail, Esqueci a senha, "Dados da sua conta neste aparelho." e "Esta conta está ativa neste navegador." Esqueci a senha abre `/esqueci-senha` com a sessão de pé.

Claro, Escuro e Sistema: uma só marcada. A escolha vale na hora e continua depois de recarregar. Sistema acompanha o aparelho. Sem escolha anterior, Claro está marcado.

Sair da conta, aqui ou no menu, abre o mesmo diálogo: "Sair da conta", "A sessão desta conta será encerrada neste navegador.", Cancelar e Sair. Cancelar mantém a sessão e devolve o foco. Sair encerra a sessão e abre `/login`.

A zona de risco leva a `/app/ajustes/excluir`.

## Categorias

`/app/ajustes/categorias` tem as abas Categorias e Itens arquivados. A frase da aba Categorias é "Renomear atualiza o nome em todos os itens da categoria. Arquivar tira a categoria do Orçamento; os lançamentos antigos continuam."

Os quatro tipos aparecem nesta ordem: Receitas, Despesas fixas, Despesas variáveis, Anuais. Dentro do tipo, a ordem é a alfabética do português. A linha mostra o tipo e "1 item" ou "n itens". Categoria sem item mostra "0 itens". Categoria arquivada não aparece. `?tipo=F` marca Despesas fixas e não esconde os outros tipos.

"+ Nova categoria" abre o formulário com Tipo e Nome. Não cria item. No largo, o painel tem 460 px. Abaixo de 720 px, com `folhaNaEstreita`, é a folha de baixo. Nome recusado mostra a frase da história 041, não grava e deixa o formulário aberto. Nome aceito fecha o formulário e põe o foco na linha criada.

Renomear mostra o tipo e não deixa trocá-lo. O nome atual não é erro e não muda os itens. Um nome novo atualiza a categoria e os itens daquele tipo que usavam o nome antigo. Outro tipo não muda. O lançamento continua no mesmo item. Sucesso fecha o formulário e foca a linha. Recusa deixa o formulário aberto.

Arquivar abre "Arquivar {nome}?" com "Os itens saem do Orçamento. Os lançamentos antigos continuam." Cancelar não arquiva. Confirmar arquiva a categoria e os itens daquele grupo naquele tipo, mostra "Categoria arquivada." e mantém os lançamentos. Não há desarquivar nem reordenar.

## Itens arquivados

`/app/ajustes/categorias?aba=arquivados` e a aba mostram a mesma lista. A frase é "Somente leitura. Arquivados não entram em novos lançamentos nem na lista ativa do Orçamento." Colunas: Item, Tipo · grupo, Lançamentos. Com lançamento, "Histórico mantido". Sem lançamento, "Nenhum lançamento". Vazio: "Nenhum item arquivado." Não há ação de trazer de volta.

## Cartões

A frase da página é "Use o dia de fechamento para definir em qual fatura cada compra entra."

Cartão ativo mostra apelido, o texto de `textoLinhaCartao`, Editar e Desativar. Inativo fica em Inativos, com "não aparece em novos lançamentos". Lista ativa vazia: "Nenhum cartão ativo." Adicionar cartão continua. Não há apagar nem reativar.

O formulário pede apelido. Vazio: "Informe o apelido do cartão." Acima de 60: "Apelido muito longo." Fechamento vazio é aceito. Fora de 1 a 28: "Dia de fechamento deve ser entre 1 e 28." Vencimento vazio é aceito. Fora de 1 a 31: "Dia de vencimento deve ser entre 1 e 31." Últimos 4, se preenchidos, são quatro números; senão, "Últimos 4 dígitos: informe exatamente 4 números." Instituição é opcional. Dado recusado não grava e deixa o formulário aberto. Sucesso fecha o formulário e foca a linha.

Com fechamento, o formulário mostra "Compra no dia do fechamento entra na fatura do mês seguinte. Alguns bancos tratam esse dia de outro jeito." e "Vale para compras novas. As que já estão lançadas permanecem no mês em que foram gravadas." Mudar o fechamento não move lançamento. Sem fechamento, o aviso é "Sem dia de fechamento, a competência é o mês da compra."

Desativar abre "Desativar {apelido}?" com "O cartão sai dos pagamentos novos. Lançamentos antigos permanecem." Cancelar mantém o cartão ativo. Confirmar tira o cartão dos pagamentos novos e o lista em Inativos.

## Limites

A frase é "Preventivo em {n}% do planejado. O valor é um inteiro de 1 a 100." O campo é "Limite global (%)". O apoio é "Os alertas valem para todos os itens com plano definido." O botão é "Salvar limites". Não há lista por categoria.

Inteiro de 1 a 100 grava e mostra "Limites salvos." O valor por categoria que já existia continua. Fora da faixa, o campo guarda o que foi digitado, a mensagem é "Fora de 1 a 100. O valor salvo foi mantido." e o limite anterior continua. Reabrir a página mostra o valor salvo.

## Exportar

A página diz "O arquivo é gerado no seu navegador e você escolhe onde salvar." CSV: "Orçamento e lançamentos, para abrir no Excel ou no Planilhas Google." e Exportar CSV. JSON: "Cópia completa para backup ou análise." e Exportar JSON.

Sem lançamento e com todo plano em zero, o botão mostra "Não havia movimento para exportar." e não entrega arquivo. Se a geração não fecha, a mensagem é "Arquivo incompleto não é compartilhado." e não há arquivo parcial. As duas frases não aparecem juntas. Com movimento, a pessoa recebe o arquivo da própria conta, com os centavos.

## Exemplo

A página diz "Preenche o planejamento de alguns itens com valores ilustrativos. Não cria lançamentos e só roda se você confirmar." O primeiro toque não grava e mostra "Confirmar exemplo?" e "Toque de novo para confirmar. Seus planos atuais serão substituídos nos itens do exemplo." O segundo toque grava. A mensagem é "Exemplo aplicado: {n} itens tiveram o plano preenchido. Nenhum lançamento foi criado." No catálogo padrão intacto, n é 12 e Salário fica em R$ 6.500,00 nos doze meses. Item renomeado ou criado pela pessoa não muda. Sair da página antes do segundo toque não grava. Falha: "Não foi possível aplicar o exemplo." e o plano continua o de antes.

## Excluir

O primeiro passo diz "Excluir a conta remove o orçamento, lançamentos, cartões e limites. Não há como desfazer." O segundo passo diz "Digite a frase para liberar a exclusão definitiva." O campo é "Digite EXCLUIR para confirmar". Cancelar volta ao aviso, limpa o campo e não apaga.

Campo vazio: Excluir definitivamente inativo, sem erro. Outra frase: botão inativo e "Frase diferente não apaga. Digite EXCLUIR para confirmar." `EXCLUIR`, com espaços só nas pontas, apaga na hora a conta e o orçamento, encerra a sessão, abre `/login` e não espera 30 dias. Falha: "Não foi possível excluir a conta." A sessão e os dados continuam.

## Falha e foco

Enquanto carrega, a página não mostra lista vazia, limite zero nem "Nenhum cartão ativo." como se os dados já tivessem chegado. Falha ao carregar: "Não foi possível carregar." e Tentar de novo. Falha ao salvar categoria, cartão ou limite: "Não foi possível salvar. Os campos continuam preenchidos."

O foco entra no formulário e no diálogo ao abrir. Fechar sem gravar, ou cancelar um diálogo, devolve o foco a quem abriu. Gravar categoria ou cartão com sucesso leva o foco para a linha. A tela permanece legível no claro e no escuro. Com menos movimento, painel, diálogo e troca de tema aparecem sem animação.
