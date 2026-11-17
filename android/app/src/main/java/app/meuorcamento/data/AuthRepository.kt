package app.meuorcamento.data

import kotlinx.serialization.Serializable
import kotlinx.serialization.encodeToString

class AuthRepository(
    private val api: ApiClient,
    private val sessionStore: SessionStore,
) {
    @Serializable
    private data class EmailPass(val email: String, val password: String, val name: String? = null)

    @Serializable
    private data class SessionUser(val email: String? = null)

    @Serializable
    private data class SessionPayload(val user: SessionUser? = null)

    suspend fun signIn(email: String, password: String) {
        api.postJson(
            "/api/auth/sign-in/email",
            api.json.encodeToString(EmailPass(email.trim(), password)),
        )
    }

    suspend fun signUp(email: String, password: String, name: String) {
        api.postJson(
            "/api/auth/sign-up/email",
            api.json.encodeToString(EmailPass(email.trim(), password, name)),
        )
    }

    suspend fun signOut() {
        runCatching { api.postJson("/api/auth/sign-out", "{}") }
        sessionStore.clear()
    }

    suspend fun getSessionEmail(): String? {
        val body = api.get("/api/auth/get-session")
        if (body.isBlank() || body == "null") return null
        return runCatching { api.json.decodeFromString<SessionPayload>(body).user?.email }.getOrNull()
    }

    fun clearLocal() = sessionStore.clear()
}
