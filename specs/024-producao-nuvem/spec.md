# Feature Specification: Produção na nuvem

**Feature Branch**: `024-producao-nuvem`

**Created**: 2026-11-16

**Status**: `implemented`

**Input**: User description: "Até então essa aplicação é local. O que preciso para subi-la para a nuvem e começar a rodar em produção?"

**Related**: Não muda regras de orçamento, competência, parcelas, alertas nem importação. Não fecha GAP-003, GAP-006 nem GAP-007. Não substitui a spec 023 (Material Design). A decisão de ambiente em `docs/DECISAO_DB_LOCAL_CELULAR.md` (PGlite no dev, Postgres na nuvem em produção) e o deploy em `docs/ARCHITECTURE_Meu_Orcamento.md` (app na Vercel, banco no Neon) passam a ser o escopo desta história. Telemetria continua no console (spec 018). E-mail de reset e domínio próprio ficam fora da primeira subida.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Usar o app fora do computador de desenvolvimento (Priority: P1)

Como pessoa que já usa o Meu Orçamento na própria máquina, quero abrir o mesmo app num endereço HTTPS, criar a minha conta e lançar o mês, para depender do celular e de outro computador sem subir o servidor local.

**Why this priority**: Sem um endereço público com conta real, o app continua um protótipo na máquina de dev.

**Independent Test**: No celular, fora da rede de casa, abrir o endereço de produção, criar conta, gravar um lançamento e vê-lo no Resumo.

**Acceptance Scenarios**:

1. **Given** o app publicado, **When** a pessoa abre o endereço no celular, **Then** a página carrega em HTTPS e o login não vem preenchido com `demo@local.test` nem com a senha demo.
2. **Given** uma conta nova, **When** o cadastro termina, **Then** existe um orçamento só dessa pessoa, com o catálogo inicial, e ela cai no Resumo.
3. **Given** a sessão de produção, **When** a pessoa abre Ajustes, **Then** não aparece a nota de desenvolvimento com caminho `data/pglite` nem a senha demo.

---

### User Story 2 - O mês sobrevive a um novo deploy (Priority: P1)

Como pessoa que passou a usar o app de verdade, quero que lançamentos, plano e cartões continuem lá depois de eu fechar o celular e depois de uma nova publicação, para tratar esses dados como os do mês e não como rascunho local.

**Why this priority**: O banco de hoje é um arquivo na pasta do projeto. Publicar sem um banco durável apaga ou isola os dados a cada instância.

**Independent Test**: Gravar um lançamento em produção, publicar de novo (ou esperar a instância encerrar) e confirmar o mesmo valor no mesmo mês.

**Acceptance Scenarios**:

1. **Given** um lançamento gravado em produção, **When** o app é publicado outra vez, **Then** o lançamento, o plano e os cartões dessa conta continuam iguais.
2. **Given** o ambiente de desenvolvimento sem endereço de banco na nuvem, **When** alguém roda o app local, **Then** ele continua no banco local de teste e a conta demo segue disponível só nesse ambiente.
3. **Given** dados que existem só na pasta local de teste, **When** a produção sobe pela primeira vez, **Then** essa pasta não é copiada. Produção começa vazia, fora o catálogo criado no cadastro.

---

### User Story 3 - A conta do outro não aparece (Priority: P1)

Como pessoa com dados reais no app publicado, quero que outra conta no mesmo endereço veja só o próprio orçamento, para dividir o link sem misturar meses.

**Why this priority**: O isolamento por orçamento já existe no local. Produção com várias contas torna isso visível.

**Independent Test**: Duas contas no endereço de produção. Um lançamento feito na primeira não aparece na segunda.

**Acceptance Scenarios**:

1. **Given** duas contas distintas, **When** a segunda abre Resumo, Orçamento, Lançamentos, Ano e Ajustes, **Then** não vê lançamentos, itens nem cartões da primeira.
2. **Given** um identificador de lançamento da outra conta, **When** a segunda tenta abri-lo ou apagá-lo, **Then** o app responde como se não existisse.

---

### User Story 4 - Produção não sobe com segredo de desenvolvimento (Priority: P1)

Como responsável pelo app, quero que a publicação recuse segredo ausente, segredo de desenvolvimento ou banco ausente, para não colocar a senha demo e o fallback de autenticação na internet.

**Why this priority**: Hoje o servidor aceita um segredo fixo de desenvolvimento se a variável não existir.

**Independent Test**: Tentar o modo de produção sem as variáveis obrigatórias e ver a subida falhar antes de atender login.

**Acceptance Scenarios**:

1. **Given** produção sem endereço de banco, ou sem segredo, ou com o segredo de desenvolvimento, **When** o servidor trata o primeiro pedido que abre o banco ou a autenticação, **Then** ele falha com erro explícito e não cria a conta demo.
2. **Given** produção com segredo próprio e endereço HTTPS do app, **When** a pessoa entra, **Then** a sessão usa esse endereço. O segredo não aparece na tela nem no repositório.

---

### User Story 5 - Arquivo grande demais explica o limite (Priority: P2)

Como pessoa importando planilha ou PDF no app publicado, quero uma mensagem clara quando o arquivo passa do que o hosting aceita, para não ver uma falha genérica.

**Why this priority**: O guarda local aceita 10 MB. O hosting desta subida corta o pedido perto de 4,5 MB. Planilha e fatura usuais cabem abaixo disso. A história 1 já entrega o app; esta evita um erro opaco na importação.

**Independent Test**: Enviar um arquivo de 5 MB na importação publicada e ler a mensagem de limite. Enviar um arquivo de 1 MB e seguir o fluxo atual de importação.

**Acceptance Scenarios**:

1. **Given** uma planilha ou PDF acima de 4 MB, **When** a pessoa envia no app publicado ou no local, **Then** a importação não grava nada e a mensagem diz que o limite é 4 MB.
2. **Given** um arquivo dentro de 4 MB, **When** a pessoa importa, **Then** o comportamento continua o das specs de importação já verificadas.

---

### User Story 6 - Esqueci a senha não aponta para o terminal (Priority: P2)

Como pessoa na produção que esqueceu a senha, quero uma tela que não me mande olhar o terminal do servidor, para eu entender que o link por e-mail ainda não existe.

**Why this priority**: O reset de hoje só escreve o link no log. Em produção isso vaza o link nos logs do hosting e a frase atual é de teste local. Enviar e-mail de verdade fica para outra história, quando houver domínio de envio.

**Independent Test**: Pedir reset em produção e ler a mensagem. Confirmar que o log do hosting não contém o link.

**Acceptance Scenarios**:

1. **Given** produção sem serviço de e-mail, **When** a pessoa pede reset, **Then** a tela diz que o envio do link ainda não está disponível e não cita terminal nem log.
2. **Given** o mesmo pedido, **When** o servidor registra o evento, **Then** o link de redefinição não entra no log.
3. **Given** o ambiente local, **When** a pessoa pede reset, **Then** o comportamento atual de teste pode continuar (link no terminal).

---

### Edge Cases

- Produção com banco configurado e segredo ausente não pode cair no segredo fixo do código.
- Duas publicações seguidas não podem criar um segundo orçamento para a mesma conta.
- A primeira abertura depois de um período ocioso pode demorar alguns segundos (compute do banco suspenso). O dado continua lá.
- Arquivo vazio ou ilegível segue o erro das specs de importação. Esta história só muda o teto de tamanho.
- Cadastro com e-mail já usado continua rejeitado. Não há conta demo nesse banco.
- Exclusão de conta continua imediata, como hoje. Retenção de 30 dias não entra nesta história.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O app publicado deve atender em HTTPS, num endereço estável, sem exigir o servidor de desenvolvimento ligado.
- **FR-002**: Contas de produção devem ser criadas pela tela de cadastro já existente. Cada conta nova ganha o próprio orçamento e o catálogo inicial.
- **FR-003**: Lançamentos, itens, cartões, planos e limites devem permanecer depois de fechar o navegador e depois de uma nova publicação.
- **FR-004**: O banco local de teste e a conta demo só existem quando o app roda sem endereço de banco na nuvem. Produção não cria `demo@local.test`.
- **FR-005**: A primeira publicação não importa a pasta de dados local.
- **FR-006**: Toda leitura e escrita continua limitada ao orçamento da sessão. Identificador de outro orçamento segue invisível.
- **FR-007**: Em produção, endereço de banco, segredo de autenticação e endereço público do app são obrigatórios. Segredo ausente ou igual ao de desenvolvimento impede o uso da autenticação.
- **FR-008**: Segredos não entram no repositório nem na interface.
- **FR-009**: Planilha e PDF acima de 4 MB são recusados com mensagem explícita, no local e na produção. Até 4 MB, a importação não muda de regra.
- **FR-010**: Em produção, “Esqueci a senha” não promete link no terminal e o servidor não grava o link de reset. O envio por e-mail fica fora desta história.
- **FR-011**: A nota de desenvolvimento em Ajustes não aparece em produção.
- **FR-012**: Mudança de schema só vai para o ar depois que a migração correspondente tiver sido aplicada no banco de produção.

### Key Entities

- **Conta**: e-mail, nome e senha. Já existe. Produção não adiciona campo.
- **Orçamento**: um por conta, como hoje. Nenhum dado novo.
- **Ambiente publicado**: endereço HTTPS, segredo e banco durável. Não é tabela. É configuração fora do repositório.
- **Banco de produção**: as mesmas tabelas de hoje (conta, sessão, orçamento, itens, cartões, lançamentos, limites). Valores continuam em centavos inteiros.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: No celular, fora da máquina de dev, uma pessoa cria a conta e vê o Resumo em menos de 2 minutos, descontando só o tempo de digitar.
- **SC-002**: Um lançamento gravado antes de uma nova publicação continua visível depois dela, no mesmo mês e no mesmo valor.
- **SC-003**: Numa segunda conta, nenhum lançamento da primeira aparece nas cinco seções.
- **SC-004**: `npm run dev` sem endereço de banco na nuvem ainda abre o fluxo local com a conta demo.
- **SC-005**: A tela de login de produção não mostra e-mail nem senha de demonstração.
- **SC-006**: Um arquivo de 5 MB na importação recebe a mensagem de limite de 4 MB e não grava lançamento.

## Assumptions

- A primeira produção é uso pessoal (Victor e quem ele convidar no mesmo endereço), não lançamento público com marca, SLA ou loja de app.
- O hosting do app é a Vercel e o banco é o Neon, em São Paulo, como a arquitetura já fixou. Não se reabre a escolha de stack.
- O plano gratuito desses dois serviços basta para esse uso. A primeira abertura depois de um tempo parado pode levar alguns segundos. Se o app virar produto aberto ao público, o plano do hosting sobe.
- O endereço `*.vercel.app` basta no primeiro dia. Domínio próprio fica para depois.
- Não há serviço de e-mail nesta história. Reset por e-mail (e o domínio de envio) é história futura.
- PostHog, backup além do restore do próprio banco, fila, Docker local e cópia dos dados de `data/pglite` ficam de fora.
- O código desta história só começa quando o status desta spec estiver `ready`.
