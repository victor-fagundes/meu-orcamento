---

description: "Task list for the Android finish"
---

# Tasks: Acabamento do Android

**Input**: Design documents from `/specs/039-acabamento-android/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/aparencia-android.md, contracts/ajustes-api.md, quickstart.md

**Tests**: O plano não pede teste novo. A regra de competência já tem teste de domínio. A prova desta história é o roteiro no aparelho.

**Organization**: História 1 é a gaveta e a splash. História 2 é a entrada. História 3 é o Resumo. Histórias 4 e 5 são Orçamento e as telas de apoio, com a API que falta para Ajustes. Spec `Draft`: estas tarefas não autorizam código antes de `ready`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode correr em paralelo (arquivos diferentes, sem depender de tarefa incompleta)
- **[Story]**: História a que a tarefa pertence

## Path Conventions

- App: `android/app/src/main/`
- API nova: `src/app/api/v1/`
- Domínio existente, sem cópia no app: `src/domain/competencia.ts`, `src/application/itens.ts`, `src/application/catalog.ts`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Fonte, versão instalável por cima e o recorte já decidido no plano.

- [x] T001 Subir `versionCode` de 1 para 2 em `android/app/build.gradle.kts`. `versionName` permanece `1.0.0`. Não adicionar dependência de splash
- [x] T002 [P] Colocar os arquivos estáticos OFL da Manrope, pesos 500, 700 e 800, em `android/app/src/main/res/font/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Tipo e linha que todas as telas usam.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Registrar a Manrope de `android/app/src/main/res/font/` como família em `android/app/src/main/java/app/meuorcamento/ui/theme/Tema.kt` e aplicá-la no `MaterialTheme`. O número principal fica extra-negrito e maior que o título da barra e que o corpo. Manter as cores da spec 038: azul `#0058BE`, contentor `#D7E3FF`, aviso `#8A7000` no claro e `#D7B07A` no escuro, erro `#BA1A1A` no claro e `#FFB4AB` no escuro. Amarelo `#FFE600` só na marca
- [x] T004 [P] Criar a linha compartilhada em `android/app/src/main/java/app/meuorcamento/ui/LinhaValor.kt`. "Nome cede espaço. Detalhe opcional, por baixo. Valor à direita, na mesma linha, sempre visível. Altura estável."

**Checkpoint**: O app abre com a Manrope. As telas ainda compõem as listas à moda da spec 038.

---

## Phase 3: User Story 1 - Reconhecer o app antes de entrar (Priority: P1) 🎯 MVP

**Goal**: A gaveta e a abertura são a letra M no amarelo, e o app fica em pé.

**Independent Test**: Instalar, olhar o ícone na gaveta clara e na escura, abrir pelo ícone e ver a marca amarela antes da primeira tela, sem flash branco.

### Implementation for User Story 1

- [x] T005 [US1] Trocar o ícone adaptativo em `android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml` e `android/app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml`. Fundo `#FFE600`. Frente é a letra M em `#221B00`, dentro da zona segura, em `android/app/src/main/res/drawable/`. Incluir a camada de uma cor só para a gaveta escura
- [x] T006 [US1] Em `android/app/src/main/AndroidManifest.xml`, apontar `android:icon` e `android:roundIcon` para esse mipmap e fixar a atividade em pé. Em `android/app/src/main/res/values/themes.xml`, a splash nativa do Android 12 usa fundo `#FFE600` e a mesma marca, antes da entrada ou do Resumo, sem tela branca

**Checkpoint**: Gaveta e splash batem com o quadro Ícone e o quadro Splash. A entrada ainda é a da spec 038.

---

## Phase 4: User Story 2 - Entrar com uma frase e um botão (Priority: P1)

**Goal**: Quem não tem sessão vê a marca, a frase e um único botão preenchido.

**Independent Test**: Abrir sem sessão, ler "O que ainda cabe neste mês.", entrar com uma conta válida e chegar ao Resumo.

### Implementation for User Story 2

- [x] T007 [US2] Recompor `android/app/src/main/java/app/meuorcamento/ui/auth/LoginScreen.kt`. Marca em tamanho de abertura, "Meu Orçamento", a frase "O que ainda cabe neste mês.", E-mail, Senha, um botão preenchido "Entrar" na largura e "Criar conta" em texto. No cadastro: Nome, botão "Cadastrar", texto "Já tenho conta", sem a frase. Falha, falta de rede e conta de demonstração na versão publicada mantêm o desfecho atual. Na versão de desenvolvimento, a conta de demonstração continua podendo entrar

**Checkpoint**: A entrada bate com o quadro Entrar. O Resumo ainda pode estar na composição da spec 038.

---

## Phase 5: User Story 3 - Ler o mês com o mesmo desenho de linha (Priority: P1)

**Goal**: O Resumo mostra o número mais pesado, o medidor com trilha e as quatro linhas.

**Independent Test**: No mês corrente, com plano e gasto, o valor que ainda pode gastar é o maior e o mais pesado texto, e tocar "Despesas fixas" abre o Orçamento em fixas.

### Implementation for User Story 3

- [x] T008 [US3] Recompor `android/app/src/main/java/app/meuorcamento/ui/resumo/ResumoScreen.kt` nesta ordem: "Ainda pode gastar" ou "Passou do orçado", número principal, frase, medidor com trilha, quatro linhas usando `android/app/src/main/java/app/meuorcamento/ui/LinhaValor.kt`. Medidor: "Dentro do plano, abaixo de 80%: azul `#0058BE`. De 80% até 100%, inclusive chegou: aviso. Acima de 100%: erro. Plano zero: aviso, sem inventar porcentagem." Mês sem plano e sem gasto mostra zero legível e as quatro linhas. Valor longo reduz sem cortar dígito. Não alterar o cálculo das specs 028 e 031

**Checkpoint**: O Resumo bate com o quadro. O Orçamento ainda pode usar os chips da spec 038.

---

## Phase 6: User Story 4 - Acompanhar o Orçamento no controle segmentado (Priority: P2)

**Goal**: Um controle só, o mesmo número de destaque e o plano do item como no quadro.

**Independent Test**: Abrir Despesas fixas, ver um grupo dentro do plano, um perto do limite e um estourado, abrir o plano de um item e cancelar sem gravar.

### Implementation for User Story 4

- [x] T009 [US4] Recompor `android/app/src/main/java/app/meuorcamento/ui/orcamento/OrcamentoScreen.kt`. Um controle com rótulos Receitas, Fixas, Variáveis e Anuais. O ativo usa `#D7E3FF`. "Ainda cabe em {tipo}" usa o nome completo do tipo em minúsculas e o mesmo peso do Resumo. Cada grupo é `LinhaValor` mais o medidor da história 3. Grupos com plano e realizado zerados só depois de "Sem movimento neste mês", e continuam abríveis. O painel sobe pela base, com alça, canto superior arredondado, nome do item, foco no campo do mês, Cancelar e a ação principal no pé, e "Arquivar {nome}". Cancelar, toque fora e voltar não gravam

**Checkpoint**: O Orçamento e o plano batem com os quadros. Lançamentos, Ano e Ajustes ainda podem estar na spec 038.

---

## Phase 7: User Story 5 - Lançamentos, Ano e Ajustes na mesma linha (Priority: P2)

**Goal**: As três telas usam a linha padrão. Ajustes lista a conta e os nove menus do site, e cada menu abre o mesmo fluxo.

**Independent Test**: Abrir um mês com lançamentos, o ano com valores e Ajustes. Os números de Lançamentos e Ano são os de hoje. Ajustes mostra a conta e os nove menus, com ícone, e cada menu abre o fluxo do site.

### Implementation for User Story 5

- [x] T010 [P] [US5] Criar `src/app/api/v1/competencia/simular/route.ts`. `POST` com data `AAAA-MM-DD`, parcelas inteiras de 1 a 60 e dia de fechamento 1–28 ou ausente. Chamar `competenciasParcelas` em `src/domain/competencia.ts`. Resposta: primeira competência `AAAA-MM` ou vazia, e a lista das parcelas. Data ilegível: 400. Nada é gravado. Não portar a regra para Kotlin
- [x] T011 [P] [US5] Em `src/app/api/v1/itens/route.ts`, `GET` com `escopo=arquivados` devolve só arquivados via `listItensArquivados`, cada um com id, tipo, grupo e nome. Sem `escopo`, ou com outro valor, a lista ativa de hoje permanece
- [x] T012 [P] [US5] Criar `src/app/api/v1/catalogo/exemplo/route.ts`. `POST` chama `applyExamplePlans` e devolve `{ "ok": true, "updated": N }`. Não cria lançamento
- [x] T013 [P] [US5] Recompor as linhas de `android/app/src/main/java/app/meuorcamento/ui/lancamentos/LancamentosScreen.kt` com `LinhaValor`: descrição, detalhe "data · item · meio", valor à direita. Um único botão preenchido "Registrar" com itens ou com o mês vazio. O formulário aberto esconde esse botão
- [x] T014 [P] [US5] Em `android/app/src/main/java/app/meuorcamento/ui/ano/AnoScreen.kt`, os doze meses mostram o valor na mesma linha do nome. A barra continua com o ano confirmado. A grade só troca depois da resposta. Se falhar, o ano confirmado permanece
- [x] T015 [US5] Trocar o miolo de `android/app/src/main/java/app/meuorcamento/ui/ajustes/AjustesScreen.kt` pela lista do quadro: conta com ícone de pessoa, e-mail, "Esqueci a senha" e "Sair" com confirmação; depois Cartões, Limites de alerta, Importar planilha, Importar fatura, Exportar, Simulador de competência, Itens arquivados, Dados de exemplo e Excluir conta. Cada menu tem o ícone Material do site e o mesmo subtítulo. O ícone é azul, exceto Excluir conta, que é vermelho
- [x] T016 [US5] Criar `android/app/src/main/java/app/meuorcamento/ui/ajustes/SimuladorScreen.kt`. Sem cartão ativo, a frase pede para cadastrar um. Com cartão, data e parcelas, chama `POST /api/v1/competencia/simular` e mostra o mês civil em pt-BR. Compra no dia do fechamento ou depois cai no mês seguinte. Nada é gravado
- [x] T017 [P] [US5] Criar `android/app/src/main/java/app/meuorcamento/ui/ajustes/ArquivadosScreen.kt`. Lista somente leitura de `GET /api/v1/itens?escopo=arquivados`: tipo, grupo e nome. Não desarquiva e não devolve o item à lista ativa
- [x] T018 [P] [US5] Criar `android/app/src/main/java/app/meuorcamento/ui/ajustes/ExemploScreen.kt`. O primeiro toque pede confirmação. O segundo envia `POST /api/v1/catalogo/exemplo` e mostra quantos itens mudaram. Não cria lançamento
- [x] T019 [P] [US5] Criar `android/app/src/main/java/app/meuorcamento/ui/ajustes/ExcluirContaScreen.kt`. Primeiro passo: "Quero excluir minha conta…". Depois o campo pede a frase `EXCLUIR` e chama `DELETE /api/v1/conta`. Frase diferente não apaga e mostra "Digite EXCLUIR para confirmar.". Frase certa encerra a sessão e volta à entrada
- [x] T020 [US5] Em `android/app/src/main/java/app/meuorcamento/ui/navigation/AppNav.kt`, ligar os nove menus aos destinos. Cartões, limites, importar planilha, importar fatura e exportar reaproveitam as telas atuais. Simulador, arquivados, exemplo e excluir conta usam as telas novas. Em todos, Ajustes continua selecionado na barra de baixo

**Checkpoint**: Lançamentos, Ano e Ajustes batem com os quadros. Os quatro menus novos cumprem o fluxo do site.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: A entrega instalável e o roteiro.

- [ ] T021 Gerar o APK prod debug. O nome do arquivo segue `MeuOrcamento-1.0.0-2-prodDebug.apk`. Percorrer `specs/039-acabamento-android/quickstart.md` no aparelho. Não marcar a spec como `verified`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: pode começar imediatamente
- **Foundational (Phase 2)**: depende do Setup e bloqueia as histórias
- **Histórias (Phase 3+)**: dependem da Phase 2. US2, US3, US4 e US5 não dependem da gaveta para serem testadas numa sessão já aberta
- **Polish**: depende das histórias que entrarem na entrega

### User Story Dependencies

- **User Story 1 (P1)**: depois da Phase 2. Não depende das outras
- **User Story 2 (P1)**: depois da Phase 2. Não depende da US1
- **User Story 3 (P1)**: depois da Phase 2 e de T004. Não depende da US1 nem da US2
- **User Story 4 (P2)**: depois da Phase 2, de T004 e da regra de medidor da US3
- **User Story 5 (P2)**: T013 e T014 depois da Phase 2. T016 depende de T010. T017 depende de T011. T018 depende de T012. T020 depende de T015 a T019

### Parallel Opportunities

- T001 e T002 em paralelo
- T003 e T004 em paralelo
- T010, T011, T012, T013 e T014 em paralelo
- T017, T018 e T019 em paralelo, cada uma depois da rota que usa

---

## Parallel Example: User Story 5

```text
T010  src/app/api/v1/competencia/simular/route.ts
T011  src/app/api/v1/itens/route.ts
T012  src/app/api/v1/catalogo/exemplo/route.ts
T013  android/.../lancamentos/LancamentosScreen.kt
T014  android/.../ano/AnoScreen.kt
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1 e Phase 2
2. Phase 3, gaveta e splash
3. Parar e comparar com os quadros Ícone e Splash

### Incremental Delivery

1. Setup e base
2. US1, gaveta e splash
3. US2, entrada
4. US3, Resumo
5. US4, Orçamento
6. US5, Lançamentos, Ano, Ajustes e as três rotas
7. APK com `versionCode` 2 e o roteiro do aparelho

### Parallel Team Strategy

Depois da Phase 2: uma pessoa na gaveta e na splash, outra na entrada, outra no Resumo. A API de Ajustes pode andar junto com Lançamentos e Ano.

---

## Notes

- [P] marca arquivos diferentes, sem depender de tarefa incompleta
- Spec `Draft`. Não implementar antes de `ready`
- Não copiar `competenciasParcelas` para o app
- Não alterar competência, centavos, importação, exportação, o computador nem o login do site
- `verified` continua com o PM
