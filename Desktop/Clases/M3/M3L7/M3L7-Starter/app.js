/*
 * app.js — Frontend del Dad Joke Generator
 *
 * En el Starter dejamos lista toda la interacción con el DOM para no sumar
 * complejidad innecesaria a la clase. El foco de M3L7 es el patrón seguro:
 *
 *   navegador → /api/joke → serverless function → process.env → Gemini
 *
 * El único comportamiento "falso" de este archivo es getJoke(): por ahora
 * devuelve un chiste hardcodeado. En clase lo vamos a reemplazar por fetch('/api/joke').
 *
 * Anti-patrón que NO implementamos:
 *
 * const API_KEY = "AIzaSyD-ejemplo-esto-es-lo-que-nunca-hay-que-hacer"
 *
 * Si una key real vive en app.js, cualquiera la puede ver en DevTools → Sources.
 */
const API_KEY = "AIzaSyD-ejemplo-esto-es-lo-que-nunca-hay-que-hacer"
const btn = document.getElementById("joke-btn");
const output = document.getElementById("joke-output");
const text = document.getElementById("joke-text");
const errBox = document.getElementById("error-output");
const errTxt = document.getElementById("error-text");

function showLoading() {
  btn.disabled = true;
  btn.textContent = "Generando...";
  output.classList.add("hidden");
  errBox.classList.add("hidden");
}

function showJoke(joke) {
  text.textContent = joke;
  output.classList.remove("hidden");
}

function showError(message) {
  errTxt.textContent = message;
  errBox.classList.remove("hidden");
}

function resetButton() {
  btn.disabled = false;
  btn.textContent = "Generá un chiste";
}

/*
 * TODO EN CLASE:
 * Reemplazar este getJoke hardcodeado por un fetch a /api/joke.
 *
 * Versión final esperada:
 *
 * async function getJoke() {
 *   const response = await fetch("/api/joke", {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify({ topic: "anything" }),
 *   })
 *
 *   if (!response.ok) {
 *     const err = await response.json()
 *     throw new Error(err.error || "Error del servidor")
 *   }
 *
 *   const data = await response.json()
 *   return data.joke
 * }
 */
async function getJoke() {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return "¿Por qué el libro de matemáticas estaba triste? Porque tenía demasiados problemas.";
}

btn.addEventListener("click", async () => {
  showLoading();

  try {
    const joke = await getJoke();
    showJoke(joke);
  } catch (error) {
    showError(`No pudimos generar el chiste: ${error.message}`);
  } finally {
    resetButton();
  }
});
