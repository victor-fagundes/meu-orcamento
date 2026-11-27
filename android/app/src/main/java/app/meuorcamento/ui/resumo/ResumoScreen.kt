package app.meuorcamento.ui.resumo

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import app.meuorcamento.ui.theme.ValorDisplay
import app.meuorcamento.ui.theme.corMedidor
import app.meuorcamento.data.ApiClient
import app.meuorcamento.data.ApiException
import app.meuorcamento.domain.formatCentavos
import app.meuorcamento.ui.CompetenciaPicker
import app.meuorcamento.ui.OfflineBanner
import app.meuorcamento.ui.Preferencias
import app.meuorcamento.ui.components.BotaoOlho
import app.meuorcamento.ui.copy.Strings
import androidx.compose.foundation.isSystemInDarkTheme
import kotlinx.coroutines.launch
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
    val context = LocalContext.current
    val prefs = remember { Preferencias(context) }
    val valoresOcultos by prefs.valoresOcultos.collectAsState(initial = false)
    val scope = rememberCoroutineScope()

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

    fun formatar(valor: Long): String = if (valoresOcultos) "••••" else formatCentavos(valor)

    val totais = data?.totais
    Column(Modifier.fillMaxSize()) {
        CompetenciaPicker(competencia, onCompetencia)
        Column(
            Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 16.dp),
        ) {
            OfflineBanner(offline || error != null, error)
            when {
                loading && totais == null -> CircularProgressIndicator(Modifier.padding(24.dp))
                totais == null -> Text(Strings.erroCarregarOrcamento)
                else -> {
                    val ainda = totais.aindaPodeGastarCentavos
                    val orcado = totais.totalOrcadoDespesasCentavos
                    val gasto = totais.totalGastoDespesasCentavos
                    val dias = diasRestantesNoMes(competencia)
                    val estourou = ainda < 0
                    Row(
                        Modifier.fillMaxWidth().padding(top = 8.dp),
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Text(
                            if (estourou) Strings.passouDoOrcado else Strings.disponivelNesteMes,
                            style = MaterialTheme.typography.labelLarge,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.weight(1f),
                        )
                        BotaoOlho(
                            oculto = valoresOcultos,
                            onToggle = {
                                scope.launch { prefs.setValoresOcultos(!valoresOcultos) }
                            },
                        )
                    }
                    Text(
                        formatar(ainda),
                        style = ValorDisplay,
                        color = if (estourou) MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.onSurface,
                    )
                    if (orcado > 0) {
                        val frase = buildString {
                            append("${Strings.gastou} ${formatar(gasto)} de ${formatar(orcado)}")
                            if (dias != null) append(". ${Strings.faltam} $dias ${Strings.diasNesteMes}")
                        }
                        Text(
                            frase,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.padding(top = 4.dp, bottom = 8.dp),
                        )
                        val frac = (gasto.toFloat() / orcado.toFloat()).coerceIn(0f, 1f)
                        LinearProgressIndicator(
                            progress = { frac },
                            modifier = Modifier.fillMaxWidth().height(8.dp).clip(RoundedCornerShape(99.dp)),
                            color = corMedidor(orcado, gasto, isSystemInDarkTheme()),
                            trackColor = MaterialTheme.colorScheme.surfaceVariant,
                        )
                    } else if (dias != null) {
                        Text(
                            "${Strings.faltam} $dias ${Strings.diasNesteMes}",
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                    }
                    Column(
                        Modifier.padding(top = 18.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp),
                    ) {
                        val tipos = totais.porTipo
                        tipos.chunked(2).forEach { par ->
                            Row(
                                Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(12.dp),
                            ) {
                                par.forEach { tipo ->
                                    CartaoTipo(
                                        tipo = tipo,
                                        valoresOcultos = valoresOcultos,
                                        onClick = { onOpenTipo(tipo.tipo) },
                                        modifier = Modifier.weight(1f),
                                    )
                                }
                                if (par.size == 1) {
                                    Column(Modifier.weight(1f)) {}
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun CartaoTipo(
    tipo: TotalTipoDto,
    valoresOcultos: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
) {
    fun formatar(v: Long) = if (valoresOcultos) "••••" else formatCentavos(v)
    Card(
        onClick = onClick,
        modifier = modifier,
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
    ) {
        Column(Modifier.padding(16.dp)) {
            Text(
                labelTipo(tipo.tipo),
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
            Text(
                formatar(tipo.realizadoCentavos),
                style = MaterialTheme.typography.titleLarge,
                modifier = Modifier.padding(top = 4.dp),
                maxLines = 1,
            )
            Text(
                "de ${formatar(tipo.planoCentavos)} planejados",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.padding(top = 2.dp),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
        }
    }
}

fun labelChip(tipo: String): String = when (tipo) {
    "R" -> Strings.receitas
    "F" -> Strings.fixas
    "V" -> Strings.variaveis
    "E" -> Strings.anuais
    else -> tipo
}

fun labelTipo(tipo: String): String = when (tipo) {
    "R" -> Strings.receitas
    "F" -> Strings.despesasFixas
    "V" -> Strings.despesasVariaveis
    "E" -> Strings.anuaisEventuais
    else -> tipo
}
