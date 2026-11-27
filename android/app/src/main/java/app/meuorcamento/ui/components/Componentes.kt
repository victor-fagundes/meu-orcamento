package app.meuorcamento.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import app.meuorcamento.ui.theme.AzulAcao

/**
 * Design system do Meu Orçamento.
 * Use SEMPRE estes componentes. Nunca invente botão ou estilo novo.
 */

@Composable
fun BotaoPrimario(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true
) {
    Button(
        onClick = onClick,
        enabled = enabled,
        modifier = modifier
            .fillMaxWidth()
            .height(48.dp),
        shape = RoundedCornerShape(14.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = AzulAcao
        )
    ) {
        Text(
            text = text,
            fontWeight = FontWeight.SemiBold
        )
    }
}

@Composable
fun BotaoSecundario(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true
) {
    OutlinedButton(
        onClick = onClick,
        enabled = enabled,
        modifier = modifier
            .fillMaxWidth()
            .height(48.dp),
        shape = RoundedCornerShape(14.dp)
    ) {
        Text(text = text)
    }
}

@Composable
fun BotaoPerigo(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true
) {
    Button(
        onClick = onClick,
        enabled = enabled,
        modifier = modifier
            .fillMaxWidth()
            .height(48.dp),
        shape = RoundedCornerShape(14.dp),
        colors = ButtonDefaults.buttonColors(
            containerColor = MaterialTheme.colorScheme.error,
            contentColor = MaterialTheme.colorScheme.onError
        )
    ) {
        Text(
            text = text,
            fontWeight = FontWeight.SemiBold
        )
    }
}

@Composable
fun BotaoTexto(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    perigoso: Boolean = false
) {
    TextButton(
        onClick = onClick,
        modifier = modifier
    ) {
        Text(
            text = text,
            color = if (perigoso) MaterialTheme.colorScheme.error else AzulAcao,
            fontWeight = FontWeight.Medium
        )
    }
}

@Composable
fun EmptyState(
    mensagem: String,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .fillMaxWidth()
            .padding(32.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = mensagem,
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.onSurfaceVariant,
            textAlign = TextAlign.Center
        )
    }
}

@Composable
fun DialogConfirmacao(
    titulo: String,
    mensagem: String,
    textoConfirmar: String = "Confirmar",
    textoCancelar: String = "Cancelar",
    perigoso: Boolean = false,
    onConfirmar: () -> Unit,
    onCancelar: () -> Unit
) {
    AlertDialog(
        onDismissRequest = onCancelar,
        title = { Text(titulo) },
        text = { Text(mensagem) },
        confirmButton = {
            if (perigoso) {
                TextButton(onClick = onConfirmar) {
                    Text(textoConfirmar, color = MaterialTheme.colorScheme.error)
                }
            } else {
                TextButton(onClick = onConfirmar) {
                    Text(textoConfirmar, color = AzulAcao)
                }
            }
        },
        dismissButton = {
            TextButton(onClick = onCancelar) {
                Text(textoCancelar)
            }
        }
    )
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BarraTitulo(
    titulo: String,
    onVoltar: (() -> Unit)? = null,
    acoes: @Composable RowScope.() -> Unit = {}
) {
    TopAppBar(
        title = { Text(titulo) },
        navigationIcon = {
            if (onVoltar != null) {
                IconButton(onClick = onVoltar) {
                    Text("←")
                }
            }
        },
        actions = acoes
    )
}
