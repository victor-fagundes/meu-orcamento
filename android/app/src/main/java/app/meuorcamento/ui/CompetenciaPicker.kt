package app.meuorcamento.ui

import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.width
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowLeft
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowRight
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

private val MESES_CIVIS = listOf(
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
)

/** Nome civil em pt-BR. O valor da API continua YYYY-MM. */
fun rotuloMesCivil(competencia: String): String {
    val parts = competencia.split("-")
    if (parts.size != 2) return competencia
    val year = parts[0].toIntOrNull() ?: return competencia
    val month = parts[1].toIntOrNull() ?: return competencia
    val nome = MESES_CIVIS.getOrNull(month - 1) ?: return competencia
    return "$nome de $year"
}

/** Month navigation only adjusts YYYY-MM labels; server owns competência rules. */
@Composable
fun CompetenciaPicker(
    competencia: String,
    onChange: (String) -> Unit,
) {
    BarraTitulo(
        titulo = rotuloMesCivil(competencia),
        onAnterior = { onChange(shiftMonth(competencia, -1)) },
        onProximo = { onChange(shiftMonth(competencia, 1)) },
        rotuloAnterior = "Mês anterior",
        rotuloProximo = "Próximo mês",
    )
}

@Composable
fun BarraTitulo(
    titulo: String,
    onAnterior: (() -> Unit)? = null,
    onProximo: (() -> Unit)? = null,
    rotuloAnterior: String = "Anterior",
    rotuloProximo: String = "Próximo",
) {
    Row(
        Modifier.fillMaxWidth().heightIn(min = 64.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        if (onAnterior != null) {
            IconButton(onClick = onAnterior) {
                Icon(Icons.AutoMirrored.Filled.KeyboardArrowLeft, contentDescription = rotuloAnterior)
            }
        } else {
            Spacer(Modifier.width(16.dp))
        }
        Text(
            titulo,
            modifier = Modifier.weight(1f),
            style = MaterialTheme.typography.headlineSmall.copy(
                fontWeight = FontWeight.Normal,
                fontSize = 22.sp,
            ),
        )
        if (onProximo != null) {
            IconButton(onClick = onProximo) {
                Icon(Icons.AutoMirrored.Filled.KeyboardArrowRight, contentDescription = rotuloProximo)
            }
        }
    }
}

fun shiftMonth(competencia: String, delta: Int): String {
    val parts = competencia.split("-")
    if (parts.size != 2) return competencia
    var y = parts[0].toIntOrNull() ?: return competencia
    var m = parts[1].toIntOrNull() ?: return competencia
    m += delta
    while (m < 1) {
        m += 12
        y -= 1
    }
    while (m > 12) {
        m -= 12
        y += 1
    }
    return "%04d-%02d".format(y, m)
}

fun currentCompetencia(): String {
    val cal = java.util.Calendar.getInstance()
    val y = cal.get(java.util.Calendar.YEAR)
    val m = cal.get(java.util.Calendar.MONTH) + 1
    return "%04d-%02d".format(y, m)
}
