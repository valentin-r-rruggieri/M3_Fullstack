/*
 * app.js — Frontend del Dad Joke Generator
 *
 * FLUJO:
 *   1. Usuario hace clic en el botón
 *   2. Frontend llama a fetch('/api/joke') — POST
 *   3. La serverless function llama a Gemini con la API key (segura)
 *   4. El chiste llega de vuelta y se muestra en pantalla
 *
 * ¿Por qué el frontend NO llama directo a Gemini?
 *   Porque la API key estaría visible en DevTools para cualquier usuario.
 *   El frontend SOLO habla con /api/joke — nunca con Gemini directamente.
 */

const btn    = document.getElementById('joke-btn')
const output = document.getElementById('joke-output')
const text   = document.getElementById('joke-text')
const errBox = document.getElementById('error-output')
const errTxt = document.getElementById('error-text')

// ── Helpers de UI ──────────────────────────────────────────────────────────

function showLoading() {
  btn.disabled = true
  btn.textContent = 'Generando...'
  output.classList.add('hidden')
  errBox.classList.add('hidden')
}

function showJoke(joke) {
  text.textContent = joke
  output.classList.remove('hidden')
}

function showError(msg) {
  errTxt.textContent = msg
  errBox.classList.remove('hidden')
}

function resetBtn() {
  btn.disabled = false
  btn.textContent = 'Generá un chiste'
}

// ── Llamada al backend ─────────────────────────────────────────────────────

/*
 * getJoke() — llama a la serverless function en /api/joke
 *
 * ¿Por qué POST y no GET?
 *   Queremos poder enviar datos en el body (ej: tema del chiste).
 *   Es un estándar para endpoints que hacen "trabajo" o consumen recursos.
 */
async function getJoke() {
  const response = await fetch('/api/joke', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic: 'anything' }),
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.error || 'Error del servidor')
  }

  const data = await response.json()
  return data.joke
}

// ── Event handler ──────────────────────────────────────────────────────────

btn.addEventListener('click', async () => {
  showLoading()
  try {
    const joke = await getJoke()
    showJoke(joke)
  } catch (err) {
    showError(`No pudimos generar el chiste: ${err.message}`)
  } finally {
    resetBtn()
  }
})
