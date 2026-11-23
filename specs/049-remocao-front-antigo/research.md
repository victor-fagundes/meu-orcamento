# Research: Remoção do front antigo

## 1. O que as telas novas já não usam

**Decision**: Apagar o grupo que nenhuma rota de 042–048 importa. São `src/components/material/**`, `src/types/material-web.d.ts`, `src/app/material-theme.css`, e os componentes que só existem para essa biblioteca: `app-chrome.tsx`, `app-nav.tsx`, `auth-shell.tsx`, `brand-logo.tsx`, `sign-out-button.tsx`, `resumo-dashboard.tsx`, `resumo-donut.ts`, `resumo-donut.test.ts`, `orcamento-view.tsx`, `alert-banner.tsx`, `plano-sheet.tsx`, `novo-item-sheet.tsx`, `lancamentos-view.tsx`, `novo-lancamento-sheet.tsx`, `editar-lancamento-sheet.tsx`, `ano-view.tsx`, `ajustes-cards.tsx`, `cartoes-panel.tsx`, `limites-panel.tsx`, `export-panel.tsx`, `carregar-exemplo-button.tsx`, `excluir-conta-panel.tsx`, `import-planilha-panel.tsx`, `import-pdf-panel.tsx` e `competencia-simulador.tsx`.

**Rationale**: As páginas em `src/app/app/**` e a entrada em `/login`, `/cadastro` e `/esqueci-senha` já montam os componentes do DS. O grupo antigo não tem import a partir dessas páginas. Mantê-lo obrigaria o layout a continuar carregando `@material/web`. A rosca e o teste dela só servem ao painel antigo do Resumo.

**Alternatives considered**: Reestilizar cada painel antigo com o DS. Rejeitado: a spec não redesenha tela, e 043–048 já entregaram a interface. Deixar os arquivos sem import. Rejeitado: eles ainda importam a biblioteca, então ela não sai do app.

## 2. A vitrine `/`

**Decision**: `src/app/page.tsx` deixa de desenhar a vitrine. Sem sessão, redireciona para `/login`. Com sessão, redireciona para `/app/resumo`, do mesmo jeito que `/login` já faz com `getAuth`. Não há texto novo nem componente novo.

**Rationale**: A spec diz que as seis áreas são a única interface. A vitrine usa `MdFilledButton` e as classes `.home-*` / `.auth-*` de `globals.css`. A história 048 deixou essa página e o `AuthShell` para a 049. Redesenhá-la criaria uma sétima tela.

**Alternatives considered**: Manter `/` com `Botao` do DS e os textos atuais. Rejeitado: isso é tela nova, e os textos não estão nos artboards verificados. Apagar a rota e deixar o Next responder 404. Rejeitado: quem abre o endereço do site precisa cair na entrada.

## 3. Layout, tema e Tailwind

**Decision**: `src/app/layout.tsx` tira `MaterialRegistry` e a classe `antialiased`. Continuam Manrope, `tokens.css`, `web.css`, o script de `data-theme` e `ThemeProvider`. `material-theme.css` é apagado. `globals.css` deixa de importar esse tema e o Tailwind. O arquivo fica com o reset que as telas ainda precisam: `box-sizing: border-box` em `*`, e no `body` margem zero, fundo `var(--md-surface)`, texto `var(--md-text)`, fonte `var(--font-family)` e o mesmo alisamento de fonte que o Tailwind aplicava. Sem cor hexadecimal e sem `px` solto.

`@material/web` sai de `package.json` e de `package-lock.json`. `next.config.ts` tira `@material/web` e `lit` de `transpilePackages`. O pacote Tailwind permanece instalado e o `postcss.config.mjs` não muda. O app só deixa de importar o CSS dele.

**Rationale**: O layout já importa os tokens e o CSS do DS. O `body` do `globals.css` hoje zera a margem e pinta o fundo com a cor do tema antigo. Sem margem zero, a casca de `100dvh` ganha a margem do navegador. Sem o fundo do token, a área fora de um bloco pode voltar ao branco padrão. `--md-surface` e `--md-text` são tokens da identidade, não o tema Material que sai. `lit` não é dependência direta. Tailwind não pinta as classes `mo-*`. Tirá-lo do `package.json` seria escopo além da lista já aceita.

**Alternatives considered**: Apagar `globals.css` inteiro. Rejeitado: a margem do `body` mudaria as telas já verificadas. Mover o reset para o pacote do DS. Rejeitado: a spec permite o resto necessário no estilo global e não pede mudança no pacote. Desinstalar Tailwind. Rejeitado: a spec nomeia `@material/web`, não o Tailwind.

## 4. O que não muda

**Decision**: Não muda `src/domain`, schema, `src/lib/auth.ts`, `src/app/api/**`, as páginas e componentes das histórias 042–048, nem `android/`. Specs e documentos antigos que citam Material permanecem. A regra de tokens do ESLint continua em `src/app` e `src/components`.

**Rationale**: A spec conserva o disponível do mês, a conta e o aparelho. Menção histórica não carrega a biblioteca. O prefixo `--md-` dentro de `packages/design-system` é a identidade visual e fica.

**Alternatives considered**: Limpar a palavra "material" das specs antigas. Rejeitado: a spec manda manter as specs já publicadas. Incluir `android/` para zerar Material 3 agora. Rejeitado: isso é a história 057.

## 5. Como conferir

**Decision**: Rodar `npm test`, `npx tsc --noEmit`, `npm run build`, `npm run lint` e o Playwright de `e2e/casca.spec.ts`, `e2e/resumo.spec.ts`, `e2e/orcamento.spec.ts`, `e2e/lancamentos.spec.ts`, `e2e/ano.spec.ts`, `e2e/ajustes.spec.ts` e `e2e/entrada.spec.ts`. A busca `git grep "md-"` no web só pode achar o DS. `git grep "material"` só pode achar o DS ou menção em spec, doc ou comentário que não importa a biblioteca. `e2e/resumo.spec.ts` já espera zero `.alert-banner`. Esse seletor continua válido depois que o banner antigo sai.

**Rationale**: São as conferências que a spec e as histórias 043–048 já pedem. Não há regra nova de domínio para um Vitest novo. Não há pixel-diff bloqueante.

**Alternatives considered**: Um Playwright só para provar que `@material/web` não está no bundle. Rejeitado: a ausência no `package.json`, no layout e na busca já cobre o FR-005, e as suítes atuais provam que as seis áreas abrem.
