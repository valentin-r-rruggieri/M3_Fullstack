// ============================================================
// state.js — Única fuente de verdad del estado de la app
// ============================================================
// Los 4 estados posibles de una operación asíncrona:
//   "idle"    -> inicial, sin búsqueda
//   "loading" -> fetch en curso
//   "success" -> datos recibidos
//   "error"   -> algo falló
// ============================================================

// TODO 1: Crear el objeto state con:
//   - status: "idle" (valor inicial)
//   - data: null
//   - error: null
//   - lastQuery: null  ← para guardar la última búsqueda (botón retry)
//
// const state = { ... }

// TODO 2: Implementar getState()
// Debe retornar una copia del state (no el objeto directo)
// para evitar mutaciones accidentales desde afuera.
// Tip: usar spread { ...state }
//
// export function getState() { ... }

// TODO 3: Implementar setState(updates)
// Debe fusionar el estado actual con los cambios recibidos.
// Tip: Object.assign(state, updates)
//
// export function setState(updates) { ... }
