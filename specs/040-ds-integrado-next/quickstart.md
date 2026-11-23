# Quickstart: DS integrado ao Next

Spec `ready`. Este roteiro confere o aceite depois da implementação. Não substitui o olhar do PM sobre as capturas: o teste não aprova baseline.

Detalhe de props, tema e ícones: [data-model.md](./data-model.md), [contracts/tema-layout.md](./contracts/tema-layout.md), [contracts/componentes.md](./contracts/componentes.md), [contracts/icones-grade.md](./contracts/icones-grade.md).

## Preparo

Na raiz do repositório, com as dependências já instaladas:

```bash
npm install
```

A dependência `file:./packages/design-system` precisa existir no `package.json` da raiz antes do build.

## Portão (AC-12)

Nesta ordem. Os quatro terminam sem erro.

```bash
npm test
npm test --prefix packages/design-system
npx tsc --noEmit
npm run build
```

`npm test` na raiz não inclui o pacote. O segundo comando é o que roda contraste, formatadores, sincronia do CSS, ícones, foco e os componentes novos.

## Tema e fonte

1. Abrir o app. A primeira pintura já usa Manrope, sem troca de Roboto no meio e sem pedido de fonte ao Google.
2. No elemento `<html>`, `--font-manrope` existe e `--font-family` do CSS do pacote aponta para ela.
3. Com `mo-tema` ausente e o sistema em escuro, `<html data-theme="dark">` antes de interagir.
4. Gravar `localStorage.setItem('mo-tema','light')` e recarregar. A primeira pintura é clara.
5. Gravar `dark` e recarregar. A primeira pintura é escura.
6. Pelo `ThemeProvider`, voltar a `system`. A chave fica `system` e o atributo segue o aparelho.
7. Em `packages/design-system/src/core/tokens.css`, não há `@font-face` com caminho relativo. Há `--bottom-bar-height: 76px` e `--content-max-width: 960px`.

## Componentes

Pelos testes do pacote (já cobertos pelo portão):

- `Dialogo` e `FormularioContainer`: Tab e Shift+Tab ficam no painel; ao fechar, o foco volta ao botão que abriu.
- `Switch` expõe `aria-checked` e alterna.
- `MenuAcoes` abre, fecha com Esc, e a ação destrutiva só aparece dentro do menu, com confirmação.
- `CampoData` liga a mensagem de erro ao campo.
- `Tabela` tem `caption` e marca a linha selecionada.
- Cada nome novo de ícone tem caminho. O teste de ícones falha se algum nome do tipo estiver sem caminho.

## Capturas (AC-11)

```bash
npx playwright test -c tests/visual/playwright.config.ts
```

Esse comando não faz parte dos quatro do portão e não usa a config de `e2e/`.

1. O comando termina sem erro.
2. `tests/visual/out/` tem quatro PNG por componente novo: claro e escuro, a 390 px e a 1280 px.
3. Não existe `tests/visual/__snapshots__`.
4. Olhar `shell-app` a 390 (barra inferior) e a 1280 (barra lateral de 240 e conteúdo até 960). O teste não decide se a imagem está certa. Isso fica com o PM.

## O que não mudou

1. Resumo, Orçamento, Lançamentos, Ano, Ajustes e Entrada continuam as telas atuais.
2. `material-theme.css`, `globals.css` e `@material/web` ainda estão no app.
3. `src/domain` não tem diff de regra.
4. A pasta `android/` não entra nesta história.
