package app.meuorcamento.ui.resumo

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import app.meuorcamento.data.ApiClient
import app.meuorcamento.data.ApiException
import app.meuorcamento.domain.formatCentavos
import app.meuorcamento.ui.CompetenciaPicker
import app.meuorcamento.ui.OfflineBanner
import kotlinx.serialization.Serializable
import java.io.IOException
import java.util.Calendar

@Serializable
data class TotalTipoDto(
    val tipo: String,
    val planoCentavos: Long = 0,
    val realizadoCentavos: Long = 0,
    val frase: String = "",
)

@Serializable
data class TotalGrupoDto(
    val tipo: String,
    val grupo: String,
    val planoCentavos: Long = 0,
    val realizadoCentavos: Long = 0,
    val aindaCabeCentavos: Long = 0,
    val frase: String = "",
)

@Serializable
data class TotaisMesDto(
    val aindaPodeGastarCentavos: Long = 0,
    val totalOrcadoDespesasCentavos: Long = 0,
    val totalGastoDespesasCentavos: Long = 0,
    val porTipo: List<TotalTipoDto> = emptyList(),
    val porGrupo: List<TotalGrupoDto> = emptyList(),
)

@Serializable
data class ResumoResponse(
    val competencia: String,
    val alertas: List<AlertaDto> = emptyList(),
    val itens: List<ResumoItemDto> = emptyList(),
    val lancamentos: List<ResumoLancDto> = emptyList(),
    val totais: TotaisMesDto? = null,
)

@Serializable
data class AlertaDto(val nivel: String? = null, val msg: String? = null, val escopo: String? = null)

@Serializable
data class ResumoItemDto(
    val id: String,
    val tipo: String,
    val grupo: String,
    val nome: String,
    val planoMesCentavos: Long = 0,
)

@Serializable
data class ResumoLancDto(
    val id: String,
    val itemId: String,
    val valorCentavos: Long,
    val itemTipo: String = "V",
    val itemGrupo: String = "",
)

/** Dias civis que restam no mês corrente, incluindo hoje. Fora do mês corrente, null. */
fun diasRestantesNoMes(competencia: String, hoje: Calendar = Calendar.getInstance()): Int? {
    val parts = competencia.split("-")
    if (parts.size != 2) return null
    val year = parts[0].toIntOrNull() ?: return null
    val month = parts[1].toIntOrNull() ?: return null
    if (year != hoje.get(Calendar.YEAR) || month != hoje.get(Calendar.MONTH) + 1) return null
    val ultimo = hoje.getActualMaximum(Calendar.DAY_OF_MONTH)
    val dia = hoje.get(Calendar.DAY_OF_MONTH)
    return ultimo - dia + 1
}

@Composable
fun ResumoScreen(
    api: ApiClient,
    competencia: String,
    onCompetencia: (String) -> Unit,
    onOpenTipo: (String) -> Unit,
    onUnauthorized: () -> Unit,
) {
    var data by remember { mutableStateOf<ResumoResponse?>(null) }
    var loading by remember { mutableStateOf(true) }
    var offline by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf<String?>(null) }

    LaunchedEffect(competencia) {
        loading = true
        offline = false
        error = null
        try {
            val body = api.get("/api/v1/resumo?competencia=$competencia")
            data = api.json.decodeFromString(ResumoResponse.serializer(), body)
        } catch (e: ApiException) {
            if (e.status == 401) onUnauthorized()
            else {
                offline = e.status == 0
                error = e.message
            }
        } catch (e: IOException) {
            offline = true
            error = e.message
        } finally {
            loading = false
        }
    }

    val totais = data?.totais
    Column(Modifier.fillMaxSize().padding(16.dp)) {
        Text("Resumo", style = MaterialTheme.typography.headlineSmall)
        CompetenciaPicker(competencia, onCompetencia)
        OfflineBanner(offline || error != null, error)

        when {
            loading && totais == null -> CircularProgressIndicator(Modifier.padding(24.dp))
            totais == null -> Text("Não foi possível carregar o orçamento.")
            else -> {
                val ainda = totais.aindaPodeGastarCentavos
                val orcado = totais.totalOrcadoDespesasCentavos
                val gasto = totais.totalGastoDespesasCentavos
                val dias = diasRestantesNoMes(competencia)
                Text(
                    if (ainda < 0) "Passou do orçado" else "Ainda pode gastar",
                    modifier = Modifier.padding(top = 12.dp),
                )
                Text(formatCentavos(ainda), style = MaterialTheme.typography.headlineMedium)
                if (orcado > 0) {
                    val frase = buildString {
                        append("Gastou ${formatCentavos(gasto)} de ${formatCentavos(orcado)}")
                        if (dias != null) append(". Faltam $dias dias neste mês, incluindo hoje")
                    }
                    Text(frase, modifier = Modifier.padding(top = 8.dp))
                    val frac = (gasto.toFloat() / orcado.toFloat()).coerceIn(0f, 1f)
                    LinearProgressIndicator(
                        progress = { frac },
                        modifier = Modifier.fillMaxWidth().padding(top = 8.dp),
                        color = MaterialTheme.colorScheme.primary,
                    )
                } else if (dias != null) {
                    Text("Faltam $dias dias neste mês, incluindo hoje")
                }
                Text("Total orçado ${formatCentavos(orcado)}", modifier = Modifier.padding(top = 12.dp))
                Text("Total gasto ${formatCentavos(gasto)}")
                LazyColumn(Modifier.padding(top = 12.dp).weight(1f)) {
                    items(totais.porTipo) { tipo ->
                        Column(
                            Modifier
                                .fillMaxWidth()
                                .clickable { onOpenTipo(tipo.tipo) }
                                .padding(vertical = 8.dp),
                        ) {
                            Text(labelTipo(tipo.tipo), style = MaterialTheme.typography.titleMedium)
                            Text("realizado ${formatCentavos(tipo.realizadoCentavos)} · planejado ${formatCentavos(tipo.planoCentavos)}")
                        }
                    }
                }
            }
        }
    }
}

fun labelTipo(tipo: String): String = when (tipo) {
    "R" -> "Receitas"
    "F" -> "Despesas fixas"
    "V" -> "Despesas variáveis"
    "E" -> "Anuais / eventuais"
    else -> tipo
}
