# Regras de implementação · Meu Orçamento · v0.2

Status: **proposta para aprovação**. Vale para o código do app (PWA) e do web, que compartilham a mesma base.

Base técnica (já decidida em `ARCHITECTURE_Meu_Orcamento.md`): Next.js 15 com App Router, React 19, TypeScript, Drizzle, Better Auth, Vitest e Playwright.

## 1. Tokens são a única fonte de valor visual
- Cor, tamanho de texto, espaço, raio, sombra e duração vêm de `tokens.css`, sempre por variável CSS (`var(--md-action)`, `var(--space-4)`).
- **Proibido** no código de tela: cor em hexadecimal, `px` fora da escala, sombra solta, duração fora de `--motion-*`.
- Valor novo precisa de token antes de ser usado. Se não houver token, a mudança entra em `TOKENS.md`, não no componente.
- Nomes de token no código são os mesmos do `tokens.css`. Não criar apelidos.

## 2. Nomes
| Item | Padrão | Exemplo |
|---|---|---|
| Arquivo de componente | `kebab-case.tsx` | `grupo-com-medidor.tsx` |
| Componente | `PascalCase` | `GrupoComMedidor` |
| Função de domínio | `camelCase`, verbo + objeto | `calcularCompetencia`, `somarRealizado` |
| Token CSS | prefixo do papel | `--md-action`, `--space-4`, `--radius-xl` |
| Constante de regra | `UPPER_SNAKE` | `LIMITE_ALERTA_PADRAO` |
| Tabela de banco | `snake_case`, plural | `lancamentos`, `orcamento_planos_mensais` |
| Coluna de banco | `snake_case` | `valor_centavos`, `dia_fechamento` |

Termos de negócio no código seguem o `MICROCOPY.md`: `categoria` (não `grupo` na interface), `item`, `lancamento`, `plano`, `realizado`, `competencia`.

## 3. Estrutura de pastas
```text
src/
  domain/        regras puras: dinheiro, competência, parcelas, saldos. Sem React, sem banco.
  app/           rotas e telas (Next.js App Router)
  components/    componentes de interface, um arquivo por componente
    modulos/     módulos do MODULOS.md (cabeçalho, bloco de saldo, grade de totais...)
    base/        componentes da ficha COMPONENTES.md (botão, campo, chip...)
    icones/      ícones SVG por nome (lista de ICONES.md)
  server/        ações do servidor e acesso ao banco
  styles/        tokens.css e base global
```
- `domain/` não importa de `components/`, `app/` ou `server/`. Verificar com regra de lint.
- Um componente base não importa um módulo. Módulos importam componentes base.

## 4. Dinheiro e datas
- Valores monetários são **inteiros em centavos** em todo o código e no banco. Nunca `float`.
- Conversão para texto só na borda, com a função única `formatarBRL(centavos)` → `R$ 1.234,56`.
- Entrada do usuário passa por `lerBRL(texto)`, que devolve centavos ou erro. Nunca `parseFloat` direto.
- Datas: armazenadas como data sem fuso (`YYYY-MM-DD`). Exibição em `DD/MM/AAAA`. Competência é `YYYY-MM`.
- Percentual: inteiro arredondado para baixo (81%).

## 5. Componentes
- Cada componente declara seus estados na interface: padrão, foco, desabilitado, erro, carregando, quando existirem na ficha.
- Props tipadas. Sem `any`.
- Ícone sem texto recebe `aria-label` obrigatório pelo tipo (não opcional).
- Ação destrutiva não aceita ser o botão primário de uma área (regra da ficha).
- Estilo por classe ou variável de token. Nada de estilo calculado com cor ou medida literal.

## 6. Acessibilidade no código
- Elemento clicável é `<button>` ou `<a href>`. Nunca `div` com `onClick`.
- Todo campo tem `<label>` ligado (`htmlFor`), mesmo quando o rótulo é visual pequeno.
- Mensagem de erro de campo tem `aria-describedby` e `aria-invalid`.
- Banner de erro usa `role="alert"`; atenção e informação usam `role="status"`.
- Foco visível em todo controle (`--state-focus-width`), nunca `outline: none` sem substituto.
- Movimento usa `--motion-*`. Com "reduzir movimento", a duração é zero (já no `tokens.css`).

## 7. Regras de negócio
- Regra de competência, parcelas, alertas e saldos vive **uma vez** em `domain/`. Telas chamam a função, não repetem a conta.
- Cada regra tem teste unitário com os casos da spec antes de a tela usá-la (Vitest).
- Fluxos principais têm teste end-to-end (Playwright): entrar, planejar, registrar, excluir com desfazer.

## 8. Dados e segurança
- Toda consulta filtra pelo usuário da sessão. Item de outro usuário responde 404, não 403 (arquitetura, seção 6).
- Nenhum segredo, chave ou token no código do cliente.
- Mensagens de erro ao usuário não expõem detalhe técnico.

## 9. Git e entregas
- Uma tarefa por commit, com o identificador da história: `feat(MO-303): criar lançamento à vista`.
- Mudança de token ou de componente base tem commit próprio, com a nota de versão do `TOKENS.md` ou `COMPONENTES.md`.
- Nenhuma tela entra em produção com texto de placeholder, cor fora do token ou ação sem nome acessível.

## 10. Revisão de código (checklist)
1. Nenhum hexadecimal, `px` fora da escala ou `float` com dinheiro.
2. Regra de negócio está em `domain/`, com teste.
3. Campos com rótulo, erro ligado e foco visível.
4. Ícones com nome acessível quando não têm texto.
5. Telas usam os módulos existentes antes de criar bloco novo.
6. Consultas filtradas pelo usuário da sessão.
7. Commit com identificador da história.

## Pendências
- A regra de lint que proíbe hexadecimal e unidade em estilo está em `eslint.config.mjs`, em `src/app` e `src/components`. O CSS antigo sai na spec 049.
- Confirmar a convenção de nomes de tabela e coluna com quem já escreveu o schema (`src/server/`, se já existir).
- Decidir se Tailwind entra como camada de utilitários. Se entrar, as classes devem mapear para os tokens, não para valores soltos.
