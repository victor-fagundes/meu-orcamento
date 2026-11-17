package app.meuorcamento

import android.content.Context
import app.meuorcamento.data.ApiClient
import app.meuorcamento.data.AuthRepository
import app.meuorcamento.data.SessionStore

class AppGraph(context: Context) {
    val sessionStore = SessionStore(context.applicationContext)
    val api = ApiClient(sessionStore)
    val auth = AuthRepository(api, sessionStore)
}
