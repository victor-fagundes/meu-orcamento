package app.meuorcamento.ui

import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowLeft
import androidx.compose.material.icons.automirrored.filled.KeyboardArrowRight
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

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
    Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(horizontal = 8.dp)) {
        IconButton(onClick = { onChange(shiftMonth(competencia, -1)) }) {
            Icon(Icons.AutoMirrored.Filled.KeyboardArrowLeft, contentDescription = "Mês anterior")
        }
        Text(rotuloMesCivil(competencia))
        IconButton(onClick = { onChange(shiftMonth(competencia, 1)) }) {
            Icon(Icons.AutoMirrored.Filled.KeyboardArrowRight, contentDescription = "Próximo mês")
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
