package app.meuorcamento.ui.orcamento

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.foundation.isSystemInDarkTheme
import app.meuorcamento.data.ApiClient
import app.meuorcamento.data.ApiException
import app.meuorcamento.domain.formatCentavos
import app.meuorcamento.ui.Campo
import app.meuorcamento.ui.CompetenciaPicker
import app.meuorcamento.ui.rotuloMesCivil
import app.meuorcamento.ui.OfflineBanner
import app.meuorcamento.ui.Rotulo
import app.meuorcamento.ui.cartao
import app.meuorcamento.ui.corCampo
import app.meuorcamento.ui.corDivisor
import app.meuorcamento.ui.corTrilha
import app.meuorcamento.ui.reaisParaCentavos
import app.meuorcamento.ui.resumo.ResumoItemDto
import app.meuorcamento.ui.resumo.ResumoResponse
import app.meuorcamento.ui.resumo.TotalGrupoDto
import app.meuorcamento.ui.resumo.labelChip
import app.meuorcamento.ui.resumo.labelTipo
import app.meuorcamento.ui.theme.AzulAcao
import app.meuorcamento.ui.theme.ValorDisplay
import app.meuorcamento.ui.theme.corMedidor
import kotlinx.coroutines.launch
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import java.io.IOException

private val TIPOS = listOf("R", "F", "V", "E")
private val CantoPainel = RoundedCornerShape(topStart = 28.dp, topEnd = 28.dp)

@Serializable
private data class PlanoItemDto(
    val id: String,
    val planoCentavos: List<Long> = emptyList(),
)

@Serializable
private data class PlanoResponse(val itens: List<PlanoItemDto> = emptyList())

@Serializable
private data class PlanoPutBody(val itemId: String, val mesesCentavos: List<Long>)

@Serializable
private data class NovoItemBody(val tipo: String, val grupo: String, val nome: String)

private fun indiceMes(competencia: String): Int {
    val month = competencia.substringAfter("-", "").toIntOrNull() ?: return 0
    return if (month in 1..12) month - 1 else 0
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OrcamentoScreen(
    api: ApiClient,
    competencia: String,
    onCompetencia: (String) -> Unit,
    tipo: String,
    onTipo: (String) -> Unit,
    onUnauthorized: () -> Unit,
) {
    var data by remember { mutableStateOf<ResumoResponse?>(null) }
    var loading by remember { mutableStateOf(true) }
    var offline by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf<String?>(null) }
    var semAberto by remember { mutableStateOf(false) }
    var armedId by remember { mutableStateOf<String?>(null) }
    var editItem by remember { mutableStateOf<ResumoItemDto?>(null) }
    var novoAberto by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()

    fun reload() {
        scope.launch {
            loading = data == null
            offline = false
            error = null
            try {
                val body = api.get("/api/v1/resumo?competencia=$competencia")
                data = api.json.decodeFromString(ResumoResponse.serializer(), body)
            } catch (e: ApiException) {
                if (e.status == 401) onUnauthorized() else {
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
    }

    LaunchedEffect(competencia) { reload() }

    val totais = data?.totais
    val linha = totais?.porTipo?.find { it.tipo == tipo }
    val grupos = totais?.porGrupo?.filter { it.tipo == tipo }.orEmpty()
    val comMovimento = grupos.filter { it.planoCentavos > 0 || it.realizadoCentavos > 0 }
    val semMovimento = grupos.filter { it.planoCentavos == 0L && it.realizadoCentavos == 0L }

    Column(
        Modifier
            .fillMaxSize()
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
            ) { armedId = null },
    ) {
        CompetenciaPicker(competencia, onCompetencia)
        Column(Modifier.padding(horizontal = 16.dp)) {
            OfflineBanner(offline || error != null, error)
            Row(
                Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(14.dp))
                    .background(corCampo())
                    .padding(4.dp),
            ) {
                TIPOS.forEach { code ->
                    val ativo = tipo == code
                    Text(
                        labelChip(code),
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(10.dp))
                            .background(if (ativo) MaterialTheme.colorScheme.primaryContainer else Color.Transparent)
                            .clickable { onTipo(code) }
                            .padding(vertical = 8.dp),
                        textAlign = TextAlign.Center,
                        fontWeight = FontWeight.Bold,
                        color = if (ativo) MaterialTheme.colorScheme.onPrimaryContainer else MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
            }
        }
        when {
            loading && totais == null -> CircularProgressIndicator(Modifier.padding(24.dp))
            totais == null -> Text("Não foi possível carregar o orçamento.", modifier = Modifier.padding(horizontal = 16.dp))
            else -> {
                val cabe = (linha?.planoCentavos ?: 0) - (linha?.realizadoCentavos ?: 0)
                Column(Modifier.padding(horizontal = 16.dp)) {
                    Rotulo("Ainda cabe em ${labelTipo(tipo).lowercase()}", modifier = Modifier.padding(top = 12.dp))
                    Text(
                        formatCentavos(cabe),
                        style = ValorDisplay,
                        color = if (cabe < 0) MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.onSurface,
                    )
                    TextButton(onClick = { novoAberto = true }) { Text("Novo item") }
                }
                LazyColumn(Modifier.weight(1f).padding(horizontal = 16.dp)) {
                    items(comMovimento, key = { "${it.tipo}-${it.grupo}" }) { grupo ->
                        GrupoBloco(
                            grupo = grupo,
                            itens = data?.itens.orEmpty(),
                            lancamentos = data?.lancamentos.orEmpty(),
                            armedId = armedId,
                            onArm = { armedId = it },
                            onEdit = { editItem = it },
                            onArchive = { id ->
                                scope.launch {
                                    try {
                                        api.delete("/api/v1/itens?id=$id")
                                        armedId = null
                                        reload()
                                    } catch (e: Exception) {
                                        error = e.message
                                    }
                                }
                            },
                        )
                    }
                    item {
                        if (semMovimento.isNotEmpty()) {
                            TextButton(onClick = { semAberto = !semAberto }) {
                                Text(if (semAberto) "Ocultar sem movimento" else "Sem movimento neste mês")
                            }
                        }
                    }
                    if (semAberto) {
                        items(semMovimento, key = { "z-${it.tipo}-${it.grupo}" }) { grupo ->
                            GrupoBloco(
                                grupo = grupo,
                                itens = data?.itens.orEmpty(),
                                lancamentos = data?.lancamentos.orEmpty(),
                                armedId = armedId,
                                onArm = { armedId = it },
                                onEdit = { editItem = it },
                                onArchive = { id ->
                                    scope.launch {
                                        try {
                                            api.delete("/api/v1/itens?id=$id")
                                            armedId = null
                                            reload()
                                        } catch (e: Exception) {
                                            error = e.message
                                        }
                                    }
                                },
                            )
                        }
                    }
                }
            }
        }
    }

    editItem?.let { item ->
        PlanoMesSheet(
            api = api,
            item = item,
            competencia = competencia,
            onUnauthorized = onUnauthorized,
            onClose = { editItem = null },
            onSaved = {
                editItem = null
                reload()
            },
            onError = { error = it },
        )
    }

    if (novoAberto) {
        NovoItemSheet(
            tipo = tipo,
            onClose = { novoAberto = false },
            onSave = { nome, grupo ->
                if (nome.isBlank()) return@NovoItemSheet
                scope.launch {
                    try {
                        api.postJson(
                            "/api/v1/itens",
                            api.json.encodeToString(NovoItemBody(tipo, grupo.ifBlank { "Outros" }, nome.trim())),
                        )
                        novoAberto = false
                        reload()
                    } catch (e: ApiException) {
                        if (e.status == 401) onUnauthorized() else error = e.message
                    } catch (e: Exception) {
                        error = e.message
                    }
                }
            },
        )
    }
}

@Composable
private fun GrupoBloco(
    grupo: TotalGrupoDto,
    itens: List<ResumoItemDto>,
    lancamentos: List<app.meuorcamento.ui.resumo.ResumoLancDto>,
    armedId: String?,
    onArm: (String) -> Unit,
    onEdit: (ResumoItemDto) -> Unit,
    onArchive: (String) -> Unit,
) {
    val doGrupo = itens.filter { it.tipo == grupo.tipo && it.grupo == grupo.grupo }
    val escuro = isSystemInDarkTheme()
    val cor = corMedidor(grupo.planoCentavos, grupo.realizadoCentavos, escuro)
    Column(Modifier.padding(top = 8.dp).cartao().padding(horizontal = 14.dp, vertical = 12.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(
                grupo.grupo,
                modifier = Modifier.weight(1f),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
                style = MaterialTheme.typography.titleMedium,
            )
            Text(
                formatCentavos(grupo.aindaCabeCentavos),
                maxLines = 1,
                softWrap = false,
                color = if (grupo.aindaCabeCentavos < 0) MaterialTheme.colorScheme.error else MaterialTheme.colorScheme.onSurface,
            )
        }
        val fraseCor = when {
            grupo.planoCentavos > 0 && grupo.realizadoCentavos > grupo.planoCentavos -> MaterialTheme.colorScheme.error
            grupo.planoCentavos > 0 && grupo.realizadoCentavos * 5 >= grupo.planoCentavos * 4 -> cor
            else -> MaterialTheme.colorScheme.onSurfaceVariant
        }
        Text(
            grupo.frase.ifBlank { "planejado ${formatCentavos(grupo.planoCentavos)} · realizado ${formatCentavos(grupo.realizadoCentavos)}" },
            color = fraseCor,
        )
        if (grupo.planoCentavos > 0 || grupo.realizadoCentavos > 0) {
            val frac = if (grupo.planoCentavos <= 0) 1f
            else (grupo.realizadoCentavos.toFloat() / grupo.planoCentavos.toFloat()).coerceIn(0f, 1f)
            LinearProgressIndicator(
                progress = { frac },
                modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp).height(8.dp).clip(RoundedCornerShape(99.dp)),
                color = cor,
                trackColor = corTrilha(),
            )
        }
        doGrupo.forEach { item ->
            val realizado = lancamentos.filter { it.itemId == item.id }.sumOf { it.valorCentavos }
            Row(Modifier.fillMaxWidth().padding(top = 4.dp), verticalAlignment = Alignment.CenterVertically) {
                Column(Modifier.weight(1f).clickable { onEdit(item) }) {
                    Text(item.nome, maxLines = 1, overflow = TextOverflow.Ellipsis)
                    Text(
                        "realizado ${formatCentavos(realizado)} · plano ${formatCentavos(item.planoMesCentavos)}",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                    )
                }
                val armed = armedId == item.id
                TextButton(onClick = {
                    if (armed) onArchive(item.id) else onArm(item.id)
                }) {
                    Text(if (armed) "Confirmar arquivar ${item.nome}" else "Arquivar ${item.nome}")
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun PlanoMesSheet(
    api: ApiClient,
    item: ResumoItemDto,
    competencia: String,
    onUnauthorized: () -> Unit,
    onClose: () -> Unit,
    onSaved: () -> Unit,
    onError: (String) -> Unit,
) {
    var texto by remember(item.id) { mutableStateOf("") }
    var meses by remember(item.id) { mutableStateOf<List<Long>>(List(12) { 0L }) }
    var aviso by remember { mutableStateOf<String?>(null) }
    val focus = remember { FocusRequester() }
    val scope = rememberCoroutineScope()
    val mes = indiceMes(competencia)

    LaunchedEffect(item.id) {
        try {
            val body = api.get("/api/v1/plano?competencia=$competencia")
            val plano = api.json.decodeFromString(PlanoResponse.serializer(), body)
            val found = plano.itens.find { it.id == item.id }
            val doze = List(12) { i -> found?.planoCentavos?.getOrNull(i) ?: 0L }
            meses = doze
            val cents = doze[mes]
            texto = "${cents / 100},${(cents % 100).toString().padStart(2, '0')}"
        } catch (e: ApiException) {
            if (e.status == 401) onUnauthorized() else onError(e.message ?: "Falha ao ler o plano")
        } catch (e: IOException) {
            onError(e.message ?: "Sem rede")
        }
        focus.requestFocus()
    }

    ModalBottomSheet(onDismissRequest = onClose, shape = CantoPainel) {
        Column(Modifier.padding(16.dp)) {
            Box(
                Modifier
                    .padding(bottom = 12.dp)
                    .size(width = 32.dp, height = 4.dp)
                    .clip(RoundedCornerShape(4.dp))
                    .background(corDivisor())
                    .align(Alignment.CenterHorizontally),
            )
            Text(item.nome, style = MaterialTheme.typography.titleLarge)
            Campo(
                rotulo = rotuloMesCivil(competencia).substringBefore(" ").replaceFirstChar { it.titlecase() },
                value = texto,
                onValueChange = { texto = it },
                modifier = Modifier.focusRequester(focus),
            )
            aviso?.let { Text(it, color = MaterialTheme.colorScheme.error) }
            Row(Modifier.padding(top = 12.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                TextButton(onClick = onClose, modifier = Modifier.weight(1f).heightIn(min = 44.dp)) {
                    Text("Cancelar", color = AzulAcao, fontWeight = FontWeight.Bold)
                }
                Button(
                    onClick = {
                    val cents = reaisParaCentavos(texto, permitirZero = true)
                    if (cents == null) {
                        aviso = "Informe um valor em reais, como 10,50."
                        return@Button
                    }
                    val next = meses.toMutableList()
                    while (next.size < 12) next.add(0L)
                    next[mes] = cents
                    scope.launch {
                        try {
                            api.putJson(
                                "/api/v1/plano",
                                api.json.encodeToString(PlanoPutBody(item.id, next.take(12))),
                            )
                            onSaved()
                        } catch (e: ApiException) {
                            if (e.status == 401) onUnauthorized() else aviso = e.message
                        } catch (e: Exception) {
                            aviso = e.message
                        }
                    }
                    },
                    modifier = Modifier.weight(1f).heightIn(min = 52.dp),
                    shape = RoundedCornerShape(14.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = AzulAcao, contentColor = Color.White),
                ) { Text("Salvar", fontWeight = FontWeight.ExtraBold) }
            }
            Box(Modifier.height(24.dp))
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun NovoItemSheet(
    tipo: String,
    onClose: () -> Unit,
    onSave: (nome: String, grupo: String) -> Unit,
) {
    var nome by remember { mutableStateOf("") }
    var grupo by remember { mutableStateOf("") }
    var aviso by remember { mutableStateOf<String?>(null) }
    val focus = remember { FocusRequester() }
    LaunchedEffect(Unit) { focus.requestFocus() }
    ModalBottomSheet(onDismissRequest = onClose, shape = CantoPainel) {
        Column(Modifier.padding(16.dp)) {
            Box(
                Modifier
                    .padding(bottom = 12.dp)
                    .size(width = 32.dp, height = 4.dp)
                    .clip(RoundedCornerShape(4.dp))
                    .background(corDivisor())
                    .align(Alignment.CenterHorizontally),
            )
            Text("Novo item · ${labelTipo(tipo)}", style = MaterialTheme.typography.titleLarge)
            OutlinedTextField(
                value = nome,
                onValueChange = { nome = it },
                label = { Text("Nome do item") },
                modifier = Modifier.fillMaxWidth().focusRequester(focus),
            )
            OutlinedTextField(
                value = grupo,
                onValueChange = { grupo = it },
                label = { Text("Grupo") },
                modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp),
            )
            aviso?.let { Text(it, color = MaterialTheme.colorScheme.error) }
            Row {
                TextButton(onClick = onClose) { Text("Cancelar") }
                Button(onClick = {
                    if (nome.isBlank()) {
                        aviso = "Informe o nome do item."
                        return@Button
                    }
                    onSave(nome, grupo)
                }) { Text("Salvar") }
            }
            Box(Modifier.height(24.dp))
        }
    }
}
