# Prompt para o Cursor · Rebuild do front Web com o Design System

Salve este arquivo como `docs/PROMPT-CURSOR-web.md` no repositório e conduza o Agent em ciclos curtos (ver seção 10). Ele assume a estrutura atual do repositório `meu-orcamento`.

\---

## 0\. Contexto e regras que não podem ser quebradas

Você vai **substituir a camada de interface web** do Meu Orçamento por uma nova, construída sobre o Design System (DS) do projeto. O back-end (domínio, aplicação, banco, API, auth) **não é reescrito**, exceto pelas mudanças listadas na seção 3.

Leia antes de qualquer código, nesta ordem:

1. `AGENTS.md` (regras obrigatórias do repo: SDD, fatia vertical, centavos, sem float no domínio).
2. `docs/PRD\_Meu\_Orcamento\_v1\_0.txt` e `docs/ONEPAGER\_Meu\_Orcamento.md`.
3. `docs/design/PROJECT.md` (fonte da verdade visual).
4. O DS: `packages/design-system/` (tokens, componentes, módulos, README-USO.md, COMPONENTES.md, MODULOS.md, MICROCOPY.md, GRID.md, TEMA-ESCURO.md, IMPLEMENTACAO.md).

Regras absolutas:

* **Só use componentes do DS.** Não crie botão, campo, diálogo, banner ou medidor próprio dentro de `src/app` ou `src/components`. Se faltar componente, crie-o no DS primeiro (seção 2).
* **Proibido** hexadecimal, `px`, `rem` ou `dp` literal em estilo (objetos `style={{}}`, classes com valor arbitrário, CSS de componentes). Use variáveis CSS (`var(--space-4)`) ou tokens TS. Atributos de `<svg>` (`width={24}`), props de componentes e `sizes="100vw"` **não** são estilo e são permitidos.
* **Dinheiro sempre em centavos inteiros.** Formate só na borda com `formatarBRL` / `formatarBRLInteiro`. Entrada com `lerBRL`.
* **Textos** seguem `MICROCOPY.md` (glossário: item, categoria, lançamento, plano, realizado, competência, arquivar ≠ excluir).
* **Não altere** `src/domain/\*\*` (exceto onde a seção 3 manda), `src/db/\*\*` (exceto migrations da seção 3), `src/lib/auth\*`, `src/app/api/auth/\*\*`. Não apague testes existentes; se um teste quebrar por mudança de texto, ajuste o teste e documente.
* Uma **spec por entrega**, com status `ready` antes de codar (AGENTS.md, regra 2). Não marque `verified`; isso é do PM.
* Ao concluir uma task: marque o checkbox em `tasks.md` e os AC em `spec.md`.
* Nenhum `console.log` no código de produção. Nenhum `any`. TypeScript estrito.

Branch: crie `legacy-front` a partir do estado atual (preserva o front antigo para consulta). Trabalhe em `rebuild-web`.

\---

## 1\. Ordem de execução (uma spec por bloco, nesta ordem)

|Spec|Nome|Depende de|
|-|-|-|
|040|DS integrado ao Next (tokens, fonte, tema, componentes novos)|—|
|041|Back: categorias (criar, renomear, arquivar)|— (pode rodar em paralelo com 040)|
|042|Shell da aplicação (cabeçalho, barra lateral, barra inferior)|040|
|043|Resumo web|040, 042|
|044|Orçamento web (incl. categorias e Gerenciar)|040, 041, 042|
|045|Lançamentos web|040, 042|
|046|Ano web (tabela detalhada)|040, 042|
|047|Ajustes web (dois grupos, categorias, cartões, limites, arquivados, exemplo, exportar, excluir conta)|040, 041, 042|
|048|Entrada web (login, cadastro, esqueci a senha, sessão expirada, sair)|040|
|049|Remoção do front antigo e de `@material/web`|043–048 verified|
|050–057|**Fase 2 (mobile):** app React Native / Expo sobre o DS nativo, substituindo `android/`. Detalhes na seção 9.|040–049 verified|

Cada spec segue o template de `docs/SDD\_Meu\_Orcamento.md`: Context, Goals, Non-goals, Acceptance criteria (AC-1…AC-n, testáveis), Test plan, Open questions. Crie as specs em `specs/040-...` até `specs/049-...` antes de implementar qualquer uma.

\---

## 2\. Design System: alterações (spec 040)

### 2.1 Compatibilidade com Next.js App Router (bloqueante)

* Todo componente que usa estado, efeito, evento ou `window` recebe `'use client'` no topo. Componentes puramente de apresentação podem ser server components, mas o DS deve funcionar em ambos. Revise cada arquivo de `packages/design-system/src/web/`.
* **Ordem de checagem na 040:** primeiro `npm test` e `npx tsc --noEmit`; só depois `npm run build`. Se o build falhar por fonte ou `layout.tsx`, corrija antes de seguir para outras mudanças.
* **Fonte:** remover o `@font-face` com caminho relativo. Carregar Manrope com `next/font/local` apontando para `packages/design-system/fonts/Manrope-VariableFont\_wght.ttf` (ou copiar para `public/fonts/` se o `next/font/local` não resolver o caminho do pacote). Em `src/app/layout.tsx`, substituir `Roboto` (`next/font/google`) por esta fonte. Definir `--font-family` apontando para a variável gerada pelo `next/font`.
* **Tema sem flash:** adicionar, no `<head>` do `src/app/layout.tsx`, um `<script>` inline que lê `localStorage` (chave `mo-tema`) e a preferência do sistema e define `data-theme` no `<html>` antes do primeiro paint. Use `suppressHydrationWarning` no `<html>`.
* O `ThemeProvider` do DS passa a ler e gravar a mesma chave `mo-tema` e a expor os modos `light | dark | system`.

### 2.2 Tokens

* Gerar `tokens.css` com `npm run gen:css` (já existe no pacote) e importá-lo uma vez no layout. Nenhuma cor do `src/app/material-theme.css` ou do `globals.css` antigo deve sobreviver: remover os dois arquivos ao final (spec 049) ou substituí-los por imports dos tokens.
* Tokens de medida: adicionar à escala (se faltar) apenas valores já definidos em `GRID.md` e `TOKENS.md`. Não criar valores novos sem atualizar o `tokens.ts` e o `TOKENS.md`.

### 2.3 Componentes que faltam (criar no DS, com contrato, testes e versão web)

1. **`ShellApp`** — layout com cabeçalho, barra lateral (≥ 720 px, 240 px) e barra inferior (< 720 px), usando `NavegacaoPrincipal`. Ajustes permanece ativa nas subtelas.
2. **`Tabela`** (genérica) — colunas tipadas, cabeçalho com `scope`, linhas com seleção opcional, `caption` obrigatória, alinhamento numérico à direita, dígitos tabulares. Usada em Lançamentos e Ano (que já tem `TabelaMeses`, que pode virar uma configuração desta).
3. **`CampoBusca`** — `input type="search"`, botão de limpar com nome acessível, `aria-controls` para a lista.
4. **`CampoData`** — `input type="date"` com rótulo, formato DD/MM/AAAA na exibição, erro abaixo do campo.
5. **`Switch`** — para "Parcelar" e "Aplicar também aos próximos meses" (substitui o Checkbox nesses casos). `role="switch"`, `aria-checked`.
6. **`MenuAcoes`** — botão ⋯ com menu de ações secundárias. **Proibido** colocar ação destrutiva direta na linha; ação destrutiva fica dentro do menu com confirmação.
7. **`BotaoIcone`** — botão só com ícone, `aria-label` obrigatório pelo tipo.
8. **`Avatar`** — iniciais em círculo `--md-selected`, com `aria-hidden` quando o nome aparece ao lado.
9. **`BlocoSaldo`, `GradeTotais`, `GrupoComMedidor`, `LinhaItem`, `LinhaLancamento`, `LinhaAjuste`, `CartaoVazio`, `RodapeAcoes`, `CabecalhoTela`, `CabecalhoSheet`** já existem: revise para `'use client'` e para o uso em server components.
10. **`Dialogo` e `FormularioContainer`** — adicionar **armadilha de foco** (Tab e Shift+Tab ciclam dentro) e **devolução de foco** ao elemento que abriu, ao fechar. Testar com jsdom.

### 2.4 Ícones

Adicionar ao catálogo (`icons-paths.ts`, `ICONES.md`, `ds-icones`): `edit`, `delete` (já existe), `add`, `search`, `close`, `filter\_list`, `logout`, `more\_vert`, `expand\_more`, `expand\_less`, `arrow\_upward`, `arrow\_downward`. Mesmo conjunto (Material Icons filled, 24 px). Teste que cada nome do tipo `IconName` existe.

### 2.5 Testes do DS

* Manter os testes atuais (contraste, formatadores, sincronia do CSS, componentes).
* Novos: armadilha de foco, devolução de foco, `Switch` (aria-checked e alternância), `MenuAcoes` (abre, fecha com Esc, sem ação destrutiva fora do menu), `CampoData` (erro ligado), `Tabela` (linha selecionada, caption presente).
* **Teste visual (snapshot):** Playwright com captura de cada componente em light e dark, em 390 px e 1280 px. A baseline (`tests/visual/\_\_snapshots\_\_`) é criada **somente depois da aprovação do PM**; o agente não aprova a própria referência. Antes disso, o teste gera as capturas em `tests/visual/out/` para inspeção, sem falhar.

\---

## 3\. Back-end: alterações (spec 041 e ajustes pontuais)

### 3.1 Categorias passam a ser entidade (hoje são só `itens.grupo` em texto)

**Migration nova** (`drizzle/`, via `npm run db:generate`):

* Tabela `categorias`: `id` (text, pk), `orcamento\_id` (fk, cascade), `tipo` (`R|F|V|E`, check constraint), `nome` (text, not null), `arquivada` (boolean, default false), `criado\_em`, `atualizado\_em`. Índice único `(orcamento\_id, tipo, lower(nome))` onde `arquivada = false`.
* **Backfill** na mesma migration: para cada `(orcamento\_id, tipo, grupo)` distinto em `itens`, inserir uma linha em `categorias` com `arquivada = (todos os itens do grupo estão arquivados)`.
* Manter `itens.grupo` como texto (chave de junção por nome, por simplicidade na V1). Toda escrita de `grupo` passa a exigir que a categoria exista e esteja ativa.

**Domínio** (`src/domain/categorias.ts`, puro, com testes em `categorias.test.ts`):

* `validarNomeCategoria(nome)`: trim, 1–40 caracteres, sem quebra de linha. Retorna erro com mensagem de `MICROCOPY.md`.
* `nomeEhUnicoNoTipo(nome, tipo, existentes)`: comparação sem diferença de caixa e sem acento.
* Casos de teste obrigatórios: nome vazio, só espaços, 41 caracteres, duplicado com caixa diferente, duplicado entre tipos (permitido), renomear para o mesmo nome (permitido, no-op).

**Aplicação** (`src/application/categorias.ts`):

* `listarCategorias(db, orcamentoId, { incluirArquivadas })` — agrupa por tipo, com contagem de itens ativos.
* `criarCategoria(db, orcamentoId, { tipo, nome })` — valida, insere.
* `renomearCategoria(db, orcamentoId, categoriaId, novoNome)` — **transação**: atualiza `categorias.nome` e `itens.grupo` onde `grupo` = nome antigo e `tipo` igual. Lançamentos não mudam (referenciam o item, não o grupo).
* `arquivarCategoria(db, orcamentoId, categoriaId)` — **transação**: `categorias.arquivada = true` e `itens.arquivado = true` para todos os itens do grupo. Lançamentos continuam; o histórico não some.
* `criarItem` (já existe em `application/itens.ts`) passa a: se o `grupo` informado não existir como categoria ativa do tipo, criar a categoria na mesma transação. Este é o caminho "Novo item cria categoria".
* Todas as funções filtram por `orcamento\_id` da sessão. Item ou categoria de outro usuário → erro de não encontrado (404 na API, nunca 403).

**API** (`src/app/api/v1/categorias/route.ts` e `\[id]/route.ts`):

* `GET /api/v1/categorias?incluirArquivadas=0|1`
* `POST /api/v1/categorias` `{ tipo, nome }`
* `PATCH /api/v1/categorias/\[id]` `{ nome }`
* `POST /api/v1/categorias/\[id]/arquivar`
* Respostas de erro com `jsonError` (já existe em `lib/api-v1.ts`). Validação com zod (já é dependência).
* Testes de integração das rotas com o PGlite local, incluindo isolamento entre dois usuários.

**Server actions** (`src/app/actions/categorias.ts`): espelham os casos de uso acima para o web, com `revalidatePath` das telas Orçamento e Ajustes.

### 3.2 Ajustes pontuais no back

* **Nomes já aplicados:** "Disponível neste mês" e "Sobra no ano" estão no código. Confirme que a mensagem de `domain/consumo.ts` e o rótulo de `ano-view` batem com `MICROCOPY.md`.
* **Limite de alerta:** verificar que `limites\_alerta` valida 1–100 inteiro no domínio (não só na UI).
* **Exportação:** mantida (CSV e JSON). Adicionar mensagens da spec 017: "Não havia movimento para exportar." e "Arquivo incompleto não é compartilhado."
* **Parcelamento:** mantido. Não alterar a regra de competência de parcelas (`domain/competencia.ts`).
* **Importações (planilha e fatura):** ficam como estão no back. Na UI, marcar como V2 e esconder da navegação na V1 (feature flag `IMPORTACAO\_V1=false`).

\---

## 4\. Telas web: requisitos por spec

### 042 · Shell

* Barra lateral 240 px (≥ 720 px) com as 5 abas (Resumo, Orçamento, Lançamentos, Ano, Ajustes), ícone + rótulo, aba ativa com `aria-current="page"`.
* Abaixo de 720 px: barra inferior de 5 abas, 76 px de altura.
* Área de conteúdo com largura máxima de 960 px e grid de 12 colunas, margem 40 px, espaço 24 px (`GRID.md`).
* Cabeçalho de tela com título e, quando aplicável, navegação de mês (‹ ›).
* **Sem FAB no web.** A ação de criar fica no conteúdo, no topo da área.

### 043 · Resumo

* `BlocoSaldo` com rótulo **"Disponível neste mês"**, valor em `displayMd` (mobile) / `displayLg` (desktop), botão de ocultar valores (ícone `visibility`/`visibility\_off`, `aria-pressed`), medidor e frase "Usou X% do planejado · Faltam N dias" (dias só no mês atual).
* `GradeTotais` com 4 cartões: Receitas, Fixas, Variáveis, Anuais. Valor sem centavos (`formatarBRLInteiro`).
* Ocultar valores afeta saldo, totais e gráfico, e persiste em `localStorage` (`mo-ocultar-valores`).
* Filtros em chips (tipo, cartão) e "Limpar filtros" (zera pagamento e categoria, não o mês).
* Sininho de alertas (ícone `notifications`) com contador; painel lista alertas de atenção e estouro com link para o Orçamento.
* Estados: vazio (`CartaoVazio`, ação "Definir receitas"), carregando (`Skeleton`), erro (`EstadoErro`).
* Gráfico de gasto por semana com média diária; "Ver detalhes" abre painel com os lançamentos.

### 044 · Orçamento

* Seletor de tipo (`Chips`, 4 opções), total do tipo com "de R$ x planejados".
* Lista de categorias com `GrupoComMedidor` (cabeçalho recolhível, `aria-expanded`), itens com `LinhaItem` e frase de estado.
* Cabeçalho de cada tipo tem o atalho **"Gerenciar"** que leva a Ajustes > Categorias e itens, já filtrado pelo tipo.
* Botão **"Nova categoria"** e **"Novo item"** no conteúdo (não flutuante). "Novo item" tem campo "Categoria" com sugestões das existentes e opção de digitar uma nova.
* Editar plano abre `FormularioContainer` (painel lateral 460 px) com `CampoMoeda`, `Switch` "Aplicar também aos próximos meses" e `RodapeAcoes`. Arquivar item é `Dialogo` de confirmação com o nome: "Arquivar Mercado?".
* Plano: "Copiar mês anterior", "Aplicar a todos os meses", "Copiar ano anterior" (se não houver ano anterior, mensagem e nenhuma alteração).
* Estados: vazio por tipo (`CartaoVazio`), alertas (`Banner` atenção/erro), carregando, erro.

### 045 · Lançamentos

* `Tabela` com colunas Data, Descrição, Item, Pagamento, Valor; linha inteira abre a edição; ação de excluir só dentro da edição (ou em `MenuAcoes` com confirmação).
* Busca (`CampoBusca`) e filtros (item, pagamento) no topo; mês com ‹ ›.
* Registrar: painel lateral com Item (`Select` agrupado por tipo), Valor (`CampoMoeda`), Data (`CampoData`), Descrição, Pagamento, `Switch` Parcelar com prévia das competências, `RodapeAcoes`.
* Editar: mesmo painel, com botão Excluir ao final (destrutivo). Excluir abre `Dialogo`; o desfazer aparece num `Snackbar` por 10 s.
* Badge "Fatura MM/AAAA" quando a compra cai numa fatura de cartão.
* Estados: vazio, busca sem resultado (`Nenhum resultado para "x"` + "Limpar busca"), erro.

### 046 · Ano

* `TabelaMeses` (12 meses, total por linha, mês ativo destacado, linha "Sobra no ano" com destaque). Saldo final = receitas − despesas, com o nome **"Sobra no ano"**.
* Navegação de ano (‹ ›). Ano sem movimento: `CartaoVazio`.
* Versão mobile **não** tem a tabela detalhada (decisão do PM): no celular, lista mensal com o cartão de saldo. Esta spec cobre só o web.

### 047 · Ajustes

* Menu secundário em dois grupos: **Dia a dia** (Categorias e itens, Conta, Cartões, Limites de alerta, Itens arquivados) e **Dados e arquivos** (Importar planilha — oculto na V1, Importar fatura — oculto na V1, Exportar, Dados de exemplo). "Excluir conta" isolado no fim, em destaque destrutivo.
* **Categorias e itens:** abas Categorias / Itens arquivados. Em Categorias: lista por tipo com contagem, **Renomear** e **Arquivar** (via `MenuAcoes`), e **Nova categoria** (`FormularioContainer`, campos Tipo e Nome). Renomear valida duplicidade no tipo. Arquivar confirma com `Dialogo` ("Arquivar Lazer?").
* Itens arquivados: somente leitura, sem botão de desarquivar.
* Limites: `CampoNumero` 1–100 inteiro; fora do intervalo mostra erro e restaura o valor salvo.
* Cartões: lista, adicionar, editar, desativar (`Dialogo`). Dia de fechamento 1–28, vencimento 1–31; fechamento vazio mostra aviso.
* Exportar: CSV e JSON; mensagens da spec 017.
* Dados de exemplo: primeiro toque arma, segundo toque confirma; mensagem com quantos itens mudaram.
* Excluir conta: passo 1 (aviso + botão), passo 2 (campo EXCLUIR, erro se diferente, ação destrutiva só ativa com a frase).
* Perfil no topo com `Avatar`, nome, e-mail e "Esqueci a senha". Sair da conta: `Dialogo`.

### 048 · Entrada

* Login, cadastro, esqueci a senha (envio), link enviado (confirmação), sessão expirada (banner de aviso), sair. Layout de duas colunas em desktop (marca à esquerda, formulário à direita), uma coluna no celular.
* Erros de credencial sem indicar qual campo está errado.
* Regra de senha: mínimo 8 caracteres, erro no campo.

\---

## 5\. Critérios de aceite transversais (todas as specs de tela)

1. Usa apenas componentes do DS e tokens. Verificação: a regra do ESLint da seção 8 passa em `src/app` e `src/components`. Não usar `grep` cego por `\\d+px`: a checagem é a regra do ESLint, que só mira estilo.
2. Todo controle tem nome acessível; todo campo tem rótulo visível ligado.
3. Foco visível em todo elemento interativo; navegação por teclado completa nos diálogos e painéis.
4. Funciona em light e dark; `prefers-reduced-motion` zera as transições.
5. Dinheiro em centavos; formatação só na borda.
6. Textos conferidos com `MICROCOPY.md`.
7. E2E do fluxo principal da tela (Playwright) passando.
8. Captura de tela da tela gerada no final do E2E (`tests/visual/out/`), para inspeção do PM. Nas specs 043–048 não há pixel-diff bloqueante na V1; o PM aprova por inspeção.
9. Nada de `@material/web` na tela nova.

## 6\. Remoção do front antigo (spec 049)

Só após 043–048 `implemented` e verificadas pelo PM:

* Remover `@material/web`, `src/types/material-web.d.ts`, `src/app/material-theme.css`, componentes antigos sem uso (`src/components/material/\*`), e o CSS antigo do `globals.css`.
* Confirmar que `git grep "md-"` e `git grep "material"` retornam só o que for do DS. Material 3 não pode existir no repositório ao fim da Fase 2 (ver seção 9).
* Rodar `npm test`, `npx tsc --noEmit`, `npm run build` e os E2E.

## 7\. Gates de qualidade (antes de cada `implemented`)

* `npm test` verde, `npx tsc --noEmit` sem erros, `npm run build` sem erros.
* E2E da tela verde.
* Checklist de `packages/design-system/README-USO.md` (seção "Checklist de revisão", 10 itens) preenchido no PR. Esse arquivo é o guia do pacote; a checklist está nele.
* Nenhum TODO, console.log ou `any` novo.

## 8\. Lint (pré-requisito, faça antes da spec 040)

O projeto não tem configuração de ESLint. Adicionar `eslint` e `eslint-config-next`, criar `eslint.config.mjs` e uma regra `no-restricted-syntax` com estes seletores, aplicada só em `src/app` e `src/components`:

* literal de string com hexadecimal (`/#\[0-9a-fA-F]{3,8}\\b/`) em qualquer valor;
* literal de string com unidade (`/^-?\\d+(\\.\\d+)?(px|rem|dp)$/`) em propriedades de `style={{}}` (`padding`, `margin`, `gap`, `width`, `height`, `fontSize`, `lineHeight`, `borderRadius`, `top`, `right`, `bottom`, `left`);
* classe Tailwind com valor arbitrário (`/\\b\[\\w-]+-\\\[\[^\\]]\*(px|rem)\\]/`) em `className`.
Não bloquear números em props de componentes nem atributos de `<svg>`. `npm run lint` deve passar. Esta regra é a checagem oficial de tokens.

\---

## 9\. Mobile (Fase 2, Specs 050–057, não iniciar agora)

**Decisão:** o repositório não mantém Material 3 em nenhuma plataforma. O app mobile é reescrito do zero em **React Native + Expo**, consumindo exclusivamente a camada nativa do DS (`packages/design-system/src/native.ts`) e a API v1 já existente (`src/app/api/v1/\*`). A pasta `android/` (Jetpack Compose + Material 3) é substituída e removida ao final.

**Gate para iniciar:** specs 040–049 `verified`, e a API v1 estável para os fluxos do mobile, incluindo categorias (spec 041).

### Spec 050 · Base mobile e DS nativo

* Criar `apps/mobile/` com Expo, TypeScript estrito e expo-router. Consumir o DS como workspace (`@meu-orcamento/design-system`), entrada `react-native`.
* **Criar no DS (`src/native/`)** os componentes que faltam em relação à Spec 040, cada um com contrato em `src/base/contratos.ts`, versão nativa, export em `src/native.ts` e testes:

  * `ShellApp` (cabeçalho, barra inferior de 5 abas, área de conteúdo com margem 16 px);
  * `CampoBusca`;
  * `CampoData` (formato DD/MM/AAAA, erro abaixo do campo);
  * `Switch` (`accessibilityRole="switch"`, `accessibilityState.checked`);
  * `MenuAcoes` (menu ⋯; ação destrutiva só dentro do menu, com confirmação);
  * `BotaoIcone` (`accessibilityLabel` obrigatório pelo tipo);
  * `Avatar` (iniciais, `--md-selected`).
* **Testes de renderização nativa.** Hoje os componentes nativos só são validados por tipos. Adicionar `jest-expo` e `@testing-library/react-native` e cobrir **todos** os componentes nativos com teste de render, acessibilidade (`accessibilityRole`, `accessibilityLabel`, estados) e interação. Gate desta spec: esses testes verdes.
* **Tema:** o `ThemeProvider` nativo deve dar `useCores()` a todos os componentes; verificar light e dark.
* **Ícones:** `react-native-svg` (já é peer do DS). Usar o mesmo catálogo de `ICONES.md`.
* **Autenticação mobile:** a sessão atual do Better Auth é baseada em cookie, que não se aplica a um app nativo. Antes de codar, escrever um ADR que escolha o mecanismo (por exemplo, o plugin de bearer token do Better Auth, ou sessão via header) e como o token é guardado (`expo-secure-store`). Sem ADR aprovado, não avançar para a spec 051.
* **Validação de tokens:** estender a regra de ESLint da seção 8 para `apps/mobile/`.
* **Visual:** baseline de snapshot só após aprovação do PM (mesma regra da seção 2.5). Captura para inspeção nas telas.

### Spec 051 · Entrada mobile

Login, cadastro, esqueci a senha, link enviado, sessão expirada e sair, com os mesmos critérios da spec 048 adaptados para uma coluna. Erro de credencial sem indicar o campo errado. Senha mínima de 8 caracteres.

### Spec 052 · Resumo mobile

* `BlocoSaldo` ("Disponível neste mês", `displayMd`, ocultar valores persistido).
* `GradeTotais` em 2 colunas, sem centavos.
* Sininho de alertas, filtros em chips, estados vazio, carregando e erro.
* **Sem tabela.** Gráfico de semanas só se couber sem tabela; decidir na spec.

### Spec 053 · Orçamento mobile

* `Chips` de tipo, `GrupoComMedidor` com `LinhaItem`, atalho "Gerenciar".
* **FAB** "+ Novo item" (`Fab` do DS), acima da barra inferior. É a única ação de criação visível no mobile; não duplicar na lista.
* Plano e Novo item em `FormularioContainer` (bottom sheet com puxador). Arquivar em `Dialogo`.

### Spec 054 · Lançamentos mobile

* Lista com `LinhaLancamento`, `CampoBusca` e filtros.
* **FAB** "+ Registrar" (`Fab`).
* Formulário em bottom sheet, com `Switch` "Parcelar" e prévia das competências.
* Edição abre a mesma sheet, com "Excluir lançamento" ao final, em destaque destrutivo. Desfazer em `Snackbar` por 10 s.

### Spec 055 · Ano mobile

Lista mensal com o cartão de saldo ("Sobra no ano"), badges "Em curso" e "Planejado". **Sem tabela detalhada**: decisão do PM, que vale para o mobile.

### Spec 056 · Ajustes mobile

* `LinhaAjuste` nos dois grupos (Dia a dia; Dados e arquivos), "Excluir conta" isolado no fim.
* Categorias e itens (renomear, arquivar, nova categoria), cartões, limites, itens arquivados, dados de exemplo, excluir conta em dois passos, sair.
* Exportar: CSV e JSON pelo compartilhamento do sistema (`expo-sharing`), com as mensagens da spec 017.

### Spec 057 · Remoção do legado

* Remover `android/` inteira.
* `git grep -i "material 3\\|material3\\|jetpack compose\\|compose"` no repositório deve retornar zero. `git grep "md-"` só pode retornar o DS.
* Não apagar specs antigas (027, 030–038): marcar cada uma como **substituída pela Fase 2** com uma nota de decisão, para manter o histórico.
* Atualizar `README.md`, `AGENTS.md` e a fonte da verdade mobile.

### Gates da Fase 2

* `npm test` no workspace (incluindo os testes nativos), `tsc --noEmit`, e build do Expo (`npx expo export`).
* E2E de cada fluxo principal com Maestro (ou Detox, se o ADR da spec 050 preferir), rodando em emulador Android.
* Checklist de `packages/design-system/CHECKLIST.md` em cada PR.
* Nenhum `TODO`, `console.log` ou `any`. Verificação de tokens pela regra de ESLint.
* Só o PM marca `verified`.



\---



\## 10. Como conduzir no Cursor (ciclos curtos)



Não peça para executar o arquivo inteiro de uma vez: o contexto estoura antes da Spec 043.



\- \*\*Turno 1 (setup e planejamento SDD):\*\* "Leia @docs/PROMPT-CURSOR-web.md e os documentos da seção 0. Crie as branches `legacy-front` e `rebuild-web`, configure o ESLint (seção 8) e gere as specs 040 a 049 com status `ready`, sem código de implementação. Pare e mostre o resumo das specs."

\- \*\*Turno 2:\*\* "Execute apenas a Spec 040. Rode `npm test` e `npx tsc --noEmit`; depois `npm run build`. Pare para minha revisão."

\- \*\*Turnos seguintes:\*\* uma spec por vez (041, 042, …, 049), sempre parando ao final para revisão do PM.

