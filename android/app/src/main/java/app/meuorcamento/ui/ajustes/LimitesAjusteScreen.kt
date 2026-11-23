package app.meuorcamento.ui.ajustes

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import app.meuorcamento.data.ApiClient
import app.meuorcamento.data.ApiException
import app.meuorcamento.ui.BarraTitulo
import app.meuorcamento.ui.OfflineBanner
import kotlinx.coroutines.launch
import kotlinx.serialization.encodeToString
import java.io.IOException

@Composable
fun LimitesAjusteScreen(
    api: ApiClient,
    onBack: () -> Unit,
    onUnauthorized: () -> Unit,
) {
    var globalPct by remember { mutableStateOf("80") }
    var salvoPct by remember { mutableStateOf("80") }
    var offline by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf<String?>(null) }
    val scope = rememberCoroutineScope()

    LaunchedEffect(Unit) {
        scope.launch {
            try {
                val lim = api.json.decodeFromString(LimitesResponse.serializer(), api.get("/api/v1/limites"))
                val pct = (lim.limites?.globalPct ?: 80).toString()
                globalPct = pct
                salvoPct = pct
            } catch (e: ApiException) {
                if (e.status == 401) onUnauthorized() else error = e.message
            } catch (e: IOException) {
                offline = true
                error = e.message
            }
        }
    }

    Column(Modifier.fillMaxSize().padding(horizontal = 16.dp)) {
        BarraTitulo("Limites de alerta", onAnterior = onBack, rotuloAnterior = "Voltar")
        OfflineBanner(offline || error != null, error)
        OutlinedTextField(
            value = globalPct,
            onValueChange = { globalPct = it.filter(Char::isDigit) },
            label = { Text("Limite global, de 1 a 100") },
            modifier = Modifier.fillMaxWidth(),
        )
        Button(onClick = {
            val pct = globalPct.toIntOrNull()
            if (pct == null || pct !in 1..100) {
                error = "Informe um inteiro de 1 a 100."
                globalPct = salvoPct
                return@Button
            }
            scope.launch {
                try {
                    api.putJson("/api/v1/limites", api.json.encodeToString(SaveLimitesBody(pct)))
                    salvoPct = pct.toString()
                    error = null
                } catch (e: Exception) {
                    error = e.message
                }
            }
        }, modifier = Modifier.padding(top = 8.dp)) { Text("Salvar limites") }
    }
}
