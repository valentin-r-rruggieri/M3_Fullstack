/*
 * jokeUtils.js — Funciones puras para testear
 *
 * Estas funciones no tocan el DOM, no hacen fetch y no dependen de Gemini.
 * Por eso son ideales para unit testing.
 *
 * ESTE ES EL PRIMER ARCHIVO QUE COMPLETA EL ALUMNO.
 *
 * Objetivo didactico:
 * - Ver tests fallando en jokeUtils.test.js.
 * - Leer que comportamiento espera cada test.
 * - Corregir estas funciones hasta que los tests pasen.
 *
 * Regla:
 * - No tocar app.js para arreglar estos tests.
 * - No tocar los tests para "hacerlos pasar".
 * - La solucion debe estar en estas funciones.
 */

// TODO 1:
// Corregir formatJoke(joke).
//
// Problema actual:
//   La funcion devuelve el texto tal como llega.
//   Eso deja pasar strings con espacios extra y strings vacios.
//
// Comportamiento esperado:
// Si joke es null, undefined, string vacio o solo espacios:
//   return "No se pudo generar un chiste."
// Si viene texto:
//   return joke.trim()
//
// Pistas:
// - trim() elimina espacios al principio y al final.
// - Un string con solo espacios queda "" despues de trim().
// - El test "quita espacios extra" te marca el primer caso.
// - El test "devuelve fallback si viene vacio" te marca el segundo caso.
export function formatJoke(joke) {
  return joke;
}

// TODO 2:
// Corregir buildErrorMessage(error).
//
// Problema actual:
//   Devuelve "Error: ...", pero el test espera un mensaje mas humano
//   y consistente con la UI.
//
// Comportamiento esperado:
// Recibe un Error y devuelve un mensaje listo para mostrar en UI.
// Ejemplo:
//   buildErrorMessage(new Error("Error del servidor"))
//   -> "No pudimos generar el chiste: Error del servidor"
//
// Pistas:
// - error?.message evita romper si error viene null o undefined.
// - ?? permite usar "Error desconocido" si no hay message.
// - Este helper mantiene el texto de error fuera de app.js.
export function buildErrorMessage(error) {
  return `Error: ${error?.message ?? "Error desconocido"}`;
}
