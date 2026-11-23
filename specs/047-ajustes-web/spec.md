# Feature Specification: Ajustes web

**Feature Branch**: `047-ajustes-web`

**Created**: 2026-11-23

**Status**: verified

**Input**: User description: "/speckit-specify 047"

**Related**: Quem entrou na conta abre Ajustes e encontra o menu em dois grupos, a conta, as categorias, os cartões, o limite, os arquivados, a importação de planilha, a importação de fatura, a exportação, o simulador, o exemplo e a exclusão. A aparência vem da identidade visual. O lugar na casca vem da história 042. O nome da categoria, o limite de 1 a 100 e as duas frases de exportar vêm da história 041. O arquivo com movimento continua o da exportação já entregue. A entrada e o envio de "Esqueci a senha" são a história 048.

## Referências visuais e de DS
- Identidade: `docs/identidade-visual/decisoes/DECISOES_identidade_visual.md` (seções aplicáveis: 5 Layout, 6 Formulários e confirmações, 7 Estados e mensagens, 8 Nomes e microcopy)
- Tela de referência: `docs/identidade-visual/telas-web/web-ajustes-conta.dc.html`, `web-ajustes-cartoes.dc.html`, `web-ajustes-limites.dc.html`, `web-ajustes-exportar.dc.html`, `web-ajustes-exemplo.dc.html`, `web-ajustes-excluir.dc.html`, `web-ajustes-arquivados.dc.html`, `web-categorias.dc.html`, `web-sair.dc.html`
- Componentes do DS usados: `CabecalhoTela`, `Avatar`, `LinhaAjuste`, `Icone`, `MenuAcoes`, `FormularioContainer`, `Campo`, `CampoNumero`, `Botao`, `Dialogo`, `Banner`, `Skeleton`, `EstadoErro`
- Tokens: apenas os de `packages/design-system/src/core/tokens.ts`

## Critérios de aceite visuais
- AC-V1: hierarquia e textos iguais à tela de referência, salvo as diferenças registradas em Assumptions.
- AC-V2: todos os componentes vêm do DS.
- AC-V3: estados (vazio, erro, carregando) iguais aos da referência, salvo as diferenças registradas em Assumptions.

## Clarifications

### Session 2026-11-23

- Q: Depois de gravar uma categoria ou um cartão com sucesso, o formulário fecha ou continua aberto? → A: O painel fecha e o foco vai para a linha criada ou editada.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Menu, conta, tema e saída (Priority: P1)

A pessoa abre Ajustes e vê dois grupos. **Dia a dia**: Conta, Categorias e itens, Cartões, Limites de alerta, Itens arquivados. **Dados e arquivos**: Importar planilha, Importar fatura, Exportar, Simulador de competência, Dados de exemplo. Excluir conta fica fora dos grupos, no fim, em destaque destrutivo. Em seguida vem Sair da conta. A identidade vale por cima da omissão anterior (PM, 2026-11-23).

A aba Ajustes continua a única marcada em qualquer uma dessas páginas. A casca não oferece outro Sair. Em 1280 px o menu e a página aberta aparecem juntos. Em 390 px a pessoa vê o menu, escolhe uma entrada e a página abre; Voltar devolve ao menu. Não há botão flutuante em 390 px nem em 1280 px.

Abrir Ajustes pela aba mostra Categorias e itens. Conta mostra, no topo, o avatar com as iniciais, o nome, o e-mail e Esqueci a senha. Esqueci a senha abre a recuperação sem encerrar a sessão. A frase da página é "Dados da sua conta neste aparelho." A sessão diz "Esta conta está ativa neste navegador." e oferece Sair da conta.

Na mesma página a pessoa escolhe uma opção: Claro, Escuro ou Sistema. A escolha vale na hora e continua neste navegador depois de recarregar. Sistema acompanha o aparelho e muda se o aparelho mudar, sem gravar Claro ou Escuro no lugar. Sem escolha anterior, vale Claro, mesmo com o aparelho em escuro.

Sair da conta, no menu ou na sessão, abre o mesmo diálogo: "Sair da conta", "A sessão desta conta será encerrada neste navegador.", Cancelar e Sair. Cancelar mantém a sessão. Sair encerra a sessão neste navegador e a casca deixa de aparecer.

**Why this priority**: Sem o menu a pessoa não chega nas outras páginas. Sem a saída confirmada, a sessão acaba por engano.

**Independent Test**: Abrir Ajustes e ler os dois grupos, com Importar planilha, Importar fatura e Simulador de competência. Em Conta, escolher Escuro e recarregar: a página continua escura. Cancelar o diálogo de sair e continuar na conta.

**Acceptance Scenarios**:

1. **Given** a pessoa entrou na conta, **When** ela abre Ajustes, **Then** vê Dia a dia com Conta, Categorias e itens, Cartões, Limites de alerta e Itens arquivados, e Dados e arquivos com Importar planilha, Importar fatura, Exportar, Simulador de competência e Dados de exemplo. Excluir conta está fora dos grupos, no fim, em destaque destrutivo, e Sair da conta vem depois.
2. **Given** qualquer página deste menu está aberta, **When** a pessoa lê a navegação da casca, **Then** só Ajustes está marcada. A casca não tem outro Sair.
3. **Given** a largura é 1280 px, **When** a pessoa abre Conta, **Then** o menu e a página aparecem juntos. **Given** a largura é 390 px, **When** ela escolhe Conta e depois Voltar, **Then** volta ao menu. Em 390 px e em 1280 px não há botão flutuante.
4. **Given** a conta se chama Victor Fagundes e o e-mail é o da conta, **When** a pessoa abre Conta, **Then** vê as iniciais VF, o nome, o e-mail, Esqueci a senha, "Dados da sua conta neste aparelho." e "Esta conta está ativa neste navegador."
5. **Given** Conta está aberta, **When** a pessoa escolhe Escuro, **Then** a tela fica escura na hora. **When** ela recarrega, **Then** Escuro continua marcado. **When** ela escolhe Sistema e o aparelho está claro, **Then** a tela fica clara e Sistema continua marcado se o aparelho mudar para escuro.
6. **Given** o diálogo "Sair da conta" está aberto, **When** a pessoa cancela, **Then** a sessão continua. **When** ela confirma Sair, **Then** a sessão deste navegador acaba e a casca não aparece.

---

### User Story 2 - Criar, renomear e arquivar categoria (Priority: P1)

Categorias e itens tem duas abas: Categorias e Itens arquivados. Em Categorias, a frase é "Renomear atualiza o nome em todos os itens da categoria. Arquivar tira a categoria do Orçamento; os lançamentos antigos continuam." Os tipos aparecem nesta ordem: Receitas, Despesas fixas, Despesas variáveis e Anuais. Cada tipo começa fechado. Abrir um tipo mostra as categorias ativas dele, em ordem alfabética do português. Cada uma mostra o tipo e a contagem de itens ativos: "1 item" ou "2 itens". Categoria ativa sem item aparece com "0 itens". Categoria arquivada não aparece nesta aba.

Renomear e Arquivar ficam no menu de ações da categoria, não como dois botões soltos na linha. Nova categoria fica no conteúdo, com o nome "+ Nova categoria". No largo, o formulário é um painel de 460 px. Em 390 px, é a folha de baixo. Os campos são Tipo e Nome. Criar categoria não cria item. Gravar com sucesso fecha o formulário, no painel ou na folha, e leva o foco para a linha criada. Um nome recusado deixa o formulário aberto.

O nome segue a história 041. Ele é guardado sem espaços nas pontas, numa linha só, com no máximo 40 caracteres. Vazio: "Informe o nome da categoria." Acima de 40: "Use no máximo 40 caracteres." Com quebra de linha: "Use o nome em uma linha só." Nome ativo igual no mesmo tipo, mudando só maiúsculas ou acento: "Escolha outro nome. Já existe uma categoria com esse nome neste tipo." O mesmo nome em outro tipo é aceito. Categoria arquivada não impede criar outra ativa com o mesmo nome. Nada disso grava quando a mensagem aparece.

Renomear mostra o tipo e não deixa trocá-lo. O nome novo segue as mesmas regras. Renomear para o nome que a categoria já tem não muda nada e não é erro. Um nome novo troca a categoria e os itens daquele tipo que usavam o nome antigo. Itens de outro tipo com o mesmo nome antigo permanecem. O lançamento continua no mesmo item. Quando o nome é aceito, inclusive o nome que a categoria já tem, o formulário fecha e o foco vai para essa linha. Quando é recusado, o formulário continua aberto.

Arquivar pergunta "Arquivar Lazer?" e explica "Os itens saem do Orçamento. Os lançamentos antigos continuam." Cancelar não arquiva. Confirmar arquiva a categoria e os itens daquele grupo, naquele tipo, e mostra "Categoria arquivada." Os lançamentos continuam em Lançamentos. Não há desarquivar nem reordenar.

Gerenciar, no Orçamento, abre esta página já no tipo que estava na tela. Os outros tipos continuam alcançáveis. Dado de outra conta não aparece e não muda.

**Why this priority**: O Orçamento manda a pessoa para cá para renomear e arquivar a categoria. Sem esta página, o grupo fica preso ao nome antigo.

**Independent Test**: Criar "  Lazer  " em Despesas variáveis, ver "Lazer" com "0 itens", tentar "lazer" de novo e ver a recusa. Arquivar Lazer, ler "Categoria arquivada." e encontrar os itens dela em Itens arquivados, com os lançamentos ainda na lista.

**Acceptance Scenarios**:

1. **Given** há categorias ativas nos quatro tipos, **When** a pessoa abre Categorias, **Then** a ordem dos tipos é Receitas, Despesas fixas, Despesas variáveis e Anuais, e dentro do tipo a ordem é a alfabética do português. A linha mostra o tipo e "1 item" ou "n itens".
2. **Given** nenhuma Lazer ativa em Despesas variáveis, **When** a pessoa cria "  Lazer  ", **Then** a categoria guardada se chama Lazer, aparece com "0 itens" e nenhum item nasce com ela.
3. **Given** Lazer ativa nesse tipo, **When** a pessoa cria "lazer" ou "Ação" contra "acao", **Then** nada é gravado e a mensagem é "Escolha outro nome. Já existe uma categoria com esse nome neste tipo." **When** ela cria Outros em outro tipo, **Then** as duas existem.
4. **Given** Moradia ativa em Despesas fixas, com itens, **When** a pessoa renomeia para Casa e Casa ainda não existe ativa nesse tipo, **Then** a categoria e esses itens passam a se chamar Casa. Um item Moradia de outro tipo não muda. O lançamento continua no mesmo item.
5. **Given** Lazer ativa, com itens e lançamentos, **When** a pessoa confirma "Arquivar Lazer?", **Then** a categoria sai da aba Categorias, os itens daquele grupo nesse tipo ficam arquivados, a mensagem é "Categoria arquivada." e os lançamentos continuam. **When** ela cancela, **Then** nada muda.
6. **Given** o Orçamento está em Fixas, **When** a pessoa aciona Gerenciar, **Then** Categorias e itens abre com Despesas fixas marcada. Os outros tipos continuam alcançáveis.
7. **Given** a categoria é de outra conta, **When** a pessoa tenta criar, renomear ou arquivar, **Then** a outra conta não muda e a categoria é tratada como inexistente.
8. **Given** o formulário de nova categoria ou de renomear está aberto com um nome aceito, **When** a pessoa grava, **Then** o formulário fecha e o foco vai para a linha criada ou renomeada. **When** o nome é recusado, **Then** o formulário continua aberto.

---

### User Story 3 - Itens arquivados, só leitura (Priority: P1)

Itens arquivados, pelo menu ou pela aba, mostra a mesma lista. A frase é "Somente leitura. Arquivados não entram em novos lançamentos nem na lista ativa do Orçamento." As colunas são Item, Tipo · grupo e Lançamentos. Academia em Saúde nas Despesas fixas aparece como "Academia" e "Despesas fixas · Saúde". Se o item tem lançamento, a terceira coluna diz "Histórico mantido". Se não tem, diz "Nenhum lançamento".

Não há Renomear, Arquivar, desarquivar, excluir nem reordenar. A lista vazia diz "Nenhum item arquivado." e mantém a frase de somente leitura. Item de outra conta não entra.

**Why this priority**: Arquivar tira o item do Orçamento. A pessoa precisa ver o que saiu e ter certeza de que o histórico ficou.

**Independent Test**: Arquivar um item com lançamento e outro sem. Os dois aparecem na lista, o primeiro com "Histórico mantido" e o segundo com "Nenhum lançamento", sem ação de trazer de volta.

**Acceptance Scenarios**:

1. **Given** Academia está arquivada em Despesas fixas · Saúde e tem lançamento, **When** a pessoa abre Itens arquivados pelo menu ou pela aba, **Then** vê Academia, "Despesas fixas · Saúde" e "Histórico mantido".
2. **Given** um item arquivado não tem lançamento, **When** a pessoa lê a terceira coluna, **Then** vê "Nenhum lançamento".
3. **Given** a lista está visível, **When** a pessoa procura desarquivar, excluir ou reordenar, **Then** essas ações não existem.
4. **Given** não há item arquivado, **When** a pessoa abre a lista, **Then** vê "Nenhum item arquivado." e a frase de somente leitura.

---

### User Story 4 - Cartões (Priority: P1)

Cartões explica "Use o dia de fechamento para definir em qual fatura cada compra entra." Cada cartão ativo mostra o apelido, "Fecha dia {n} · vence dia {m}" quando os dois dias existem, e as ações Editar e Desativar. Sem vencimento, a linha não inventa o dia. Sem fechamento, a linha avisa "Sem dia de fechamento, a competência é o mês da compra."

Adicionar cartão e Editar usam o mesmo formulário. Apelido é obrigatório. Vazio: "Informe o apelido do cartão." Longo demais: "Apelido muito longo." O dia de fechamento, se preenchido, fica entre 1 e 28. Fora disso: "Dia de fechamento deve ser entre 1 e 28." e o cartão não muda. Vazio é aceito. O vencimento, se preenchido, fica entre 1 e 31. Fora disso: "Dia de vencimento deve ser entre 1 e 31." e o cartão não muda. Vazio é aceito. Instituição é opcional. Últimos 4, se preenchidos, são exatamente quatro números; senão, "Últimos 4 dígitos: informe exatamente 4 números." Gravar com sucesso fecha o formulário, no painel ou na folha, e leva o foco para a linha criada ou editada. Dado recusado deixa o formulário aberto e não grava.

Com fechamento preenchido, o formulário avisa "Compra no dia do fechamento entra na fatura do mês seguinte. Alguns bancos tratam esse dia de outro jeito." e "Vale para compras novas. As que já estão lançadas permanecem no mês em que foram gravadas." Mudar o fechamento não move lançamento antigo.

Desativar pergunta "Desativar Nubank?" e explica "O cartão sai dos pagamentos novos. Lançamentos antigos permanecem." Cancelar mantém o cartão ativo. Confirmar tira o cartão dos pagamentos novos e o lista em Inativos, com "não aparece em novos lançamentos". Não há apagar. Cartão com histórico permanece. A lista ativa vazia diz "Nenhum cartão ativo." e Adicionar cartão continua disponível. Cartão de outra conta não aparece.

**Why this priority**: A competência da compra depende do fechamento. Sem esta página a pessoa não corrige o cartão nem o tira dos pagamentos novos.

**Independent Test**: Adicionar Nubank com fechamento 2 e vencimento 9, ver "Fecha dia 2 · vence dia 9". Desativar, cancelar e ver o cartão ativo; confirmar e ver o cartão em Inativos, com o lançamento antigo no mesmo mês.

**Acceptance Scenarios**:

1. **Given** Nubank fecha no dia 2 e vence no dia 9, **When** a pessoa lê a lista, **Then** vê "Fecha dia 2 · vence dia 9", Editar e Desativar.
2. **Given** Inter não tem dia de fechamento, **When** a pessoa lê a linha, **Then** vê "Sem dia de fechamento, a competência é o mês da compra."
3. **Given** o formulário está aberto, **When** a pessoa salva sem apelido, com fechamento 29 ou com vencimento 32, **Then** nada é gravado e a mensagem correspondente aparece. **When** ela salva apelido com fechamento vazio e vencimento 31, **Then** o cartão é gravado e o aviso de mês da compra aparece.
4. **Given** um cartão com fechamento e um lançamento já gravado, **When** a pessoa muda o fechamento, **Then** o lançamento antigo permanece no mês em que foi gravado.
5. **Given** o diálogo "Desativar Nubank?" está aberto, **When** a pessoa cancela, **Then** Nubank continua ativo. **When** ela confirma, **Then** Nubank sai dos pagamentos novos, aparece em Inativos e não há como apagá-lo.
6. **Given** o formulário de cartão está aberto com dados aceitos, **When** a pessoa grava, **Then** o formulário fecha e o foco vai para a linha criada ou editada. **When** os dados são recusados, **Then** o formulário continua aberto.

---

### User Story 5 - Limite global (Priority: P1)

Limites de alerta mostra o valor salvo na frase "Preventivo em {n}% do planejado. O valor é um inteiro de 1 a 100." O campo se chama "Limite global (%)". O texto de apoio é "Os alertas valem para todos os itens com plano definido." O botão é "Salvar limites". Esta página não lista limite por categoria.

Um inteiro de 1 a 100, inclusive 1 e 100, passa a ser o limite e a frase "Limites salvos." aparece. Zero, 101, 150, fração, texto ou vazio não gravam. O campo mantém o que foi digitado e a mensagem é "Fora de 1 a 100. O valor salvo foi mantido." O limite que já valia no Resumo e no Orçamento continua o mesmo. Ao reabrir a página, o campo mostra de novo o valor salvo.

**Why this priority**: O alerta do mês usa este número. Um valor fora da faixa não pode substituir o que já estava salvo.

**Independent Test**: Com o limite em 80, tentar salvar 150 e ver a mensagem, com o alerta do mês ainda em 80. Salvar 100 e ver a frase passar a "Preventivo em 100% do planejado."

**Acceptance Scenarios**:

1. **Given** o limite salvo é 80, **When** a pessoa abre a página, **Then** a frase diz "Preventivo em 80% do planejado. O valor é um inteiro de 1 a 100." e o campo mostra 80.
2. **Given** o limite salvo é 80, **When** a pessoa salva 1 ou 100, **Then** esse número fica salvo e a mensagem é "Limites salvos."
3. **Given** o limite salvo é 80, **When** a pessoa tenta salvar 0, 101, 150, 80,5 ou um texto, **Then** a mensagem é "Fora de 1 a 100. O valor salvo foi mantido.", o limite continua 80 e, ao reabrir, o campo mostra 80.
4. **Given** a página está aberta, **When** a pessoa procura um limite por categoria, **Then** não há essa lista.

---

### User Story 6 - Exportar (Priority: P1)

Exportar diz "O arquivo é gerado no seu navegador e você escolhe onde salvar." Há duas opções. Planilha CSV: "Orçamento e lançamentos, para abrir no Excel ou no Planilhas Google." e o botão Exportar CSV. JSON: "Cópia completa para backup ou análise." e o botão Exportar JSON.

Sem lançamento e sem plano diferente de zero, qualquer um dos botões mostra "Não havia movimento para exportar." e nenhum arquivo é entregue. Se a geração não fecha, a mensagem é "Arquivo incompleto não é compartilhado." e nenhum arquivo parcial aparece. Com lançamento ou com plano diferente de zero, a pessoa recebe o arquivo da própria conta, no formato que a exportação já entrega, com os centavos preservados: R$ 10,50 não vira 10 nem 11. Dado de outra conta não entra.

**Why this priority**: A pessoa leva o orçamento para fora. Arquivo vazio ou cortado parece um backup e não é.

**Independent Test**: Exportar uma conta sem movimento e ver a frase, sem arquivo. Exportar uma conta com um lançamento de R$ 10,50 e receber o arquivo completo, só dessa conta, com os 50 centavos.

**Acceptance Scenarios**:

1. **Given** a página está aberta, **When** a pessoa lê as opções, **Then** vê Exportar CSV e Exportar JSON com as frases da planilha e da cópia completa.
2. **Given** não há lançamento e todo plano está em zero, **When** a pessoa exporta CSV ou JSON, **Then** a mensagem é "Não havia movimento para exportar." e nenhum arquivo é entregue.
3. **Given** a geração não fecha, **When** a exportação termina, **Then** a mensagem é "Arquivo incompleto não é compartilhado." e nenhum arquivo parcial é entregue.
4. **Given** há um lançamento de R$ 10,50, **When** a pessoa exporta, **Then** recebe o arquivo da própria conta, com os 50 centavos, e não recebe linha de outra conta.

---

### User Story 7 - Dados de exemplo (Priority: P1)

Dados de exemplo explica "Preenche o planejamento de alguns itens com valores ilustrativos. Não cria lançamentos e só roda se você confirmar." O primeiro toque, Carregar exemplo, não grava. A página passa a mostrar "Confirmar exemplo?", "Toque de novo para confirmar. Seus planos atuais serão substituídos nos itens do exemplo." e o botão Confirmar exemplo.

O segundo toque substitui os doze meses do plano dos itens ilustrativos que ainda têm o tipo, a categoria e o nome originais. Não cria item e não cria lançamento. Item renomeado, item criado pela pessoa e item fora dessa lista permanecem. A mensagem é "Exemplo aplicado: {n} itens tiveram o plano preenchido. Nenhum lançamento foi criado." No catálogo padrão intacto, n é 12 e Salário fica em R$ 6.500,00 em cada um dos doze meses. Sair da página antes do segundo toque não grava. Falha no segundo toque não muda plano e diz "Não foi possível aplicar o exemplo."

**Why this priority**: O exemplo substitui plano de verdade. O primeiro toque não pode gravar.

**Independent Test**: No catálogo padrão, tocar uma vez e ver o plano de Salário intacto. Confirmar e ver "Exemplo aplicado: 12 itens tiveram o plano preenchido. Nenhum lançamento foi criado." e Salário em R$ 6.500,00 nos doze meses, sem lançamento novo.

**Acceptance Scenarios**:

1. **Given** a página acabou de abrir, **When** a pessoa lê o texto, **Then** vê que o exemplo preenche o planejamento, não cria lançamentos e só roda se ela confirmar.
2. **Given** Salário está em zero, **When** a pessoa toca Carregar exemplo uma vez, **Then** nada é gravado e a página mostra "Confirmar exemplo?" e "Toque de novo para confirmar. Seus planos atuais serão substituídos nos itens do exemplo."
3. **Given** o catálogo padrão está intacto e o exemplo está armado, **When** a pessoa confirma, **Then** a mensagem é "Exemplo aplicado: 12 itens tiveram o plano preenchido. Nenhum lançamento foi criado.", Salário fica em R$ 6.500,00 nos doze meses e nenhum lançamento nasce.
4. **Given** a pessoa renomeou Salário e criou Streaming, **When** ela confirma o exemplo, **Then** esses dois itens mantêm o plano que já tinham e n não os conta.
5. **Given** a confirmação falha, **When** a pessoa lê a página, **Then** vê "Não foi possível aplicar o exemplo." e os planos continuam os de antes.

---

### User Story 8 - Excluir a conta (Priority: P1)

Excluir conta, pelo menu ou pela zona de risco de Conta, começa pelo aviso "Excluir a conta remove o orçamento, lançamentos, cartões e limites. Não há como desfazer." O botão Excluir conta leva ao segundo passo. O segundo passo diz "Digite a frase para liberar a exclusão definitiva." O campo se chama "Digite EXCLUIR para confirmar". Cancelar volta ao aviso, limpa o campo e não apaga nada.

O botão Excluir definitivamente só fica ativo quando o campo, sem espaços nas pontas, é exatamente EXCLUIR. Campo vazio deixa o botão inativo e não mostra erro. "excluir", "Excluir" ou qualquer outra frase deixa o botão inativo e mostra "Frase diferente não apaga. Digite EXCLUIR para confirmar." Nada é apagado.

A frase certa apaga na hora a conta, o orçamento, os itens, os cartões, os lançamentos e os limites, encerra a sessão e não espera 30 dias. A pessoa não continua em Ajustes. Outra conta não muda. Se a exclusão falha, a conta continua, a sessão continua e a mensagem é "Não foi possível excluir a conta."

**Why this priority**: É a ação irreversível. A frase errada não pode apagar a conta, e a frase certa não pode deixar a sessão aberta.

**Independent Test**: No segundo passo, digitar "excluir" e ver o botão inativo e a frase de erro, com a conta intacta. Digitar EXCLUIR numa conta de teste, confirmar e ver a sessão encerrada, sem prazo de espera.

**Acceptance Scenarios**:

1. **Given** a pessoa abre Excluir conta, **When** ela lê o primeiro passo, **Then** vê "Excluir a conta remove o orçamento, lançamentos, cartões e limites. Não há como desfazer." e o botão para o segundo passo.
2. **Given** o segundo passo está aberto e o campo está vazio, **When** a pessoa olha Excluir definitivamente, **Then** o botão está inativo e nada foi apagado.
3. **Given** o campo é "excluir" ou outra frase, **When** a pessoa lê a página, **Then** o botão continua inativo, a mensagem é "Frase diferente não apaga. Digite EXCLUIR para confirmar." e a conta continua.
4. **Given** o campo é exatamente EXCLUIR, **When** a pessoa confirma, **Then** a conta e o orçamento somem na hora, a sessão acaba e não há espera de 30 dias.
5. **Given** a exclusão falha, **When** a pessoa lê a página, **Then** vê "Não foi possível excluir a conta.", continua na sessão e os dados continuam.

---

### User Story 9 - Falha, teclado e leitura (Priority: P2)

Enquanto uma página de Ajustes carrega, a pessoa não vê lista vazia, limite zero nem "Nenhum cartão ativo." no lugar do que ainda não chegou. Se o carregamento falha, a página diz "Não foi possível carregar." e oferece Tentar de novo, que repete a mesma página. Falha ao salvar categoria, cartão ou limite diz "Não foi possível salvar. Os campos continuam preenchidos." e não grava pela metade.

Cada controle tem nome. O foco é visível. Pelo teclado a pessoa alcança o menu, as abas, Nova categoria, o menu de ações, os cartões, o limite, exportar, o exemplo e os dois passos de excluir. No formulário e no diálogo, o foco entra ao abrir e permanece até fechar. Fechar sem gravar, ou fechar um diálogo, devolve o foco a quem abriu. Gravar categoria ou cartão com sucesso leva o foco para a linha criada ou editada. A tela continua legível no claro e no escuro. Com menos movimento, painel, diálogo e troca de tema aparecem sem animação. Dado de outra conta não aparece em nenhuma página.

**Why this priority**: O menu e as confirmações já entregam o valor. Sem foco e sem a falha certa, a pessoa confirma o que não vê ou acha que gravou.

**Independent Test**: Abrir o diálogo de sair pelo teclado, ver o foco dentro dele, cancelar e ver o foco voltar a Sair da conta. Provocar a falha de carregar e ver "Não foi possível carregar." sem uma lista vazia falsa.

**Acceptance Scenarios**:

1. **Given** Categorias ainda está carregando, **When** a pessoa olha a página, **Then** não vê "Nenhuma categoria neste tipo." nem contagem zero como se a lista já tivesse chegado.
2. **Given** o carregamento falha, **When** a pessoa lê a página, **Then** vê "Não foi possível carregar." e Tentar de novo. **When** ela tenta de novo, **Then** a mesma página é pedida outra vez.
3. **Given** salvar a categoria falha, **When** a pessoa lê o formulário, **Then** vê "Não foi possível salvar. Os campos continuam preenchidos." e o nome digitado continua lá.
4. **Given** o foco está em Ajustes, **When** a pessoa usa o teclado, **Then** ela alcança o menu e a ação principal da página aberta. O foco é visível no claro, no escuro e com menos movimento.
5. **Given** um diálogo abre, ou um formulário fecha sem gravar, **When** a pessoa fecha, **Then** o foco volta ao controle que abriu. **Given** categoria ou cartão é gravado com sucesso, **When** o formulário fecha, **Then** o foco vai para a linha criada ou editada.

---

### Edge Cases

- Importar planilha e Importar fatura entram no menu Dados e arquivos e abrem o fluxo que já existia, na aparência do design system.
- Simulador de competência entra no menu e só mostra a prévia. Nada é gravado.
- A casca não encerra a sessão por um Sair sem diálogo.
- Categoria ativa com zero itens aparece. Categoria arquivada sai da aba Categorias. Não há desarquivar nem reordenar, nem de categoria nem de item.
- Gravar categoria ou cartão com sucesso fecha o formulário e leva o foco para a linha criada ou editada. Nome ou dado recusado, e falha ao salvar, deixam o formulário aberto com o que foi digitado.
- "Lazer" e "lazer" são o mesmo nome no tipo. "Ação" e "acao" também. "NET" e "Internet" são categorias diferentes. O mesmo nome em tipos diferentes é permitido. Categoria arquivada não bloqueia o nome.
- Renomear para o mesmo nome não é erro. Renomear não alcança outro tipo e não move lançamento de item.
- Arquivar categoria arquiva os itens daquele grupo naquele tipo. Lançamentos permanecem. Cancelar não arquiva.
- Item arquivado sem lançamento mostra "Nenhum lançamento", não "Histórico mantido".
- Fechamento vazio é válido e avisa que a competência é o mês da compra. Fechamento 1 e 28 são válidos. 0 e 29 não gravam. Vencimento vazio é válido. 1 e 31 são válidos. 0 e 32 não gravam.
- Mudar o fechamento não recalcula lançamento já gravado. Desativar não apaga cartão nem lançamento. Não há reativar nesta história.
- Limite 1 e 100 gravam. 0, 101, fração e texto não gravam. O número rejeitado pode continuar visível até a pessoa sair; ao voltar, o campo mostra o valor salvo. Não há limite por categoria nesta página.
- Exportar sem movimento não entrega arquivo. Geração incompleta não entrega arquivo parcial. As duas frases não aparecem juntas.
- O primeiro toque do exemplo não grava. Recarregar antes do segundo toque desfaz o arme. Item renomeado não recebe o plano ilustrativo.
- EXCLUIR com espaços só nas pontas confirma. "excluir", "Excluir", "EXCLUIR agora" e campo vazio não confirmam. Não há prazo de 30 dias.
- Falha ao excluir, ao aplicar o exemplo ou ao salvar não grava pela metade.
- Lista, cartão, limite e arquivo de outra conta são tratados como inexistentes.
- Tema ausente vale Claro. Claro e Escuro não seguem o aparelho depois de escolhidos. Sistema só vale quando a pessoa marca Sistema.
- Em 390 px e em 1280 px não há botão flutuante. A aba Ajustes não perde a marca ao abrir uma subtela.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Ajustes MUST mostrar Dia a dia, nesta ordem: Conta, Categorias e itens, Cartões, Limites de alerta, Itens arquivados. MUST mostrar Dados e arquivos, nesta ordem: Importar planilha, Importar fatura, Exportar, Simulador de competência, Dados de exemplo. Excluir conta MUST ficar fora dos grupos, no fim, em destaque destrutivo, seguido de Sair da conta.
- **FR-002**: Em qualquer página deste menu, a aba Ajustes MUST permanecer a única marcada. A casca MUST NOT oferecer um Sair que encerre a sessão sem o diálogo. Em 1280 px o menu e a página MUST aparecer juntos. Em 390 px a página MUST abrir a partir do menu e Voltar MUST devolver ao menu. Em 390 px e em 1280 px MUST NOT haver botão flutuante. Abrir Ajustes pela aba MUST mostrar Categorias e itens.
- **FR-003**: Conta MUST mostrar as iniciais do nome, o nome, o e-mail, Esqueci a senha, "Dados da sua conta neste aparelho." e "Esta conta está ativa neste navegador." Esqueci a senha MUST abrir a recuperação sem encerrar a sessão.
- **FR-004**: Conta MUST oferecer Claro, Escuro e Sistema, uma só marcada. A escolha MUST valer na hora e MUST continuar neste navegador depois de recarregar. Sistema MUST acompanhar o aparelho. Sem escolha anterior, MUST valer Claro.
- **FR-005**: Sair da conta, no menu ou na sessão, MUST abrir o diálogo "Sair da conta" com "A sessão desta conta será encerrada neste navegador.", Cancelar e Sair. Cancelar MUST manter a sessão. Sair MUST encerrar a sessão deste navegador.
- **FR-006**: Categorias MUST listar só categorias ativas, pelos tipos Receitas, Despesas fixas, Despesas variáveis e Anuais, nessa ordem, e em ordem alfabética do português dentro do tipo. Cada tipo MUST começar fechado. Abrir o tipo MUST mostrar as categorias dele. A linha MUST mostrar o tipo e a contagem de itens ativos, com "1 item" no singular. Categoria sem item MUST aparecer com "0 itens". A frase de renomear e arquivar MUST estar visível. Renomear e Arquivar MUST estar no menu de ações da linha.
- **FR-007**: Nova categoria MUST pedir tipo e nome e MUST NOT criar item. O nome MUST seguir a história 041, inclusive as mensagens "Informe o nome da categoria.", "Use no máximo 40 caracteres.", "Use o nome em uma linha só." e "Escolha outro nome. Já existe uma categoria com esse nome neste tipo." Nome recusado MUST NOT gravar e MUST deixar o formulário aberto. O mesmo nome em outro tipo MUST ser aceito. Categoria arquivada MUST NOT bloquear o nome. No largo, o formulário MUST ser um painel de 460 px. Gravar com sucesso MUST fechar o formulário e MUST levar o foco para a linha criada.
- **FR-008**: Renomear MUST manter o tipo. Renomear para o nome atual MUST concluir sem erro e sem mudança. Um nome novo e único no tipo MUST atualizar a categoria e os itens daquele tipo que usavam o nome antigo. Outro tipo e os lançamentos MUST permanecer. Nome aceito MUST fechar o formulário e MUST levar o foco para a linha dessa categoria. Nome recusado MUST deixar o formulário aberto.
- **FR-009**: Arquivar MUST perguntar "Arquivar {nome}?" e MUST explicar "Os itens saem do Orçamento. Os lançamentos antigos continuam." Cancelar MUST NOT arquivar. Confirmar MUST arquivar a categoria e os itens daquele grupo naquele tipo, MUST mostrar "Categoria arquivada." e MUST manter os lançamentos. Desarquivar e reordenar MUST NOT existir. Gerenciar MUST abrir esta página no tipo que estava no Orçamento, com os outros tipos alcançáveis.
- **FR-010**: Itens arquivados, pelo menu ou pela aba, MUST ser a mesma lista somente leitura, com as colunas Item, Tipo · grupo e Lançamentos, a frase "Somente leitura. Arquivados não entram em novos lançamentos nem na lista ativa do Orçamento." e "Nenhum item arquivado." quando a lista está vazia. Com lançamento, a terceira coluna MUST dizer "Histórico mantido". Sem lançamento, MUST dizer "Nenhum lançamento".
- **FR-011**: Cartão ativo MUST mostrar apelido, Editar e Desativar. Com fechamento e vencimento, a linha MUST dizer "Fecha dia {n} · vence dia {m}". Sem fechamento, MUST avisar "Sem dia de fechamento, a competência é o mês da compra." Apelido vazio, fechamento fora de 1 a 28, vencimento fora de 1 a 31 e últimos 4 incompletos MUST NOT gravar e MUST usar a mensagem do campo. Fechamento vazio e vencimento vazio MUST ser aceitos. Mudar o fechamento MUST NOT mover lançamento já gravado. Gravar com sucesso MUST fechar o formulário e MUST levar o foco para a linha criada ou editada. Dado recusado MUST deixar o formulário aberto.
- **FR-012**: Desativar MUST perguntar "Desativar {apelido}?" e MUST explicar "O cartão sai dos pagamentos novos. Lançamentos antigos permanecem." Confirmar MUST tirar o cartão dos pagamentos novos e MUST listá-lo em Inativos. Apagar cartão e reativar MUST NOT existir. A lista ativa vazia MUST dizer "Nenhum cartão ativo."
- **FR-013**: Limites MUST mostrar "Preventivo em {n}% do planejado. O valor é um inteiro de 1 a 100.", o campo "Limite global (%)" e "Salvar limites". Inteiro de 1 a 100 MUST gravar e MUST mostrar "Limites salvos." Valor fora da faixa MUST NOT gravar, MUST mostrar "Fora de 1 a 100. O valor salvo foi mantido." e MUST manter o limite anterior. A página MUST NOT listar limite por categoria.
- **FR-014**: Exportar MUST oferecer Exportar CSV e Exportar JSON com as frases da planilha e da cópia completa. Sem lançamento e sem plano diferente de zero, MUST mostrar "Não havia movimento para exportar." e MUST NOT entregar arquivo. Geração que não fecha MUST mostrar "Arquivo incompleto não é compartilhado." e MUST NOT entregar arquivo parcial. Com movimento, o arquivo MUST ser o da própria conta, no formato já entregue pela exportação, com os centavos preservados.
- **FR-015**: Dados de exemplo MUST exigir dois toques. O primeiro MUST NOT gravar e MUST mostrar "Confirmar exemplo?" e "Toque de novo para confirmar. Seus planos atuais serão substituídos nos itens do exemplo." O segundo MUST substituir o plano dos itens ilustrativos que ainda têm o tipo, a categoria e o nome originais, MUST NOT criar lançamento e MUST mostrar "Exemplo aplicado: {n} itens tiveram o plano preenchido. Nenhum lançamento foi criado." No catálogo padrão intacto, n MUST ser 12 e Salário MUST ficar em R$ 6.500,00 nos doze meses. Falha MUST NOT alterar plano.
- **FR-016**: Excluir conta MUST ter dois passos. O primeiro MUST avisar "Excluir a conta remove o orçamento, lançamentos, cartões e limites. Não há como desfazer." O segundo MUST só ativar Excluir definitivamente quando o campo, sem espaços nas pontas, for exatamente EXCLUIR. Outra frase MUST mostrar "Frase diferente não apaga. Digite EXCLUIR para confirmar." e MUST NOT apagar. A frase certa MUST apagar na hora a conta e o orçamento, MUST encerrar a sessão e MUST NOT esperar 30 dias. Falha MUST manter conta e sessão.
- **FR-017**: Durante o carregamento, a página MUST NOT mostrar vazio ou zero como se os dados já tivessem chegado. Falha ao carregar MUST mostrar "Não foi possível carregar." e Tentar de novo. Falha ao salvar categoria, cartão ou limite MUST mostrar "Não foi possível salvar. Os campos continuam preenchidos."
- **FR-018**: Cada controle MUST ter nome e foco visível. Menu, abas, formulários e diálogos MUST ser alcançáveis pelo teclado. O foco MUST entrar no formulário ou diálogo ao abrir e MUST permanecer até fechar. Fechar sem gravar, ou fechar um diálogo, MUST devolver o foco a quem abriu. Gravar categoria ou cartão com sucesso MUST levar o foco para a linha criada ou editada. A tela MUST permanecer legível no claro e no escuro. Com menos movimento, painel, diálogo e troca de tema MUST aparecer sem animação. Dado de outra conta MUST ser tratado como inexistente.

### Key Entities

- **Conta**: nome, e-mail e sessão deste navegador. A exclusão remove a conta e o orçamento juntos.
- **Preferência de tema**: Claro, Escuro ou Sistema, neste navegador. Sistema acompanha o aparelho.
- **Categoria**: nome e tipo, ativa ou arquivada. Reúne os itens daquele tipo com aquele nome.
- **Item arquivado**: item fora da lista ativa e dos pagamentos novos. O lançamento antigo permanece.
- **Cartão**: apelido, fechamento opcional de 1 a 28, vencimento opcional de 1 a 31, instituição e últimos 4 opcionais. Ativo entra em pagamentos novos. Inativo não entra e não é apagado.
- **Limite global**: um inteiro de 1 a 100, usado no alerta do planejado.
- **Arquivo exportado**: CSV ou JSON da própria conta, só quando há movimento e a geração fecha.
- **Plano ilustrativo**: doze valores de um item do catálogo padrão que ainda tem o nome original. Não é lançamento.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A pessoa encontra os dois grupos, com Importar planilha, Importar fatura e Simulador de competência, Excluir conta isolado e Sair da conta em um olhar. A aba Ajustes continua marcada. Em 390 px e em 1280 px não há botão flutuante.
- **SC-002**: Escolher Escuro deixa a tela escura na hora e depois de recarregar. Cancelar "Sair da conta" mantém a sessão. Confirmar encerra a sessão neste navegador. A casca não tem um segundo Sair sem diálogo.
- **SC-003**: Criar "  Lazer  " grava Lazer com "0 itens" e sem item novo, fecha o formulário e deixa o foco na linha de Lazer. Criar "lazer" de novo não grava, mostra "Escolha outro nome. Já existe uma categoria com esse nome neste tipo." e mantém o formulário aberto. Arquivar Lazer mostra "Categoria arquivada.", tira os itens do Orçamento e deixa os lançamentos na lista.
- **SC-004**: Itens arquivados não oferece desarquivar. Item com lançamento mostra "Histórico mantido". Item sem lançamento mostra "Nenhum lançamento".
- **SC-005**: Nubank com fechamento 2 e vencimento 9 mostra "Fecha dia 2 · vence dia 9". Gravar esse cartão fecha o formulário e deixa o foco na linha. Fechamento 29 e vencimento 32 não gravam e mantêm o formulário aberto. Desativar Nubank tira o cartão dos pagamentos novos e não apaga o lançamento antigo.
- **SC-006**: Com o limite em 80, salvar 150 mostra "Fora de 1 a 100. O valor salvo foi mantido." e o limite continua 80. Salvar 100 mostra "Limites salvos." Conta sem movimento não recebe arquivo e vê "Não havia movimento para exportar."
- **SC-007**: O primeiro toque do exemplo não muda Salário. No catálogo padrão, o segundo toque mostra "Exemplo aplicado: 12 itens tiveram o plano preenchido. Nenhum lançamento foi criado." e deixa Salário em R$ 6.500,00 nos doze meses.
- **SC-008**: "excluir" não ativa Excluir definitivamente e não apaga nada. EXCLUIR apaga a conta na hora e encerra a sessão, sem espera de 30 dias. Pelo teclado, o foco entra no diálogo e volta a quem abriu.

## Assumptions

- A aparência vem da história 040. A casca é a história 042. A branch de trabalho é `rebuild-web`. O app do celular fica para a história 056 e não desenha estas páginas.
- A spec curta anterior, com status `ready`, já fechava os dois grupos, a ordem com Categorias e itens primeiro, o tema em Conta, as frases de categoria da história 041, o limite de 1 a 100, os dois toques do exemplo, as duas frases de exportar e a exclusão imediata com a frase EXCLUIR. Esta versão guarda essas decisões e descreve o que a pessoa vê em cada página.
- O artboard lista Conta antes de Categorias e itens. Esta história mantém Categorias e itens primeiro, como a spec curta e o pedido desta rebuild já fecharam.
- O artboard mostra Importar planilha, Importar fatura e Simulador de competência no menu. A identidade vale por cima (PM, 2026-11-23): os três entram no menu, na ordem do artboard.
- O artboard desenha Renomear e Arquivar escritos na linha. Esta história coloca as mesmas duas ações no menu de ações da categoria, como o pedido da rebuild já fechou. As palavras continuam Renomear e Arquivar.
- O artboard de Conta não desenha Claro, Escuro e Sistema. Esta história coloca a escolha em Conta. A preferência continua neste navegador, com os três modos. Em 2026-11-23 o PM fixou o tema ausente como Claro. O escuro da identidade continua pendente. Sistema só entra quando a pessoa marca Sistema.
- A casca da história 042 manteve Sair sem diálogo para a pessoa não ficar presa. Aqui a saída confirmada fica em Ajustes, no menu e em Conta, e a casca deixa de encerrar a sessão por conta própria.
- O artboard de Inter junta numa frase o aviso de cartão sem fechamento e o aviso de bancos que tratam o dia do fechamento de outro jeito. Esta história separa os dois. Sem fechamento: "Sem dia de fechamento, a competência é o mês da compra." Com fechamento, o formulário avisa que a compra no dia do fechamento entra na fatura do mês seguinte e que alguns bancos tratam esse dia de outro jeito. Lançamento já gravado não muda de mês.
- A spec curta pedia vencimento de 1 a 31. O artboard só mostra "vence dia 9". Esta história aceita 1 a 31 e recusa o que estiver fora. Fechamento continua de 1 a 28.
- O PRD 5.10 permite limite por categoria. O artboard e a spec curta só têm o limite global. Esta página não lista, não cria e não apaga limite por categoria. O cálculo do alerta no Resumo e no Orçamento não muda nesta história. O artboard não desenha a frase de sucesso. Depois de gravar um inteiro de 1 a 100, a pessoa vê "Limites salvos."
- O artboard de exportar mostra as duas frases de recusa ao mesmo tempo e acrescenta "Tente de novo." na frase do arquivo incompleto. Esta história mostra uma frase por vez. O texto do arquivo incompleto é o da história 041: "Arquivo incompleto não é compartilhado." Com movimento, o arquivo continua o que a exportação já entrega, só da própria conta.
- O artboard do exemplo usa 6 como número desenhado. O catálogo padrão tem doze itens ilustrativos. A mensagem usa a quantidade que de fato recebeu plano. Com esses doze nomes ainda originais, a quantidade é 12. Seis não é a regra.
- O artboard de excluir desenha o campo já com EXCLUIR e, no mesmo quadro, a frase de erro. São dois momentos. Campo vazio só deixa o botão inativo. Frase diferente mostra o erro. A spec curta exige a palavra exatamente em maiúsculas. "excluir" não confirma. Espaços só nas pontas não impedem EXCLUIR.
- O primeiro passo de excluir não tem artboard próprio. O texto vem da zona de risco desenhada em Conta. O menu e essa zona abrem os mesmos dois passos.
- "Nenhum lançamento" na coluna do item arquivado sem histórico não está desenhado. O artboard só mostra itens com "Histórico mantido". A coluna não usa essa frase quando não há lançamento.
- Cartão inativo continua visível em Inativos. O artboard só desenha a lista ativa e o diálogo. Sem essa lista, o cartão desativado sumiria e o lançamento antigo perderia o nome na página.
- As iniciais são a primeira letra do primeiro nome e a primeira letra do último, em maiúsculas. Um nome só usa a primeira letra. Victor Fagundes mostra VF. O nome do artboard é exemplo, não um usuário fixo.
- Em 390 px o menu e a página não cabem lado a lado como no artboard de 1280 px. A pessoa entra pela lista e volta por Voltar. A aba Ajustes permanece marcada.
- A pessoa vê e altera só a própria conta. Nada nesta história reordena categoria ou item, desarquiva, reativa cartão ou espera 30 dias para apagar a conta.
- Verificação em 2026-11-23: o PM marcou a história. O roteiro Playwright de `e2e/ajustes.spec.ts`, `e2e/casca.spec.ts`, `e2e/orcamento.spec.ts` e `e2e/resumo.spec.ts` passou. O status fica `verified`. AC-V1, AC-V2 e AC-V3 ficam cobertos pela tela no DS, com as diferenças já listadas acima.
