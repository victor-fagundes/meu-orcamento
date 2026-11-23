# Tema escuro · proposta v0.1

Status: **proposta a validar**. Os valores abaixo são um ponto de partida. Precisam de teste de contraste (WCAG 2.2 AA) antes de aprovar.

| Token | Claro | Escuro proposto |
|---|---|---|
| `--md-action` | #0058BE | #ADC6FF |
| `--md-on-action` | #FFFFFF | #002E6B |
| `--md-text` | #191C20 | #E2E2E9 |
| `--md-text-muted` | #43474E | #C4C6D0 |
| `--md-surface` | #F8F9FF | #111318 |
| `--md-card` | #FFFFFF | #1B1C20 |
| `--md-line` | #E3E6EF | #44474E |
| `--md-field` | #ECEEF6 | #282A2F |
| `--md-selected` | #D7E3FF | #00458F |
| `--md-on-selected` | #001B3F | #D8E2FF |
| `--md-success` | #2E7D32 | #81C784 |
| `--md-warn-text` | #6B4B00 | #FFD966 |
| `--md-warn-bar` | #9A6B00 | #FFD966 |
| `--md-warn-bg` | #FFF3C4 | #3D3000 |
| `--md-error` | #BA1A1A | #FFB4AB |
| `--md-error-text` | #410002 | #FFDAD6 |
| `--md-error-bg` | #FFDAD6 | #93000A |
| `--md-snackbar` | #2F3033 | #E2E2E9 |
| `--md-snackbar-text` | #F1F0F4 | #2F3033 |

Regras:
- Amarelo da marca não muda no escuro: a marca é a mesma.
- Atenção e erro precisam de teste real de contraste, principalmente o texto de atenção sobre o fundo escuro.
- Sombras somem no escuro: a separação passa a ser só por cor de superfície.
- Quando ativo: segue a preferência do aparelho e pode ser trocado manualmente em Ajustes.

Pendência: aprovar a paleta escura e rodar o teste de contraste em todas as combinações de texto e fundo.
