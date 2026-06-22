/*
 * api.js — Capa de red
 *
 * FIX JS: validación de response.ok
 * ──────────────────────────────────────────────────────────
 * PROBLEMA ORIGINAL (bug del starter):
 *   fetch() NO rechaza la promesa cuando el servidor responde 404 o 500.
 *   Solo rechaza ante fallos de red real (sin conexión, CORS, DNS).
 *   Si no validamos response.ok, un 404 pasa por el try como si fuera éxito,
 *   la UI se queda en "loading" y nunca muestra el estado de error.
 *
 * FIX:
 *   Después del primer await (respuesta de red), verificar response.ok.
 *   Si es false, lanzar error manualmente. El catch lo captura y la UI
 *   muestra el estado de error.
 *
 * Sin este fix, el estado "error" de la UI nunca se activa por errores HTTP.
 */

const API_URL = "https://jsonplaceholder.typicode.com/posts?_limit=8";

export async function fetchMessages() {
  const response = await fetch(API_URL);

  /* FIX: validar ANTES de parsear el body
   * Sin esta línea, un 404 o 500 pasa al .json() como si fuera éxito */
  if (!response.ok) {
    const err = new Error(
      "HTTP " + response.status + ": " + response.statusText
    );
    err.status = response.status;
    throw err;
  }

  return response.json();
}
