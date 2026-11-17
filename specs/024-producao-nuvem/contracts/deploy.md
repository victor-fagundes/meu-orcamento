# Contract: Publicação

Um app Next, um projeto Vercel, um projeto Neon. Sem segundo serviço.

## Neon

- Região AWS `sa-east-1`.
- Um branch de produção.
- Duas strings: pooled (`DATABASE_URL` na Vercel) e direta (`DATABASE_URL_UNPOOLED` só na migração).
- Histórico de restore do Neon ligado nesse branch. Não há outro backup nesta história.
- Compute pode dormir no plano gratuito. O dado permanece.

## Vercel

- Repositório Git ligado ao projeto. O comando `git` não estava disponível no terminal desta sessão; criar o remoto é passo de quem publica, não código desta spec.
- Framework Next.js. Comando de build: `next build`. Sem `drizzle-kit migrate` no build.
- Região da função: `gru1`.
- Runtime Node. PDF e planilha seguem no servidor (`serverExternalPackages` já lista `pdfjs-dist` e `@electric-sql/pglite`).
- Variáveis de produção: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`. Nada de conta demo, nada de arquivo `.env` no Git.
- Domínio: o `*.vercel.app` gerado. Domínio próprio não é requisito.

## Ordem de uma publicação

1. Migração aplicada na URL direta, se o schema mudou (na primeira vez, sempre).
2. Variáveis conferidas no painel.
3. Deploy.
4. Smoke do `quickstart.md`: cadastro no celular, lançamento, segunda conta, redeploy, arquivo de 5 MB, texto de reset.

## Falha visível

| Condição | Efeito |
|---|---|
| Produção sem URL de banco ou sem segredo válido | O pedido que abre banco ou auth falha. Login demo não é criado. A tela não mostra o segredo. |
| Deploy antes da migração de um schema novo | Fora do contrato. Quem publica migra antes. |
| Arquivo acima de 4 MB | Mensagem de limite. Sem lançamento novo. |
