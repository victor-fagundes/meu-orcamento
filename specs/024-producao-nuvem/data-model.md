# Data model: Produção na nuvem

Não há entidade nova nem coluna nova. Produção usa o schema já descrito em `src/db/schema.ts`.

## O que não muda

| Tabela | Papel | Notas para a nuvem |
|---|---|---|
| `user`, `session`, `account`, `verification` | Better Auth | Segredo e URL vêm do ambiente, não de coluna. |
| `orcamentos` | Um por `user_id` | O hook de cadastro continua criando a linha e o catálogo. Publicar de novo não cria outro. |
| `itens` | Plano mensal em inteiros (`plano_centavos_json`) e flag `divida` | Centavos seguem inteiros. |
| `cartoes` | Cartão do orçamento | Sem mudança. |
| `lancamentos` | `valor_centavos` inteiro, `competencia` gravada | Sem mudança. |
| `limites_alerta` | Percentuais por orçamento | Sem mudança. |

Relações e deletes continuam os do schema: orçamento cai com o usuário; lançamento não apaga item (`ON DELETE RESTRICT`); cartão some do lançamento sem apagar o lançamento (`ON DELETE SET NULL`).

## O que passa a existir fora das tabelas

### Ambiente publicado

Configuração, não tabela.

| Campo | Obrigatório em produção | Onde vive |
|---|---|---|
| Endereço HTTPS do app | Sim | `BETTER_AUTH_URL` na Vercel |
| Segredo de sessão | Sim, 32+ caracteres, diferente do fallback do código | `BETTER_AUTH_SECRET` na Vercel |
| Postgres pooled | Sim | `DATABASE_URL` na Vercel |
| Postgres direto | Só na hora da migração | `DATABASE_URL_UNPOOLED` na máquina que migra |

Validação: produção sem um dos três primeiros não abre banco nem autenticação. O valor do segredo não é persistido no app nem mostrado na UI.

### Banco de produção

Um branch Neon em São Paulo. Estado inicial: schema migrado, zero usuários. O cadastro insere `user`, `account`, `orcamentos` e os itens do catálogo. Não há carga a partir de `data/pglite`.

### Banco local

Arquivos em `data/pglite` (gitignored). Existe só quando `DATABASE_URL` está ausente. A conta `demo@local.test` continua regra desse ambiente, não do Neon.

## Transições

- Conta nova em produção: sem orçamento → um orçamento + catálogo. Segunda publicação não repete.
- Pedido de reset em produção: nenhum estado novo. O link não é guardado em log. A senha só muda quando o e-mail existir, em história futura.
- Exclusão de conta: continua imediata (cascade do usuário). Sem estado “aguardando 30 dias”.
- Schema: o banco de produção só recebe código que depende de coluna nova depois do `drizzle-kit migrate` na URL direta.

## Drift conhecido

O dev ainda aplica o SQL escrito em `src/db/index.ts`. A produção aplica os arquivos em `drizzle/`. Os dois precisam descrever o mesmo schema. Esta história não funde as fontes; o contrato de persistência manda atualizar os dois em qualquer mudança posterior.
