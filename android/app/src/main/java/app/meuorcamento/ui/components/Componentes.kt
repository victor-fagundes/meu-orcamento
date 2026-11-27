package app.meuorcamento.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Add
import androidx.compose.material.icons.outlined.Visibility
import androidx.compose.material.icons.outlined.VisibilityOff
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
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

/**
 * Estado vazio (DS: título + uma frase + uma ação).
 * No celular a ação costuma ser o FAB; aqui o botão é opcional.
 */
@Composable
fun EmptyState(
    titulo: String,
    frase: String? = null,
    acao: String? = null,
    onAcao: (() -> Unit)? = null,
    modifier: Modifier = Modifier,
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text(
            text = titulo,
            style = MaterialTheme.typography.titleMedium,
            textAlign = TextAlign.Center,
        )
        if (frase != null) {
            Text(
                text = frase,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(top = 8.dp),
            )
        }
        if (acao != null && onAcao != null) {
            BotaoPrimario(
                text = acao,
                onClick = onAcao,
                modifier = Modifier.padding(top = 16.dp),
            )
        }
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
                    Icon(Icons.Outlined.Add, contentDescription = "Voltar") // placeholder; use seta real se disponível
                }
            }
        },
        actions = acoes
    )
}

/**
 * FAB estendido (DS: só celular, canto inferior direito, acima da barra).
 */
@Composable
fun FabEstendido(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    icon: ImageVector = Icons.Outlined.Add,
) {
    ExtendedFloatingActionButton(
        onClick = onClick,
        modifier = modifier,
        containerColor = AzulAcao,
        contentColor = MaterialTheme.colorScheme.onPrimary,
        shape = RoundedCornerShape(16.dp),
        icon = { Icon(icon, contentDescription = null) },
        text = { Text(text, fontWeight = FontWeight.SemiBold) },
    )
}

/** Botão de olho para ocultar valores (DS: Resumo). */
@Composable
fun BotaoOlho(
    oculto: Boolean,
    onToggle: () -> Unit,
    modifier: Modifier = Modifier,
) {
    IconButton(onClick = onToggle, modifier = modifier) {
        Icon(
            imageVector = if (oculto) Icons.Outlined.VisibilityOff else Icons.Outlined.Visibility,
            contentDescription = if (oculto) "Mostrar valores" else "Ocultar valores",
        )
    }
}
