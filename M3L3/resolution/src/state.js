/*
 * state.js — Única fuente de verdad del estado de la app
 *
 * Modelamos los 4 momentos posibles de una operación asíncrona:
 *   "idle"    -> antes de buscar, pantalla inicial
 *   "loading" -> fetch en curso, esperando respuesta
 *   "success" -> datos recibidos correctamente
 *   "error"   -> algo salió mal (red o HTTP)
 *
 * lastQuery guarda la última búsqueda para el botón Reintentar
 */

const state = {
  status: "idle", // "idle" | "loading" | "success" | "error"
  data: null, // objeto Pokémon si status === "success"
  error: null, // string de error si status === "error"
  lastQuery: null, // string del último nombre buscado (para retry)
};

export function getState() {
  // Retornamos copia para evitar mutación accidental desde afuera
  return { ...state };
}

export function setState(updates) {
  /*
   * Fusionamos el estado actual con los cambios.
   * Al mutar estado, quien llame debe llamar render() después.
   */
  Object.assign(state, updates);
}
