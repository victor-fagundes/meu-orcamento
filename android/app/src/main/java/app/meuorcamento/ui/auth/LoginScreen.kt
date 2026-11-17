package app.meuorcamento.ui.auth

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Button
import androidx.compose.material3.CircularProgressIndicator
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
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import app.meuorcamento.BuildConfig
import app.meuorcamento.data.ApiException
import app.meuorcamento.data.AuthRepository
import app.meuorcamento.ui.OfflineBanner
import app.meuorcamento.ui.theme.Marca
import kotlinx.coroutines.launch
import java.io.IOException

@Composable
fun LoginScreen(
    auth: AuthRepository,
    onSignedIn: () -> Unit,
) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var name by remember { mutableStateOf("") }
    var signUpMode by remember { mutableStateOf(false) }
    var loading by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf<String?>(null) }
    var offline by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()

    val isReleaseProd = !BuildConfig.DEBUG && BuildConfig.FLAVOR == "prod"

    Column(
        modifier = Modifier
            .fillMaxSize()
            .statusBarsPadding()
            .navigationBarsPadding()
            .padding(horizontal = 24.dp, vertical = 32.dp),
    ) {
        Marca()
        Text(
            "Meu Orçamento",
            style = MaterialTheme.typography.headlineSmall,
            modifier = Modifier.padding(top = 12.dp, bottom = 24.dp),
        )
        OfflineBanner(offline, error)

        if (signUpMode) {
            OutlinedTextField(
                value = name,
                onValueChange = { name = it },
                label = { Text("Nome") },
                modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp),
                singleLine = true,
            )
        }
        OutlinedTextField(
            value = email,
            onValueChange = { email = it },
            label = { Text("E-mail") },
            modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp),
            singleLine = true,
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
        )
        OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            label = { Text("Senha") },
            modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp),
            singleLine = true,
            visualTransformation = PasswordVisualTransformation(),
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
        )

        if (!error.isNullOrBlank() && !offline) {
            Text(error!!, color = MaterialTheme.colorScheme.error, modifier = Modifier.padding(top = 8.dp))
        }

        Spacer(Modifier.height(12.dp))
        if (loading) {
            CircularProgressIndicator()
        } else {
            Button(
                onClick = {
                    if (isReleaseProd && email.trim().equals("demo@local.test", ignoreCase = true)) {
                        error = "Use sua conta de produção."
                        return@Button
                    }
                    scope.launch {
                        loading = true
                        error = null
                        offline = false
                        try {
                            if (signUpMode) {
                                auth.signUp(email, password, name.ifBlank { email.substringBefore("@") })
                            } else {
                                auth.signIn(email, password)
                            }
                            onSignedIn()
                        } catch (e: ApiException) {
                            offline = false
                            error = e.message ?: "Falha ao autenticar"
                        } catch (e: IOException) {
                            offline = true
                            error = e.message ?: "Sem conexão"
                        } finally {
                            loading = false
                        }
                    }
                },
                modifier = Modifier.fillMaxWidth(),
            ) {
                Text(if (signUpMode) "Cadastrar" else "Entrar")
            }
            TextButton(onClick = { signUpMode = !signUpMode; error = null }) {
                Text(if (signUpMode) "Já tenho conta" else "Criar conta")
            }
        }
    }
}
