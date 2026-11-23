# Feature Specification: Entrada web

**Feature Branch**: `048-entrada-web`

**Created**: 2026-11-23

**Status**: verified

**Input**: User description: "/speckit-specify 048"

**Related**: Quem ainda não entrou vê a marca e um formulário: Entrar, Criar conta, Esqueci a senha, a confirmação de link enviado e o aviso de sessão expirada. Depois de sair, a mesma entrada volta. No largo são duas colunas. No estreito, uma. A aparência vem da história 040. A casca das cinco áreas é a história 042 e não aparece aqui. A confirmação de Sair da conta é a história 047.

## Referências visuais e de DS
- Identidade: `docs/identidade-visual/decisoes/DECISOES_identidade_visual.md` (seções aplicáveis: 1 Marca, 5 Layout, 6 Formulários e confirmações, 7 Estados e mensagens, 9 Acessibilidade)
- Tela de referência: `docs/identidade-visual/telas-web/web-entrar.dc.html`, `web-entrar-erro.dc.html`, `web-criar-conta.dc.html`, `web-esqueci.dc.html`, `web-esqueci-enviado.dc.html`, `web-sessao-expirada.dc.html`, `web-sair.dc.html`. No estreito, apoio em `docs/identidade-visual/telas-app/entrar.dc.html` e `entrar-erro.dc.html`
- Componentes do DS usados: `Campo`, `Botao`, `Banner`
- Tokens: apenas os de `packages/design-system/src/core/tokens.ts`

## Critérios de aceite visuais
- AC-V1: hierarquia e textos iguais à tela de referência, salvo as diferenças registradas em Assumptions.
- AC-V2: todos os componentes vêm do DS.
- AC-V3: estados (vazio, erro, carregando) iguais aos da referência, salvo as diferenças registradas em Assumptions.
- Verificação em 2026-11-23: o PM testou a história. T001–T020 concluídos. O roteiro Playwright de `e2e/entrada.spec.ts`, `e2e/casca.spec.ts` e `e2e/ajustes.spec.ts` passou. O status fica `verified`. AC-V1, AC-V2 e AC-V3 ficam cobertos pela tela no DS, com as diferenças já listadas em Assumptions.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Entrar no largo e no estreito (Priority: P1)

A pessoa abre Entrar e vê a marca Meu Orçamento e o formulário. A partir de 720 px são duas colunas: à esquerda a marca, o nome Meu Orçamento, "O que ainda cabe neste mês." e "Entre para ver o que ainda cabe no mês."; à direita o formulário no bloco de 400 px, com o título Entrar, os campos E-mail e Senha, Esqueci a senha, o botão Entrar e Criar conta. Abaixo de 720 px é uma coluna: a marca centralizada, Meu Orçamento, "O que ainda cabe neste mês." e, em seguida, o mesmo formulário com o título Entrar. A frase "Entre para ver o que ainda cabe no mês." fica só na coluna esquerda do largo. Não há casca com as cinco áreas.

**Why this priority**: Sem este lugar, a pessoa não chega ao orçamento. As outras histórias da entrada ocupam o mesmo espaço.

**Independent Test**: Em 1280 px e em 720 px, contar duas colunas e ler a frase da esquerda. Em 719 px e em 390 px, ver uma coluna só, com a marca acima do formulário Entrar e sem a frase da coluna esquerda. Em todas, a casca das cinco áreas está ausente.

**Acceptance Scenarios**:

1. **Given** a largura é 1280 px ou 720 px, **When** a pessoa abre Entrar, **Then** vê duas colunas. A esquerda mostra a marca, Meu Orçamento, "O que ainda cabe neste mês." e "Entre para ver o que ainda cabe no mês." A direita mostra o título Entrar, E-mail, Senha, Esqueci a senha, Entrar e Criar conta. O formulário é o bloco de 400 px.
2. **Given** a largura é 719 px ou 390 px, **When** a pessoa abre Entrar, **Then** vê uma coluna. A marca está centralizada, com Meu Orçamento e "O que ainda cabe neste mês." acima do formulário. O título Entrar continua. A frase "Entre para ver o que ainda cabe no mês." não aparece.
3. **Given** a pessoa não tem sessão, **When** ela abre Entrar, Criar conta ou Esqueci a senha em 1280 px ou em 390 px, **Then** a casca com Resumo, Orçamento, Lançamentos, Ano e Ajustes não aparece.
4. **Given** a pessoa já tem sessão, **When** ela abre Entrar ou Criar conta, **Then** vai ao Resumo e o formulário de entrada não fica no lugar da casca.

---

### User Story 2 - Credencial certa e credencial errada (Priority: P1)

Com e-mail e senha da própria conta, Entrar abre o Resumo. Se a pessoa tinha sido levada à entrada a partir de uma página da própria conta, Entrar devolve essa página. Credencial recusada mostra um erro só: "E-mail ou senha incorretos. Confira os dados e tente de novo." A frase não diz que o e-mail é que falhou, nem que a senha é que falhou. E-mail e senha digitados continuam nos campos. Os dois campos compartilham o estado de erro do artboard, e nenhum dos dois ganha uma frase própria. Não nasce sessão.

**Why this priority**: O erro que aponta um dos dois campos revela qual parte da credencial acertou. A entrada certa é o que entrega o orçamento.

**Independent Test**: Entrar com a senha da conta e chegar ao Resumo. Repetir com a senha trocada e ler uma frase só, com os dois valores ainda nos campos e sem sessão.

**Acceptance Scenarios**:

1. **Given** e-mail e senha são os da conta, **When** a pessoa entra, **Then** a sessão começa e o Resumo abre. A casca das cinco áreas passa a valer.
2. **Given** a pessoa foi levada à entrada a partir de uma página da própria conta, **When** a credencial é aceita, **Then** essa página abre, e não uma página de outra conta.
3. **Given** a credencial é recusada, **When** a pessoa lê a entrada, **Then** vê "E-mail ou senha incorretos. Confira os dados e tente de novo." E-mail e senha digitados continuam. Não há frase só no e-mail nem só na senha. Não há sessão.
4. **Given** a senha tem 7 caracteres e o e-mail está preenchido, **When** a pessoa tenta entrar, **Then** a frase é a mesma de credencial recusada, e não "Use pelo menos 8 caracteres."

---

### User Story 3 - Criar conta (Priority: P1)

Criar conta pede Nome, E-mail e Senha, o botão Cadastrar e o link Já tenho conta. A marca e as duas larguras são as da entrada. Senha com menos de 8 caracteres mostra "Use pelo menos 8 caracteres." no campo senha, e nada é gravado. Com nome, e-mail válido e senha de 8 caracteres, a conta é criada e o Resumo abre. Um segundo acionamento antes do primeiro terminar não cria outra conta.

**Why this priority**: A conta nova é o começo do orçamento. A senha curta não pode gravar.

**Independent Test**: Cadastrar com senha de 7 caracteres e ver a frase no campo senha, sem conta nova. Cadastrar com 8 caracteres e chegar ao Resumo de uma conta nova.

**Acceptance Scenarios**:

1. **Given** a pessoa abre Criar conta, **When** a página aparece em 1280 px, **Then** a coluna esquerda é a mesma de Entrar e o formulário mostra Criar conta, Nome, E-mail, Senha, Cadastrar e Já tenho conta.
2. **Given** a senha tem 7 caracteres e o restante está preenchido, **When** a pessoa cadastra, **Then** o campo senha mostra "Use pelo menos 8 caracteres." e nenhuma conta é criada.
3. **Given** nome, e-mail válido e senha de 8 caracteres, **When** a pessoa cadastra, **Then** a conta é criada, a sessão começa e o Resumo abre. Os dados são os dessa conta.
4. **Given** o cadastro ainda não terminou, **When** a pessoa aciona Cadastrar de novo, **Then** continua uma conta só.
5. **Given** o e-mail já pertence a uma conta, **When** a pessoa cadastra, **Then** vê "Já existe uma conta com esse e-mail." Nenhuma segunda conta é criada. Nome, e-mail e senha continuam nos campos.

---

### User Story 4 - Esqueci a senha (Priority: P1)

Esqueci a senha pede o e-mail, explica "Enviaremos um link para você criar uma nova senha." e oferece Enviar link e Voltar para entrar. Depois do envio, a pessoa vê a confirmação: o aviso "Enviamos o link para {e-mail}. Confira também o spam.", o título Verifique seu e-mail, a frase "O link vale por 30 minutos. Se não chegar, você pode pedir outro.", Voltar para entrar e Reenviar link. O e-mail citado é o que ela digitou. A mesma confirmação aparece se aquele e-mail não tiver conta. A tela não diz que o e-mail existe e não diz que o e-mail não existe.

**Why this priority**: A recuperação devolve o acesso. A confirmação diferente revelaria quem tem conta.

**Independent Test**: Enviar um e-mail que tem conta e outro que não tem. As duas confirmações coincidem, trocando só o endereço digitado. Nenhuma das duas diz se a conta existe.

**Acceptance Scenarios**:

1. **Given** a pessoa abre Esqueci a senha, **When** a página aparece, **Then** vê o título Esqueci a senha, "Enviaremos um link para você criar uma nova senha.", o campo E-mail, Enviar link e Voltar para entrar. A marca segue a largura, como em Entrar.
2. **Given** o e-mail está preenchido, **When** a pessoa envia, **Then** vê "Enviamos o link para {e-mail}. Confira também o spam.", Verifique seu e-mail, "O link vale por 30 minutos. Se não chegar, você pode pedir outro.", Voltar para entrar e Reenviar link.
3. **Given** o e-mail não tem conta, **When** a pessoa envia, **Then** a confirmação é a mesma do e-mail que tem conta, com o endereço digitado. A página não diz que a conta existe e não diz que a conta não existe.
4. **Given** a confirmação está aberta, **When** a pessoa reenvia, **Then** continua na mesma confirmação, com o mesmo endereço, sem uma frase nova sobre a existência da conta.
5. **Given** a pessoa já tem sessão e abre Esqueci a senha, **When** a página aparece, **Then** a recuperação abre e a sessão continua.

---

### User Story 5 - Sessão expirada e sair (Priority: P2)

Quando a sessão que estava aberta vence, a entrada abre sem sessão, com o aviso "Sua sessão expirou. Entre de novo para continuar. Nada do que você digitou foi perdido." O Resumo não abre até a pessoa entrar de novo. Sair da conta, confirmado em Ajustes, encerra a sessão e mostra Entrar sem esse aviso e sem o diálogo ainda aberto. Cancelar em Ajustes mantém a sessão.

**Why this priority**: Entrar e criar conta já entregam o acesso. Este estado evita que a pessoa continue numa sessão que não existe, e distingue sair de sessão vencida.

**Independent Test**: Encerrar uma sessão vencida e ver o aviso em Entrar, sem abrir o Resumo. Confirmar Sair da conta e ver Entrar sem esse aviso. Cancelar e continuar na conta.

**Acceptance Scenarios**:

1. **Given** a sessão venceu, **When** a entrada abre, **Then** não há sessão, a casca não aparece e o aviso diz "Sua sessão expirou. Entre de novo para continuar. Nada do que você digitou foi perdido." O campo senha está vazio.
2. **Given** a sessão venceu, **When** a pessoa abre o Resumo sem entrar de novo, **Then** continua na entrada, com o aviso, e o orçamento não abre.
3. **Given** a pessoa confirma Sair da conta, **When** a sessão acaba, **Then** Entrar aparece, sem o aviso de sessão expirada, sem o diálogo e sem a casca.
4. **Given** o diálogo Sair da conta está aberto, **When** a pessoa cancela, **Then** a sessão continua e a entrada não substitui a conta.

---

### User Story 6 - Campo vazio, falha e leitura (Priority: P2)

Campo vazio não envia. E-mail vazio mostra "Informe o e-mail." Senha vazia em Entrar mostra "Informe a senha." Nome vazio mostra "Informe o nome." E-mail que não é um endereço mostra "Informe um e-mail válido." no campo. Falha ao concluir mostra "Não foi possível salvar. Os campos continuam preenchidos." e não cria sessão nem conta pela metade.

Cada campo tem rótulo visível ligado. O foco é visível. Pelo teclado a pessoa alcança os campos, Esqueci a senha, os botões e os links. A entrada continua legível no claro e no escuro. Com menos movimento, o aviso aparece sem animação. Conta de outra pessoa não abre.

**Why this priority**: O caminho feliz já entrega a conta. Sem a frase no campo vazio, a pessoa não sabe o que falta. Sem o foco, o formulário não se completa pelo teclado.

**Independent Test**: Enviar Entrar vazio e ler as duas frases, sem sessão. Provocar a falha ao cadastrar e ver a frase de falha com os campos ainda preenchidos. Percorrer Entrar só pelo teclado, com o foco visível.

**Acceptance Scenarios**:

1. **Given** Entrar está vazio, **When** a pessoa aciona Entrar, **Then** vê "Informe o e-mail." e "Informe a senha." e nada é enviado.
2. **Given** o e-mail não é um endereço, **When** a pessoa envia Entrar, Criar conta ou Esqueci a senha, **Then** o campo mostra "Informe um e-mail válido." e nada é enviado.
3. **Given** o cadastro ou o envio do link falha, **When** a pessoa lê a página, **Then** vê "Não foi possível salvar. Os campos continuam preenchidos." O que foi digitado continua. Nenhuma conta nova aparece.
4. **Given** o foco está no primeiro campo, **When** a pessoa usa o teclado, **Then** ela alcança os campos, Esqueci a senha, o botão principal e o link. O foco é visível no claro, no escuro e com menos movimento.

---

### Edge Cases

- Em 720 px valem as duas colunas. Em 719 px vale uma. Em 390 px e em 1280 px a casca das cinco áreas não aparece para quem não tem sessão.
- Credencial recusada deixa e-mail e senha nos campos. A frase é uma só e não escolhe o campo. Senha com 7 caracteres na entrada usa essa frase, não a frase de 8 caracteres.
- Senha com 8 caracteres no cadastro segue. Senha com 7 não grava. Espaço conta na senha. Espaço só nas pontas do e-mail não conta.
- "Já existe uma conta com esse e-mail." não cria segunda conta. Os três campos continuam preenchidos.
- Esqueci a senha mostra a mesma confirmação com ou sem conta naquele e-mail. O endereço citado é o digitado. Reenviar não acrescenta outra frase sobre a existência da conta.
- Sessão vencida abre o aviso e não abre o Resumo. Sair confirmado abre Entrar sem esse aviso. Cancelar não encerra a sessão.
- O aviso de sessão expirada não recupera um formulário que não foi salvo. O que já estava gravado no orçamento continua para quando a pessoa entrar de novo.
- Campo vazio ou e-mail inválido não envia. Falha ao concluir não grava pela metade e não cria sessão.
- Um segundo acionamento antes do primeiro terminar não cria segunda conta nem repete o envio.
- Quem já tem sessão e abre Entrar ou Criar conta vai ao Resumo. Esqueci a senha, aberto com sessão, não encerra a sessão.
- Nome e e-mail do artboard são exemplo. A entrada não exige uma pessoa fixa.
- Dado de outra conta não aparece depois de entrar, nem no retorno à página que a pessoa pedia.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A partir de 720 px, Entrar, Criar conta, Esqueci a senha, a confirmação do link e a sessão expirada MUST mostrar duas colunas. A coluna esquerda MUST mostrar a marca, Meu Orçamento, "O que ainda cabe neste mês." e "Entre para ver o que ainda cabe no mês." A coluna do formulário MUST ser o bloco de 400 px.
- **FR-002**: Abaixo de 720 px, essas telas MUST mostrar uma coluna. A marca MUST estar centralizada, com Meu Orçamento e "O que ainda cabe neste mês." acima do formulário. A frase "Entre para ver o que ainda cabe no mês." MUST NOT aparecer. O título do formulário MUST continuar.
- **FR-003**: Sem sessão, essas telas MUST NOT mostrar a casca com Resumo, Orçamento, Lançamentos, Ano e Ajustes. Com sessão, abrir Entrar ou Criar conta MUST levar ao Resumo.
- **FR-004**: Entrar MUST oferecer E-mail, Senha, Esqueci a senha, Entrar e Criar conta. Credencial da própria conta MUST abrir o Resumo. Se a pessoa tinha sido levada à entrada a partir de uma página da própria conta, a credencial aceita MUST abrir essa página. Credencial aceita MUST NOT abrir dado de outra conta.
- **FR-005**: Credencial recusada MUST mostrar só "E-mail ou senha incorretos. Confira os dados e tente de novo." MUST NOT dizer qual dos dois falhou e MUST NOT colocar uma frase própria em um dos campos. E-mail e senha digitados MUST continuar. MUST NOT haver sessão. Senha com 7 caracteres na entrada MUST usar essa mesma frase.
- **FR-006**: Criar conta MUST oferecer Nome, E-mail, Senha, Cadastrar e Já tenho conta. Senha com menos de 8 caracteres MUST mostrar "Use pelo menos 8 caracteres." no campo senha e MUST NOT criar conta. Nome, e-mail válido e senha de 8 caracteres MUST criar a conta, MUST iniciar a sessão e MUST abrir o Resumo dessa conta.
- **FR-007**: E-mail já usado no cadastro MUST mostrar "Já existe uma conta com esse e-mail." MUST NOT criar outra conta e MUST manter nome, e-mail e senha nos campos.
- **FR-008**: Esqueci a senha MUST oferecer a frase "Enviaremos um link para você criar uma nova senha.", E-mail, Enviar link e Voltar para entrar. Depois do envio, a pessoa MUST ver "Enviamos o link para {e-mail}. Confira também o spam.", Verifique seu e-mail, "O link vale por 30 minutos. Se não chegar, você pode pedir outro.", Voltar para entrar e Reenviar link. O e-mail citado MUST ser o digitado.
- **FR-009**: A confirmação do link MUST ser a mesma quando o e-mail tem conta e quando não tem. MUST NOT dizer que a conta existe e MUST NOT dizer que a conta não existe. Reenviar MUST permanecer nessa confirmação, sem frase nova sobre a existência da conta. Abrir Esqueci a senha com sessão MUST NOT encerrar a sessão.
- **FR-010**: Sessão vencida MUST abrir a entrada sem sessão e com o aviso "Sua sessão expirou. Entre de novo para continuar. Nada do que você digitou foi perdido." O Resumo MUST NOT abrir até a pessoa entrar de novo. O campo senha MUST estar vazio.
- **FR-011**: Confirmar Sair da conta MUST encerrar a sessão e MUST mostrar Entrar, sem o aviso de sessão expirada, sem o diálogo e sem a casca. Cancelar MUST manter a sessão. O diálogo em si permanece o da história 047.
- **FR-012**: E-mail vazio MUST mostrar "Informe o e-mail." Senha vazia em Entrar MUST mostrar "Informe a senha." Nome vazio MUST mostrar "Informe o nome." E-mail que não é um endereço MUST mostrar "Informe um e-mail válido." Esses casos MUST NOT enviar. Espaço só nas pontas do e-mail MUST ser ignorado. Espaço na senha MUST contar para os 8 caracteres.
- **FR-013**: Falha ao concluir Entrar, Criar conta ou o envio do link MUST mostrar "Não foi possível salvar. Os campos continuam preenchidos." O que foi digitado MUST continuar. MUST NOT criar conta nem sessão pela metade.
- **FR-014**: Um segundo acionamento antes do primeiro terminar MUST NOT repetir a criação da conta nem o envio.
- **FR-015**: Cada campo MUST ter rótulo visível ligado. O foco MUST ser visível. Campos, Esqueci a senha, botões e links MUST ser alcançáveis pelo teclado. A entrada MUST permanecer legível no claro e no escuro. Com menos movimento, o aviso MUST aparecer sem animação.

### Key Entities

- **Conta**: nome, e-mail e senha. A senha nova tem no mínimo 8 caracteres. Um e-mail pertence a uma conta.
- **Sessão**: o acesso aberto neste navegador. Credencial aceita ou cadastro concluído a inicia. Sair e sessão vencida a encerram.
- **Link de recuperação**: o pedido feito com o e-mail digitado. A confirmação é a mesma com ou sem conta nesse e-mail. A tela diz que o link vale 30 minutos.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em 1280 px e em 720 px a pessoa vê duas colunas, com "Entre para ver o que ainda cabe no mês." só na esquerda e o formulário no bloco de 400 px. Em 719 px e em 390 px vê uma coluna, com a marca acima do formulário e sem essa frase. Nas quatro larguras, quem não tem sessão não vê as cinco áreas.
- **SC-002**: Com a senha da conta, a pessoa chega ao Resumo. Com a senha trocada, lê "E-mail ou senha incorretos. Confira os dados e tente de novo.", encontra e-mail e senha ainda preenchidos e permanece sem sessão. Senha de 7 caracteres na entrada usa essa frase.
- **SC-003**: No cadastro, senha de 7 caracteres mostra "Use pelo menos 8 caracteres." e não cria conta. Nome, e-mail válido e senha de 8 caracteres criam a conta e abrem o Resumo em menos de 2 minutos. E-mail já usado mostra "Já existe uma conta com esse e-mail." e não cria segunda conta.
- **SC-004**: O envio de um e-mail com conta e o de um e-mail sem conta mostram a mesma confirmação, com o endereço digitado e a frase de 30 minutos. Nenhuma das duas diz se a conta existe. Reenviar não acrescenta essa informação.
- **SC-005**: Sessão vencida mostra o aviso e não abre o Resumo. Confirmar Sair mostra Entrar sem esse aviso. Cancelar mantém a sessão. Pelo teclado, o foco percorre os campos e as ações de Entrar, no claro e no escuro.

## Assumptions

- A aparência vem da história 040. A casca das cinco áreas é a história 042 e só aparece depois da sessão. A confirmação de Sair da conta, com Cancelar e Sair, é a história 047. A branch de trabalho é `rebuild-web`. O app do celular fica para a história 051 e não desenha estas páginas. A remoção do front antigo continua na história 049.
- A spec curta anterior, com status `ready`, já fechava as duas colunas a partir de 720 px, a coluna única abaixo disso, a credencial com uma frase só, a senha mínima de 8 caracteres, a confirmação do link sem revelar se o e-mail tem conta, o aviso de sessão expirada e a volta à entrada depois de sair. Esta versão guarda essas decisões e descreve o que a pessoa vê.
- O mecanismo de conta e sessão já entregue permanece. Esta história não troca esse mecanismo, não acrescenta login social e não cria sessão por outro meio.
- O artboard de credencial errada desenha os dois campos no estado de erro e uma frase só: "E-mail ou senha incorretos. Confira os dados e tente de novo." A spec curta pede que o erro não aponte o campo. As duas coisas ficam juntas: a frase não escolhe e-mail nem senha, nenhum campo ganha frase própria, e o estado desenhado é o dos dois campos. Os valores digitados continuam.
- O artboard do link enviado cita o endereço. A confirmação é a mesma com ou sem conta. O endereço é o que a pessoa digitou, não uma descoberta de que a conta existe. A página não diz "não encontramos" nem "este e-mail está cadastrado".
- A frase "O link vale por 30 minutos." é a do artboard. Escolher a nova senha depois de abrir o link não tem artboard e não entra nesta história.
- O artboard `web-sair` desenha o diálogo sobre a entrada. O diálogo e o cancelar ficam em Ajustes, na história 047. Aqui, depois de confirmar, a pessoa vê Entrar, sem diálogo e sem o aviso de sessão expirada. Cancelar não traz a entrada no lugar da conta.
- O aviso de sessão expirada usa a frase do artboard, inclusive "Nada do que você digitou foi perdido." O que já estava gravado no orçamento continua. Esta história não restaura um formulário que não foi salvo. O e-mail desenhado no artboard é exemplo, não um usuário fixo. A senha desse estado fica vazia.
- Os artboards web estão em 1280 px. A coluna única usa como apoio `telas-app/entrar`, com a marca centralizada e "O que ainda cabe neste mês." Cada formulário web mantém o próprio título, para Criar conta, Esqueci a senha e Verifique seu e-mail continuarem nomeados. O artboard estreito de Entrar não repete o título Entrar.
- As telas atuais têm subtítulos e o link "Voltar ao login" que o artboard não usa. Valem os textos do artboard: sem "Use o e-mail e a senha da sua conta.", sem "Leva menos de um minuto para começar." e sem "Informe o e-mail da conta para receber o link." O retorno se chama "Voltar para entrar". O botão do cadastro se chama "Cadastrar". O outro link se chama "Já tenho conta".
- E-mail já usado não está desenhado. A pessoa vê "Já existe uma conta com esse e-mail." e a conta anterior permanece a única. Os campos continuam preenchidos.
- Campo vazio e e-mail inválido não estão desenhados. As frases seguem o jeito do produto: "Informe o nome.", "Informe o e-mail.", "Informe a senha." e "Informe um e-mail válido." Falha ao concluir usa "Não foi possível salvar. Os campos continuam preenchidos."
- Quem já entrou e abre Entrar ou Criar conta vai ao Resumo. Esqueci a senha continua alcançável com a sessão aberta, como a história 047 já pediu, e não encerra essa sessão.
- Senha com menos de 8 caracteres só é barrada no cadastro, no campo senha. Na entrada, a mesma senha curta cai na frase única de credencial, para a página não revelar outro motivo.
- Espaço nas pontas do e-mail é ignorado. Espaço no meio do e-mail continua inválido. A senha não perde espaços. O nome só com espaço vale como vazio e mostra "Informe o nome."
- Victor Fagundes e victor@email.com, desenhados nos artboards, são exemplo. A regra não prende a entrada a essa pessoa.
