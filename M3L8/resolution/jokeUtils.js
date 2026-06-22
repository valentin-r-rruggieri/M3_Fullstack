/*
 * jokeUtils.js — Funciones puras testeables
 *
 * No tocan DOM, no hacen fetch y no dependen de Gemini.
 */

export function formatJoke(joke) {
  if (!joke || joke.trim().length === 0) {
    return "No se pudo generar un chiste.";
  }

  return joke.trim();
}

export function buildErrorMessage(error) {
  return `No pudimos generar el chiste: ${error?.message ?? "Error desconocido"}`;
}
