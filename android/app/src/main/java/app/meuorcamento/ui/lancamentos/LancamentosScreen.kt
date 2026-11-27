package app.meuorcamento.ui.lancamentos

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.DatePicker
import androidx.compose.material3.DatePickerDialog
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.ExposedDropdownMenuBox
import androidx.compose.material3.ExposedDropdownMenuDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.rememberDatePickerState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import app.meuorcamento.data.ApiClient
import app.meuorcamento.data.ApiException
import app.meuorcamento.domain.formatCentavos
import app.meuorcamento.ui.CompetenciaPicker
import app.meuorcamento.ui.OfflineBanner
import app.meuorcamento.ui.components.BotaoPerigo
import app.meuorcamento.ui.components.BotaoPrimario
import app.meuorcamento.ui.components.BotaoTexto
import app.meuorcamento.ui.components.EmptyState
import app.meuorcamento.ui.components.FabEstendido
import app.meuorcamento.ui.copy.Strings
import app.meuorcamento.ui.reaisParaCentavos
import kotlinx.coroutines.launch
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import java.io.IOException
import java.util.Calendar
import java.util.TimeZone

@Serializable
data class LancListResponse(val competencia: String, val lancamentos: List<LancDto> = emptyList())

@Serializable
data class LancDto(
    val id: String,
    val itemId: String,
    val descricao: String? = null,
    val valorCentavos: Long,
    val dataTransacao: String,
    val competencia: String,
    val meio: String,
    val itemNome: String? = null,
    val cartaoId: String? = null,
    val cartaoApelido: String? = null,
    val parcelaN: Int? = null,
    val parcelaTotal: Int? = null,
    val grupoParcelaId: String? = null,
)

@Serializable
data class ItensResponse(val itens: List<ItemDto> = emptyList())

@Serializable
data class ItemDto(val id: String, val nome: String, val tipo: String, val grupo: String, val arquivado: Boolean = false)

@Serializable
data class CartoesResponse(val cartoes: List<CartaoDto> = emptyList())

@Serializable
data class CartaoDto(val id: String, val apelido: String, val ativo: Boolean = true)

@Serializable
data class CreateLancBody(
    val itemId: String,
    val descricao: String? = null,
    val valorCentavos: Long,
    val dataISO: String,
    val pagamento: String,
    val parcelas: Int? = null,
)

@Serializable
data class PatchLancBody(
    val itemId: String,
    val descricao: String? = null,
    val valorCentavos: Long,
    val dataISO: String,
    val pagamento: String,
    val scope: String = "one",
)

private data class PagamentoOpcao(val id: String, val rotulo: String)

private fun rotuloMeio(row: LancDto): String = when (row.meio) {
    "deb" -> Strings.debito
    "pix" -> Strings.pix
    "din" -> Strings.dinheiro
    "cartao" -> row.cartaoApelido ?: Strings.cartao
    else -> row.meio
}

private fun dataVisivel(iso: String): String {
    val parts = iso.take(10).split("-")
    if (parts.size != 3) return iso
    return "${parts[2]}/${parts[1]}/${parts[0]}"
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LancamentosScreen(
    api: ApiClient,
    competencia: String,
    onCompetencia: (String) -> Unit,
    onUnauthorized: () -> Unit,
) {
    var rows by remember { mutableStateOf<List<LancDto>>(emptyList()) }
    var itens by remember { mutableStateOf<List<ItemDto>>(emptyList()) }
    var cartoes by remember { mutableStateOf<List<CartaoDto>>(emptyList()) }
    var loaded by remember { mutableStateOf(false) }
    var offline by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf<String?>(null) }
    var showForm by remember { mutableStateOf(false) }
    var editing by remember { mutableStateOf<LancDto?>(null) }
    var pendingDelete by remember { mutableStateOf<LancDto?>(null) }
    var scopeChoice by remember { mutableStateOf("one") }
    val scope = rememberCoroutineScope()

    fun reload() {
        scope.launch {
            offline = false
            error = null
            try {
                val body = api.get("/api/v1/lancamentos?competencia=$competencia")
                val parsed = api.json.decodeFromString(LancListResponse.serializer(), body)
                rows = parsed.lancamentos
                val itensBody = api.json.decodeFromString(ItensResponse.serializer(), api.get("/api/v1/itens"))
                itens = itensBody.itens.filter { !it.arquivado }
                cartoes = api.json.decodeFromString(CartoesResponse.serializer(), api.get("/api/v1/cartoes")).cartoes
                    .filter { it.ativo }
                loaded = true
            } catch (e: ApiException) {
                if (e.status == 401) onUnauthorized() else error = e.message
            } catch (e: IOException) {
                offline = true
                error = e.message
            }
        }
    }

    LaunchedEffect(competencia) { reload() }

    Box(Modifier.fillMaxSize()) {
        Column(Modifier.fillMaxSize()) {
            CompetenciaPicker(competencia, onCompetencia)
            Column(Modifier.padding(horizontal = 16.dp)) {
                OfflineBanner(offline || error != null, error)
            }

            if (showForm) {
                Column(Modifier.padding(horizontal = 16.dp)) {
                LancamentoForm(
                    itens = itens,
                    cartoes = cartoes,
                    editing = editing,
                    competencia = competencia,
                    onCancel = { showForm = false; editing = null },
                    onSave = { item, valorTexto, dataISO, descricao, pagamento, parcelas, editScope ->
                        val cents = reaisParaCentavos(valorTexto)
                        if (cents == null) {
                            error = Strings.informeValorMaiorZero
                            return@LancamentoForm
                        }
                        scope.launch {
                            try {
                                val atual = editing
                                if (atual == null) {
                                    api.postJson(
                                        "/api/v1/lancamentos",
                                        api.json.encodeToString(
                                            CreateLancBody(
                                                itemId = item.id,
                                                descricao = descricao.ifBlank { null },
                                                valorCentavos = cents,
                                                dataISO = dataISO,
                                                pagamento = pagamento,
                                                parcelas = parcelas,
                                            ),
                                        ),
                                    )
                                } else {
                                    api.patchJson(
                                        "/api/v1/lancamentos/${atual.id}",
                                        api.json.encodeToString(
                                            PatchLancBody(
                                                itemId = item.id,
                                                descricao = descricao.ifBlank { null },
                                                valorCentavos = cents,
                                                dataISO = dataISO,
                                                pagamento = pagamento,
                                                scope = editScope,
                                            ),
                                        ),
                                    )
                                }
                                showForm = false
                                editing = null
                                reload()
                            } catch (e: ApiException) {
                                if (e.status == 401) onUnauthorized() else error = e.message
                            } catch (e: Exception) {
                                error = e.message
                                offline = e is IOException
                            }
                        }
                    },
                )
                }
            }

            if (loaded && rows.isEmpty() && error == null && !showForm) {
                EmptyState(
                    titulo = "Nenhum lançamento",
                    frase = "Registre o primeiro gasto ou receita deste mês.",
                )
            }

            LazyColumn(Modifier.weight(1f).padding(bottom = 96.dp)) {
                items(rows, key = { it.id }) { row ->
                    val titulo = row.descricao?.takeIf { it.isNotBlank() } ?: (row.itemNome ?: "Lançamento")
                    Column(Modifier.padding(horizontal = 16.dp, vertical = 8.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                titulo,
                                modifier = Modifier.weight(1f),
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis,
                            )
                            Text(formatCentavos(row.valorCentavos), maxLines = 1, softWrap = false)
                        }
                        Text(
                            "${dataVisivel(row.dataTransacao)} · ${row.itemNome ?: Strings.item} · ${rotuloMeio(row)}",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                        )
                        RowActions(
                            onEdit = {
                                editing = row
                                showForm = true
                            },
                            onDelete = {
                                pendingDelete = row
                                scopeChoice = "one"
                            },
                        )
                    }
                }
            }
        }
        if (!showForm) {
            FabEstendido(
                text = "+ ${Strings.registrar}",
                onClick = { editing = null; showForm = true },
                modifier = Modifier
                    .align(Alignment.BottomEnd)
                    .padding(end = 16.dp, bottom = 88.dp),
            )
        }
    }

    pendingDelete?.let { row ->
        AlertDialog(
            onDismissRequest = { pendingDelete = null },
            title = { Text(Strings.excluirLancamento) },
            text = {
                Column {
                    Text("Excluir ${formatCentavos(row.valorCentavos)} de ${row.itemNome ?: Strings.item}? Não há como desfazer.")
                    if (row.grupoParcelaId != null) {
                        Text("Este lançamento faz parte de um parcelamento.", modifier = Modifier.padding(top = 8.dp))
                        listOf("one" to Strings.soEstaParcela, "future" to Strings.estaEAsProximas, "all" to "Todas do grupo").forEach { (id, rotulo) ->
                            TextButton(onClick = { scopeChoice = id }) {
                                Text(if (scopeChoice == id) "● $rotulo" else rotulo)
                            }
                        }
                    }
                }
            },
            confirmButton = {
                BotaoPerigo(
                    text = Strings.excluir,
                    onClick = {
                        val alvo = row
                        val chosen = scopeChoice
                        pendingDelete = null
                        scope.launch {
                            try {
                                val escopo = if (alvo.grupoParcelaId != null) chosen else "one"
                                api.delete("/api/v1/lancamentos/${alvo.id}?scope=$escopo")
                                reload()
                            } catch (e: Exception) {
                                error = e.message
                            }
                        }
                    },
                )
            },
            dismissButton = {
                TextButton(onClick = { pendingDelete = null }) { Text(Strings.cancelar) }
            },
        )
    }
}

@Composable
private fun RowActions(onEdit: () -> Unit, onDelete: () -> Unit) {
    Row {
        BotaoTexto(text = Strings.corrigir, onClick = onEdit)
        BotaoTexto(text = Strings.excluir, onClick = onDelete, perigoso = true)
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun LancamentoForm(
    itens: List<ItemDto>,
    cartoes: List<CartaoDto>,
    editing: LancDto?,
    competencia: String,
    onCancel: () -> Unit,
    onSave: (ItemDto, String, String, String, String, Int?, String) -> Unit,
) {
    var itemExpanded by remember { mutableStateOf(false) }
    var payExpanded by remember { mutableStateOf(false) }
    var selectedItem by remember(editing?.id) { mutableStateOf(itens.find { it.id == editing?.itemId }) }
    var valorTexto by remember(editing?.id) {
        mutableStateOf(
            editing?.let {
                val reais = it.valorCentavos / 100
                val cents = (it.valorCentavos % 100).toString().padStart(2, '0')
                "$reais,$cents"
            } ?: "",
        )
    }
    var dataISO by remember(editing?.id) { mutableStateOf(editing?.dataTransacao?.take(10) ?: "$competencia-15") }
    var descricao by remember(editing?.id) { mutableStateOf(editing?.descricao.orEmpty()) }
    var pagamento by remember(editing?.id) {
        mutableStateOf(editing?.cartaoId ?: editing?.meio?.takeIf { it == "deb" || it == "pix" || it == "din" } ?: "pix")
    }
    var parcelasTexto by remember { mutableStateOf("") }
    var editScope by remember(editing?.id) { mutableStateOf("one") }
    var showDate by remember { mutableStateOf(false) }
    val dateState = rememberDatePickerState()
    val focus = remember { FocusRequester() }
    val opcoes = buildList {
        add(PagamentoOpcao("deb", Strings.debito))
        add(PagamentoOpcao("pix", Strings.pix))
        add(PagamentoOpcao("din", Strings.dinheiro))
        cartoes.forEach { add(PagamentoOpcao(it.id, it.apelido)) }
    }
    val rotuloPagamento = opcoes.find { it.id == pagamento }?.rotulo ?: Strings.pix

    LaunchedEffect(editing?.id) { focus.requestFocus() }

    ExposedDropdownMenuBox(expanded = itemExpanded, onExpandedChange = { itemExpanded = it }) {
        OutlinedTextField(
            value = selectedItem?.nome ?: Strings.item,
            onValueChange = {},
            readOnly = true,
            label = { Text(Strings.item) },
            modifier = Modifier.menuAnchor().fillMaxWidth().padding(vertical = 4.dp),
            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(itemExpanded) },
        )
        ExposedDropdownMenu(expanded = itemExpanded, onDismissRequest = { itemExpanded = false }) {
            itens.forEach { item ->
                DropdownMenuItem(text = { Text("${item.nome} · ${item.grupo}") }, onClick = {
                    selectedItem = item
                    itemExpanded = false
                })
            }
        }
    }
    OutlinedTextField(
        value = valorTexto,
        onValueChange = { valorTexto = it },
        label = { Text(Strings.valorReais) },
        modifier = Modifier.fillMaxWidth().focusRequester(focus),
    )
    TextButton(onClick = { showDate = true }) { Text("${Strings.data} ${dataVisivel(dataISO)}") }
    OutlinedTextField(
        value = descricao,
        onValueChange = { descricao = it },
        label = { Text(Strings.descricao) },
        modifier = Modifier.fillMaxWidth(),
    )
    ExposedDropdownMenuBox(expanded = payExpanded, onExpandedChange = { payExpanded = it }) {
        OutlinedTextField(
            value = rotuloPagamento,
            onValueChange = {},
            readOnly = true,
            label = { Text(Strings.pagamento) },
            modifier = Modifier.menuAnchor().fillMaxWidth().padding(vertical = 4.dp),
            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(payExpanded) },
        )
        ExposedDropdownMenu(expanded = payExpanded, onDismissRequest = { payExpanded = false }) {
            opcoes.forEach { op ->
                DropdownMenuItem(text = { Text(op.rotulo) }, onClick = {
                    pagamento = op.id
                    payExpanded = false
                })
            }
        }
    }
    if (editing == null) {
        OutlinedTextField(
            value = parcelasTexto,
            onValueChange = { parcelasTexto = it.filter(Char::isDigit) },
            label = { Text(Strings.parcelasOpcional) },
            modifier = Modifier.fillMaxWidth(),
        )
    }
    if (editing?.grupoParcelaId != null) {
        Text(Strings.escopoCorrecao, modifier = Modifier.padding(top = 8.dp))
        listOf("one" to Strings.soEstaParcela, "future" to Strings.estaEAsProximas).forEach { (id, rotulo) ->
            TextButton(onClick = { editScope = id }) {
                Text(if (editScope == id) "● $rotulo" else rotulo)
            }
        }
    }
    Row {
        BotaoTexto(text = Strings.cancelar, onClick = onCancel)
        BotaoPrimario(
            text = Strings.salvar,
            onClick = {
                val item = selectedItem ?: return@BotaoPrimario
                val parcelas = parcelasTexto.toIntOrNull()?.takeIf { it >= 2 }
                onSave(item, valorTexto, dataISO, descricao, pagamento, parcelas, editScope)
            },
            modifier = Modifier.padding(top = 8.dp),
        )
    }

    if (showDate) {
        DatePickerDialog(
            onDismissRequest = { showDate = false },
            confirmButton = {
                TextButton(onClick = {
                    val millis = dateState.selectedDateMillis
                    if (millis != null) {
                        val cal = Calendar.getInstance(TimeZone.getTimeZone("UTC"))
                        cal.timeInMillis = millis
                        dataISO = "%04d-%02d-%02d".format(
                            cal.get(Calendar.YEAR),
                            cal.get(Calendar.MONTH) + 1,
                            cal.get(Calendar.DAY_OF_MONTH),
                        )
                    }
                    showDate = false
                }) { Text(Strings.confirmar) }
            },
            dismissButton = { TextButton(onClick = { showDate = false }) { Text(Strings.cancelar) } },
        ) {
            DatePicker(state = dateState)
        }
    }
}
