package app.meuorcamento.data

import android.content.Context
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey
import okhttp3.Cookie
import okhttp3.CookieJar
import okhttp3.HttpUrl
import okhttp3.HttpUrl.Companion.toHttpUrl

class SessionStore(context: Context) : CookieJar {
    private val prefs = EncryptedSharedPreferences.create(
        context,
        "meu_orcamento_session",
        MasterKey.Builder(context).setKeyScheme(MasterKey.KeyScheme.AES256_GCM).build(),
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM,
    )

    @Volatile
    private var memoryCookies: List<Cookie> = loadCookies()

    private fun loadCookies(): List<Cookie> {
        val raw = prefs.getString(KEY_COOKIES, null) ?: return emptyList()
        return raw.split("\n").mapNotNull { line ->
            val parts = line.split("|", limit = 4)
            if (parts.size < 4) return@mapNotNull null
            val url = parts[0].toHttpUrl()
            Cookie.parse(url, parts[3])
        }
    }

    private fun persist() {
        val serialized = memoryCookies.joinToString("\n") { c ->
            val url = "https://${c.domain}${c.path}".toHttpUrl()
            listOf(url.toString(), c.name, c.value, c.toString()).joinToString("|")
        }
        prefs.edit().putString(KEY_COOKIES, serialized).apply()
    }

    override fun saveFromResponse(url: HttpUrl, cookies: List<Cookie>) {
        if (cookies.isEmpty()) return
        val merged = memoryCookies.toMutableList()
        for (c in cookies) {
            merged.removeAll { it.name == c.name && it.domain == c.domain && it.path == c.path }
            merged.add(c)
        }
        memoryCookies = merged
        persist()
    }

    override fun loadForRequest(url: HttpUrl): List<Cookie> {
        return memoryCookies.filter { it.matches(url) }
    }

    fun clear() {
        memoryCookies = emptyList()
        prefs.edit().clear().apply()
    }

    fun hasSessionCookie(): Boolean = memoryCookies.any { it.name.contains("session", ignoreCase = true) || it.name.contains("better", ignoreCase = true) || memoryCookies.isNotEmpty() }

    companion object {
        private const val KEY_COOKIES = "cookies"
    }
}
