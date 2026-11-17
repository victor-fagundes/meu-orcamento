package app.meuorcamento.ui.importacao

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import app.meuorcamento.data.ApiClient
import app.meuorcamento.data.ApiException
import app.meuorcamento.ui.BarraTitulo
import app.meuorcamento.domain.formatCentavos
import app.meuorcamento.ui.OfflineBanner
import kotlinx.coroutines.launch
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import java.io.IOException

@Serializable
data class ColumnMapDto(
    val data: String = "",
    val valor: String = "",
    val desc: String = "",
    val cat: String = "",
    val item: String = "",
    val tipo: String = "",
    val meio: String = "",
)

@Serializable
data class ParsePlanilhaResponse(
    val kind: String,
    val rowsJson: String,
    val map: ColumnMapDto? = null,
    val rowCount: Int = 0,
    val filename: String? = null,
)

@Serializable
data class PlanoLineDto(
    val n: Int,
    val ok: Boolean = false,
    val why: String? = null,
    val nome: String = "",
    val grupo: String = "",
    val alvo: String = "",
    val candidatos: List<String> = emptyList(),
)

@Serializable
data class LancPreviewDto(
    val n: Int = 0,
    val ok: Boolean = false,
    val why: String? = null,
    val desc: String = "",
    val valCents: Long = 0,
    val grupo: String = "",
    val itemNome: String = "",
)

@Serializable
data class PreviewPlanilhaResponse(
    val kind: String = "",
    val lines: List<PlanoLineDto> = emptyList(),
    val preview: List<LancPreviewDto> = emptyList(),
)

@Serializable
data class EscolhaDto(val n: Int, val grupo: String)

@Serializable
data class ConfirmPlanilhaBody(
    val kind: String,
    val rowsJson: String,
    val map: ColumnMapDto? = null,
    val createItems: Boolean = true,
    val importDuplicates: Boolean = false,
    val defaultMeio: String = "pix",
    val escolhas: List<EscolhaDto> = emptyList(),
)

@Serializable
data class ConfirmPlanilhaResult(
    val imported: Int = 0,
    val abrirCompetencia: String? = null,
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PlanilhaImportScreen(
    api: ApiClient,
    onUnauthorized: () -> Unit,
    onOpenedMonth: (String) -> Unit,
) {
    var status by remember { mutableStateOf<String?>(null) }
    var offline by remember { mutableStateOf(false) }
    var parsed by remember { mutableStateOf<ParsePlanilhaResponse?>(null) }
    var preview by remember { mutableStateOf<PreviewPlanilhaResponse?>(null) }
    var escolhas by remember { mutableStateOf<Map<Int, String>>(emptyMap()) }
    val scope = rememberCoroutineScope()
    val context = LocalContext.current

    fun limpar() {
        parsed = null
        preview = null
        escolhas = emptyMap()
        status = null
    }

    val picker = rememberLauncherForActivityResult(ActivityResultContracts.GetContent()) { uri: Uri? ->
        if (uri == null) return@rememberLauncherForActivityResult
        scope.launch {
            offline = false
            status = null
            preview = null
            escolhas = emptyMap()
            try {
                val bytes = context.contentResolver.openInputStream(uri)?.use { it.readBytes() }
                    ?: throw IOException("Não foi possível ler o arquivo")
                if (bytes.size > 4 * 1024 * 1024) throw IOException("Arquivo maior que 4 MB")
                val name = uri.lastPathSegment ?: "planilha.xlsx"
                val mime = context.contentResolver.getType(uri) ?: "application/octet-stream"
                val body = api.postMultipart("/api/v1/import/planilha/parse", name, bytes, mime)
                val parsedBody = api.json.decodeFromString(ParsePlanilhaResponse.serializer(), body)
                parsed = parsedBody
                val previewBody = api.postJson(
                    "/api/v1/import/planilha/preview",
                    api.json.encodeToString(
                        ConfirmPlanilhaBody(
                            kind = parsedBody.kind,
                            rowsJson = parsedBody.rowsJson,
                            map = parsedBody.map,
                        ),
                    ),
                )
                preview = api.json.decodeFromString(PreviewPlanilhaResponse.serializer(), previewBody)
                status = "Prévia pronta (${parsedBody.kind})"
            } catch (e: ApiException) {
                if (e.status == 401) onUnauthorized() else status = e.message
                parsed = null
            } catch (e: IOException) {
                offline = true
                status = e.message
                parsed = null
            }
        }
    }

    val linhasPlano = preview?.lines.orEmpty()
    val faltaEscolha = linhasPlano.any { it.ok && it.alvo == "escolher" && escolhas[it.n].isNullOrBlank() }

    Column(Modifier.fillMaxSize()) {
        BarraTitulo("Importar planilha")
        Column(
            Modifier
                .weight(1f)
                .padding(horizontal = 16.dp)
                .verticalScroll(rememberScrollState()),
        ) {
        OfflineBanner(offline, status)
        Button(onClick = { picker.launch("*/*") }) { Text("Escolher arquivo") }
        status?.let { Text(it, modifier = Modifier.padding(top = 8.dp)) }
        linhasPlano.forEach { line ->
            Text(
                buildString {
                    append(line.nome.ifBlank { "Linha ${line.n}" })
                    if (!line.ok) append(" — ${line.why ?: "rejeitada"}")
                    else if (line.alvo != "escolher") append(" — ${line.grupo}")
                },
                modifier = Modifier.padding(top = 8.dp),
            )
            if (line.ok && line.alvo == "escolher") {
                EscolhaGrupo(
                    escolhido = escolhas[line.n].orEmpty(),
                    candidatos = line.candidatos,
                    onPick = { escolhas = escolhas + (line.n to it) },
                )
            }
        }
        preview?.preview?.forEach { row ->
            Text(
                "${row.itemNome.ifBlank { row.desc }} · ${formatCentavos(row.valCents)}" +
                    if (row.ok) "" else " — ${row.why ?: "rejeitada"}",
                modifier = Modifier.padding(top = 8.dp),
            )
        }
        if (parsed != null) {
            TextButton(onClick = { limpar() }) { Text("Cancelar") }
        }
        Button(
            enabled = parsed != null && preview != null && !faltaEscolha,
            onClick = {
                val p = parsed ?: return@Button
                if (faltaEscolha) return@Button
                scope.launch {
                    try {
                        val payload = escolhas.filterValues { it.isNotBlank() }
                            .map { (n, grupo) -> EscolhaDto(n, grupo) }
                        val resultBody = api.postJson(
                            "/api/v1/import/planilha/confirm",
                            api.json.encodeToString(
                                ConfirmPlanilhaBody(
                                    kind = p.kind,
                                    rowsJson = p.rowsJson,
                                    map = p.map,
                                    escolhas = payload,
                                ),
                            ),
                        )
                        val result = api.json.decodeFromString(ConfirmPlanilhaResult.serializer(), resultBody)
                        limpar()
                        status = "Importados: ${result.imported}"
                        val destino = result.abrirCompetencia
                        if (!destino.isNullOrBlank()) onOpenedMonth(destino)
                    } catch (e: Exception) {
                        status = e.message
                        offline = e is IOException
                    }
                }
            },
            modifier = Modifier.padding(top = 8.dp),
        ) { Text("Confirmar importação") }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun EscolhaGrupo(
    escolhido: String,
    candidatos: List<String>,
    onPick: (String) -> Unit,
) {
    var aberto by remember { mutableStateOf(false) }
    ExposedDropdownMenuBox(expanded = aberto, onExpandedChange = { aberto = it }) {
        OutlinedTextField(
            value = escolhido.ifBlank { "Escolha o grupo" },
            onValueChange = {},
            readOnly = true,
            modifier = Modifier.menuAnchor().fillMaxWidth(),
            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(aberto) },
        )
        ExposedDropdownMenu(expanded = aberto, onDismissRequest = { aberto = false }) {
            candidatos.forEach { key ->
                DropdownMenuItem(text = { Text(key) }, onClick = {
                    onPick(key)
                    aberto = false
                })
            }
        }
    }
}
