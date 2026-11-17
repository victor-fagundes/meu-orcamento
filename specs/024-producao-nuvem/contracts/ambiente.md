# Contract: Ambiente

Quem publica configura o processo. O repositório não leva segredo. `.env.example` só documenta os nomes.

## Variáveis

| Nome | Dev local | Produção (Vercel) | Regra |
|---|---|---|---|
| `DATABASE_URL` | Ausente | Obrigatória, URL pooled do Neon (`-pooler`, SSL) | Presente → Postgres. Ausente no dev → PGlite. Ausente em produção → erro, sem conta demo. |
| `DATABASE_URL_UNPOOLED` | Só na máquina que migra | Não precisa estar no runtime | Drizzle Kit usa esta, senão `DATABASE_URL`. Não é a URL do app. |
| `BETTER_AUTH_SECRET` | Qualquer string de 32+ caracteres no `.env.local` | Obrigatória, 32+ caracteres, diferente de `dev-only-change-me-meu-orcamento-32chars` | Produção com valor vazio ou igual ao fallback não cria a instância de auth. |
| `BETTER_AUTH_URL` | `http://localhost:3000` | `https://<projeto>.vercel.app` (ou o domínio, no dia em que existir) | `baseURL` e `trustedOrigins`. Produção recusa URL ausente ou `http://localhost`. |

`NODE_ENV=production` é o da Vercel. Não setar isso no `npm run dev`.

## O que o servidor faz com isso

1. Primeiro uso de `getDb()` em produção sem `DATABASE_URL` lança erro explícito de configuração.
2. Primeiro uso de `getAuth()` em produção sem segredo válido ou sem URL HTTPS lança erro explícito. Não usa o segredo do código.
3. Com `DATABASE_URL`, o cliente é `postgres` com no máximo uma conexão e prepared statements desligados.
4. Sem `DATABASE_URL` fora de produção, o caminho atual do PGlite roda, inclusive o seed demo se o banco estiver vazio.
5. Nenhum desses valores aparece em Ajustes, no login ou na resposta de erro mostrada à pessoa.

## Reset de senha

| Ambiente | Tela | Servidor |
|---|---|---|
| Local | Pode continuar dizendo que o link aparece no terminal | Pode continuar logando o link |
| Produção | Informa que o envio do link ainda não está disponível. Não cita terminal nem log | Não escreve o URL de reset. Não finge que um e-mail saiu |

Não há variável de API de e-mail nesta história.
