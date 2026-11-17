# Data model: Ajustes no Android

| Entidade | Campos que a tela usa | Persistência |
|----------|------------------------|--------------|
| Conta | E-mail da sessão | Já existe. Sair encerra a sessão. |
| Cartão | Apelido, ativo | `POST` cria. Inativar tira da escolha nova. Lançamentos ficam. |
| Limite | Percentual inteiro de 1 a 100 | `PUT /api/v1/limites` só com valor válido |

Nada novo no banco.
