package app.meuorcamento.ui

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import app.meuorcamento.AppGraph
import app.meuorcamento.ui.auth.LoginScreen
import app.meuorcamento.ui.navigation.AppNav

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        val graph = AppGraph(applicationContext)
        setContent {
            MaterialTheme(
                colorScheme = lightColorScheme(
                    primary = Color(0xFF0057B8),
                    secondary = Color(0xFFFFE600),
                ),
            ) {
                Surface(Modifier.fillMaxSize()) {
                    var signedIn by remember { mutableStateOf<Boolean?>(null) }

                    LaunchedEffect(Unit) {
                        signedIn = runCatching {
                            graph.auth.getSessionEmail() != null
                        }.getOrDefault(false)
                    }

                    when (signedIn) {
                        null -> Unit
                        false -> LoginScreen(graph.auth) { signedIn = true }
                        true -> AppNav(
                            graph = graph,
                            onUnauthorized = {
                                graph.auth.clearLocal()
                                signedIn = false
                            },
                            onSignedOut = { signedIn = false },
                        )
                    }
                }
            }
        }
    }
}
