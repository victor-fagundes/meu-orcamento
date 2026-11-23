# Research: DS integrado ao Next

## 1. Onde a Manrope entra

**Decision**: `src/app/layout.tsx` usa `next/font/local` com o arquivo que já existe, `packages/design-system/fonts/Manrope-VariableFont_wght.ttf`, peso `200 800`, `display: 'swap'`, variável CSS `--font-manrope`. A classe vai no `<html>`. `buildCss()` deixa de emitir `@font-face` e define `--font-family: var(--font-manrope), "Segoe UI", sans-serif`. Roboto (`next/font/google`) sai do layout. Se o `next build` não resolver esse caminho, a mesma fonte é copiada para `public/fonts/` e o `src` do `next/font` aponta para a cópia. Não se copia antes de ver a falha.

**Rationale**: O AC-2 pede a fonte do pacote e proíbe `@font-face` com caminho relativo. O CSS gerado hoje faz exatamente isso (`url("../../fonts/...")`). O `next/font` publica a fonte com hash e evita o flash. O arquivo variável já declara 200–800 no `@font-face` atual.

**Alternatives considered**: Manter o `@font-face` do `tokens.css`. Rejeitado pelo AC-2. Baixar Manrope de novo pelo `next/font/google`. Rejeitado: a spec aponta o arquivo local. Copiar para `public/fonts/` de saída. Rejeitado: o arquivo do pacote existe; a cópia só é o plano B da própria spec. Reapontar `--font-roboto` para Manrope. Rejeitado: o AC-2 tira o Roboto; `globals.css` e `material-theme.css` ficam até a 049 e, enquanto isso, caem em `system-ui`.

## 2. Tema sem flash

**Decision**: Um script inline no `<head>` lê `localStorage['mo-tema']` e `prefers-color-scheme`. Valor ausente ou desconhecido vale `system`. O script grava `data-theme="light"` ou `data-theme="dark"` no `<html>` antes da pintura. `<html>` recebe `suppressHydrationWarning`. `ThemeProvider` lê e grava a mesma chave, expõe `light`, `dark` e `system`, e continua ouvindo a mudança do sistema quando o modo é `system`. O estado React inicial não lê `localStorage` no render (servidor e cliente começam iguais); a persistência entra no efeito, depois do script.

**Rationale**: O CSS já pinta escuro em `:root[data-theme="dark"]` e, na mídia do sistema, em `:root` que não seja `data-theme="light"`. O script alinha a primeira pintura a essa regra. Sem o aviso de hidratação, o atributo posto pelo script diverge do HTML do servidor.

**Alternatives considered**: Só o `ThemeProvider` num `useEffect`. Rejeitado: pinta claro e depois troca. Cookie no servidor. Rejeitado: a spec fixa `localStorage` e não há conta envolvida. `next-themes`. Rejeitado: o pacote já tem `ThemeProvider`.

## 3. Como o App Router enxerga o pacote

**Decision**: A raiz ganha a dependência `"@meu-orcamento/design-system": "file:./packages/design-system"`. `next.config.ts` acrescenta esse nome em `transpilePackages`, junto de `@material/web` e `lit`. O layout importa `tokens.css` e `web.css` uma vez cada, pelos exports já publicados no `package.json` do pacote. `'use client'` entra em cada arquivo de `src/web/` que usa estado, efeito, evento ou `window`, inclusive os que já existem. `src/web.ts` não leva a diretiva: só reexporta.

**Rationale**: A raiz hoje não depende do pacote, e `transpilePackages` não o lista. Sem isso o Next não compila o TSX. A diretiva no arquivo que usa o gancho é o que o AC-1 pede; o servidor pode importar `ThemeProvider` pelo barril. Arquivos só de marcação (ícone, skeleton, banner, medidor) ficam sem a diretiva.

**Alternatives considered**: Alias no `tsconfig` sem dependência. Rejeitado: o CSS do pacote e o `transpilePackages` esperam o nome do pacote, como o `README-USO.md` já descreve. Uma diretiva só no barril. Rejeitado: o AC-1 fala de cada arquivo que usa estado ou evento. Marcar todos os arquivos, mesmo os puros. Rejeitado: a spec limita a diretiva a quem usa estado, efeito, evento ou `window`.

## 4. Medidas 76 e 960

**Decision**: `grid` ganha `bottomBarHeight: 76` e `contentMaxWidth: 960`. `buildCss()` emite `--bottom-bar-height` e `--content-max-width`. O teste de sincronia já compara o arquivo com `buildCss()`; ele também passa a procurar essas duas variáveis. 390 e 1280 não entram em `tokens.ts`: são larguras de referência do `GRID.md`, usadas só como viewport da captura.

**Rationale**: O AC-6 cria exatamente essas duas medidas. O restante do `grid` (720, 240, 12 colunas, margem 40, espaço 24) já existe.

**Alternatives considered**: Gravar 76 e 960 só no CSS do `ShellApp`. Rejeitado: medida nova entra em `tokens.ts` e o CSS sai de `gen:css`.

## 5. Componentes novos, só na entrada web

**Decision**: `ShellApp`, `Tabela`, `CampoBusca`, `CampoData`, `Switch`, `MenuAcoes`, `BotaoIcone` e `Avatar` nascem em `src/web/`, com props em `src/base/contratos.ts`, export em `src/web.ts` e teste em jsdom. Não há arquivo nativo correspondente. Não se edita `src/base/*.web.tsx`, `src/modulos/*.web.tsx`, `index.web.ts` nem `index.native.ts`.

**Rationale**: A spec pede versão web. A casca nativa é non-goal (050–057). A entrada que o Next usa é `src/web.ts`. A árvore `src/base/Botao.web.tsx` (e os irmãos) é um rascunho anterior: não é exportada por `src/web.ts` e não compila contra o `tokens.ts` atual.

**Alternatives considered**: Implementar também em `src/native/` para honrar o comentário “web e React Native”. Rejeitado pelo non-goal e pelo princípio de simplicidade. Consertar o rascunho antigo. Rejeitado: não faz parte do aceite e duplicaria componentes que já existem em `src/web/`.

## 6. Foco no diálogo e no painel

**Decision**: `Dialogo` e `FormularioContainer` guardam o `document.activeElement` ao abrir, movem o foco para o primeiro focoável do painel, e no Tab / Shift+Tab circulam só dentro do painel. Ao fechar, devolvem o foco ao elemento guardado, se ele ainda estiver no documento. Escape continua chamando `onCancelar`. Sem dependência nova. Teste em jsdom.

**Rationale**: Os dois hoje focam (o diálogo) ou só escutam Escape (o painel). Não circulam o Tab e não devolvem o foco. O AC-8 pede os dois comportamentos, com teste.

**Alternatives considered**: `focus-trap` ou similar. Rejeitado: dois painéis não justificam biblioteca. Um único wrapper novo e reescrever os dois em cima dele. Aceito como função interna compartilhada no pacote, se os dois arquivos forem ficar iguais; não vira componente público.

## 7. Data, busca, menu e tabela

**Decision**: `CampoData` é `<input type="date" lang="pt-BR">`. O valor é `AAAA-MM-DD` ou vazio, que é o contrato do input. O rótulo fica visível e o erro usa `aria-invalid` e `aria-describedby`, como `Campo`. `CampoBusca` é `type="search"`, com botão limpar de nome acessível e `aria-controls`. `Switch` é botão `role="switch"` com `aria-checked`. `MenuAcoes` abre num botão com `more_vert`, fecha com Esc, e ação destrutiva só existe dentro do menu; escolhê-la abre confirmação (`Dialogo`) antes do callback. `Tabela` exige `caption`, põe `scope="col"` no cabeçalho, alinha coluna `numero` à direita com `tabular-nums` e marca a linha selecionada com `aria-selected`. A célula numérica é string pronta; a tabela não formata centavos.

**Rationale**: A spec fixa o tipo do input, o nome acessível, o menu e a caption. O formato visível de `type="date"` é o do navegador; `lang="pt-BR"` pede DD/MM/AAAA onde o navegador obedece. Um segundo campo mascarado brigaria com `type="date"`.

**Alternatives considered**: Input de texto com máscara DD/MM/AAAA. Rejeitado: a spec pede `type="date"`. Calcular iniciais do `Avatar` dentro do componente a partir do nome completo. Aceito como responsabilidade de quem chama, para o componente não inventar regra de nome. A tabela somar colunas. Rejeitado: domínio e dinheiro ficam fora.

## 8. Ícones

**Decision**: Os onze nomes (`edit`, `add`, `search`, `close`, `filter_list`, `logout`, `more_vert`, `expand_more`, `expand_less`, `arrow_upward`, `arrow_downward`) entram em `iconPaths` com caminho do Material Icons preenchido, viewBox 24, no mesmo estilo de `delete`. A tabela de `docs/design/ICONES.md` ganha uma linha por nome. Um teste percorre `IconName` e falha se o caminho for vazio; a lista dos onze nomes é `satisfies readonly IconName[]`, então falta de nome quebra o tipo e o teste.

**Rationale**: `IconName` já é `keyof typeof iconPaths`. O teste que a spec pede cobre caminho vazio e nome esquecido. Os caminhos não são desenhados à mão.

**Alternatives considered**: Fonte de ícone ou pacote `@mui/icons-material`. Rejeitado: o pacote já embute SVG, e a spec aponta `icons-paths.ts`.

## 9. Captura visual sem baseline

**Decision**: `tests/visual/playwright.config.ts` não sobe o `next dev` e não usa `e2e/`. O spec renderiza cada componente novo com `react-dom/server`, aplica `tokens.css` e `base.css`, e grava PNG em `tests/visual/out/{componente}-{tema}-{largura}.png` para `light` e `dark`, a 390 e a 1280. Não há `toMatchSnapshot` e não se cria `tests/visual/__snapshots__`. O teste só falha se a renderização ou a gravação falhar. `tests/visual/out/` entra no `.gitignore`. O comando não faz parte de `npm test` nem de `npm run test:e2e`.

**Rationale**: O AC-11 pede captura para o PM e proíbe o teste aprovar a própria baseline. A config de `e2e/` sobe o app inteiro e não é o lugar desses componentes, que ainda não estão nas telas. São 8 componentes × 2 temas × 2 larguras.

**Alternatives considered**: Rota `/dev/catalogo` no app. Rejeitado: vira superfície pública fora da spec. `@playwright/experimental-ct-react`. Rejeitado: dependência nova para uma captura que não compara pixel. Falhar quando o PNG muda. Rejeitado: sem baseline aprovada pelo PM, o teste não falha por diferença.

## 10. `tsc` da raiz

**Decision**: O `npx tsc --noEmit` da raiz hoje falha. Dois motivos, ambos fora da entrada v0.2: a pasta não rastreada `meu-orcamento-design-system/` e os rascunhos `packages/design-system/src/base/*.{web,native}.tsx`, `src/modulos/*.{web,native}.tsx`, `index.web.ts` e `index.native.ts`. O `tsconfig` da raiz passa a excluir essa pasta e esses rascunhos, e também `packages/design-system/src/native` (importa `react-native`, que o app não tem). Ganha `allowImportingTsExtensions`, porque a entrada viva importa com sufixo `.ts` e o app já está com `noEmit`. Os arquivos vivos de `src/web/` e `src/core/` continuam no projeto e são checados.

**Rationale**: O AC-12 exige o comando sem erro. Reescrever o rascunho ou instalar `react-native` no Next não é esta história. Excluir o que não é a entrada viva deixa o layout e os componentes novos sob o `tsc`.

**Alternatives considered**: Apagar o rascunho e a pasta `meu-orcamento-design-system/`. Rejeitado neste plano: a pasta é cópia local não rastreada; apagá-la não é aceite da spec. Excluir o pacote inteiro da raiz. Rejeitado: o layout vai importá-lo, e o AC-1 precisa que esse TypeScript seja o que o app compila. Ignorar o `tsc` vermelho. Rejeitado pelo AC-12.
