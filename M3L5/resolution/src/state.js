/*
 * state.js — Fuente única de verdad del estado de la app
 */
const state = {
  status: "loading",
  data: null,
  error: null,
};

export function getState() {
  return { ...state };
}

export function setState(updates) {
  Object.assign(state, updates);
}
