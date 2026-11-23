package app.meuorcamento.ui

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.em
import androidx.compose.ui.unit.sp

/** Nome cede espaço. Detalhe opcional, por baixo. Valor à direita, na mesma linha, sempre visível. */
@Composable
fun LinhaValor(
    nome: String,
    valor: String,
    detalhe: String? = null,
    valorColor: Color = Color.Unspecified,
    onClick: (() -> Unit)? = null,
    cartao: Boolean = false,
    modifier: Modifier = Modifier,
) {
    val caixa = if (cartao) {
        modifier.cartao().padding(horizontal = 14.dp, vertical = 12.dp)
    } else {
        modifier.fillMaxWidth().padding(horizontal = 14.dp, vertical = 12.dp)
    }
    Column(
        caixa.then(if (onClick != null) Modifier.clickable(onClick = onClick) else Modifier),
    ) {
        Row {
            Text(
                nome,
                modifier = Modifier.weight(1f),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
                style = MaterialTheme.typography.titleMedium,
            )
            Text(
                valor,
                maxLines = 1,
                softWrap = false,
                fontWeight = FontWeight.ExtraBold,
                fontSize = 16.sp,
                letterSpacing = (-0.03).em,
                color = if (valorColor == Color.Unspecified) MaterialTheme.colorScheme.onSurface else valorColor,
            )
        }
        if (!detalhe.isNullOrBlank()) {
            Text(
                detalhe,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
            )
        }
    }
}
