/*
 * apiClient.js — Fetch separado de la UI
 *
 * NO TOCAR EN CLASE:
 * Esta funcion ya viene completa porque la lecture no busca rearmar fetch.
 *
 * QUE TIENE QUE ENTENDER EL ALUMNO:
 * - getJoke() es la frontera entre frontend y backend.
 * - app.js llama a getJoke(), pero no sabe nada de fetch.
 * - getJoke() llama a /api/joke con POST.
 * - Si el backend responde ok, devuelve data.joke.
 * - Si el backend responde error, lanza Error para que app.js entre al catch.
 *
 * QUE SE AGREGA EN CLASE:
 * - En apiClient.test.js vamos a mockear fetch.
 * - No vamos a llamar al endpoint real en el test.
 * - El test verifica el contrato: URL, metodo, headers y body.
 */

export async function getJoke() {
  // Request al endpoint serverless de M3L7.
  // Importante: el frontend llama a /api/joke, no llama directo a Gemini.
  const response = await fetch("/api/joke", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic: "anything" }),
  });

  // Parseamos el body para leer joke o error.
  const data = await response.json();

  // fetch no lanza error automaticamente ante HTTP 500.
  // Por eso chequeamos response.ok y lanzamos Error manualmente.
  if (!response.ok) {
    throw new Error(data.error || "Error del servidor");
  }

  // Este es el valor que app.js recibe y despues pasa por formatJoke().
  return data.joke;
}
