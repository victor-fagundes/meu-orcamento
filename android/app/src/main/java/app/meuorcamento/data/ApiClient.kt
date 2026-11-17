package app.meuorcamento.data

import app.meuorcamento.BuildConfig
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlinx.serialization.json.Json
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.MultipartBody
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.IOException
import java.util.concurrent.TimeUnit

class ApiException(val status: Int, message: String) : IOException(message)

class ApiClient(
    private val sessionStore: SessionStore,
    val baseUrl: String = BuildConfig.API_BASE_URL.trimEnd('/'),
) {
    val json = Json { ignoreUnknownKeys = true; isLenient = true }

    private val client = OkHttpClient.Builder()
        .cookieJar(sessionStore)
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(60, TimeUnit.SECONDS)
        .writeTimeout(60, TimeUnit.SECONDS)
        .build()

    suspend fun get(path: String): String = withContext(Dispatchers.IO) {
        val req = Request.Builder().url("$baseUrl$path").get().build()
        execute(req)
    }

    suspend fun postJson(path: String, body: String): String = withContext(Dispatchers.IO) {
        val req = Request.Builder()
            .url("$baseUrl$path")
            .post(body.toRequestBody(JSON))
            .header("Content-Type", "application/json")
            .build()
        execute(req)
    }

    suspend fun putJson(path: String, body: String): String = withContext(Dispatchers.IO) {
        val req = Request.Builder()
            .url("$baseUrl$path")
            .put(body.toRequestBody(JSON))
            .header("Content-Type", "application/json")
            .build()
        execute(req)
    }

    suspend fun patchJson(path: String, body: String): String = withContext(Dispatchers.IO) {
        val req = Request.Builder()
            .url("$baseUrl$path")
            .patch(body.toRequestBody(JSON))
            .header("Content-Type", "application/json")
            .build()
        execute(req)
    }

    suspend fun delete(path: String, body: String? = null): String = withContext(Dispatchers.IO) {
        val builder = Request.Builder().url("$baseUrl$path")
        if (body != null) {
            builder.delete(body.toRequestBody(JSON)).header("Content-Type", "application/json")
        } else {
            builder.delete()
        }
        execute(builder.build())
    }

    suspend fun postMultipart(path: String, fileName: String, bytes: ByteArray, mime: String): String =
        withContext(Dispatchers.IO) {
            val part = MultipartBody.Builder()
                .setType(MultipartBody.FORM)
                .addFormDataPart(
                    "file",
                    fileName,
                    bytes.toRequestBody(mime.toMediaType()),
                )
                .build()
            val req = Request.Builder().url("$baseUrl$path").post(part).build()
            execute(req)
        }

    private fun execute(req: Request): String {
        client.newCall(req).execute().use { resp ->
            val body = resp.body?.string().orEmpty()
            if (!resp.isSuccessful) {
                val err = runCatching {
                    json.decodeFromString<ErrorBody>(body).error
                }.getOrNull() ?: body.ifBlank { "HTTP ${resp.code}" }
                if (resp.code == 401) sessionStore.clear()
                throw ApiException(resp.code, err)
            }
            return body
        }
    }

    @kotlinx.serialization.Serializable
    private data class ErrorBody(val error: String)

    companion object {
        private val JSON = "application/json; charset=utf-8".toMediaType()
    }
}
