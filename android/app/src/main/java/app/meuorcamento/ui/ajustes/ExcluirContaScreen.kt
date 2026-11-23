package app.meuorcamento.ui.ajustes

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
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
import androidx.compose.ui.unit.dp
import app.meuorcamento.data.ApiClient
import app.meuorcamento.data.ApiException
import app.meuorcamento.data.AuthRepository
import app.meuorcamento.ui.BarraTitulo
import kotlinx.coroutines.launch
import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString
import java.io.IOException

@Serializable
private data class ExcluirBody(val confirmPhrase: String)

@Composable
fun ExcluirContaScreen(
    api: ApiClient,
    auth: AuthRepository,
    onBack: () -> Unit,
    onSignedOut: () -> Unit,
    onUnauthorized: () -> Unit,
) {
    var email by remember { mutableStateOf<String?>(null) }
    var arm by remember { mutableStateOf(false) }
    var phrase by remember { mutableStateOf("") }
    var error by remember { mutableStateOf<String?>(null) }
    val scope = rememberCoroutineScope()

    androidx.compose.runtime.LaunchedEffect(Unit) {
        scope.launch {
            try {
                email = api.json.decodeFromString(ContaResponse.serializer(), api.get("/api/v1/conta")).email
            } catch (e: ApiException) {
                if (e.status == 401) onUnauthorized()
            } catch (_: IOException) {
                /* a frase de exclusão continua disponível */
            }
        }
    }

    Column(Modifier.fillMaxSize().padding(horizontal = 16.dp)) {
        BarraTitulo("Excluir conta", onAnterior = onBack, rotuloAnterior = "Voltar")
        Text(
            "Remove permanentemente a conta ${email ?: ""}, o orçamento, lançamentos, cartões e limites.",
            color = MaterialTheme.colorScheme.error,
        )
        if (!arm) {
            Button(onClick = { arm = true }, modifier = Modifier.padding(top = 16.dp)) {
                Text("Quero excluir minha conta…")
            }
        } else {
            OutlinedTextField(
                value = phrase,
                onValueChange = { phrase = it },
                label = { Text("Digite EXCLUIR para confirmar") },
                modifier = Modifier.fillMaxWidth().padding(top = 12.dp),
            )
            error?.let { Text(it, color = MaterialTheme.colorScheme.error, modifier = Modifier.padding(top = 8.dp)) }
            TextButton(onClick = { arm = false; phrase = ""; error = null }) { Text("Cancelar") }
            Button(
                onClick = {
                    scope.launch {
                        try {
                            api.delete("/api/v1/conta", api.json.encodeToString(ExcluirBody(phrase)))
                            auth.signOut()
                            onSignedOut()
                        } catch (e: ApiException) {
                            if (e.status == 401) onUnauthorized() else error = e.message ?: "Digite EXCLUIR para confirmar."
                        } catch (e: IOException) {
                            error = e.message
                        }
                    }
                },
                enabled = phrase.trim().equals("EXCLUIR", ignoreCase = true),
            ) { Text("Excluir definitivamente") }
        }
    }
}
