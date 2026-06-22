/*
 * main.js — Punto de entrada y coordinador del flujo
 *
 * Responsabilidades:
 *   1. Escuchar eventos del usuario (form submit, retry click)
 *   2. Coordinar estado -> fetch -> render
 *   3. NO contiene lógica de fetch ni de DOM: eso está en api.js y ui.js
 *
 * Flujo de una búsqueda:
 *   submit -> loading -> fetch -> success/error -> render
 */

import { getPokemon } from "./api.js";
import { getState, setState } from "./state.js";
import { render } from "./ui.js";

// Render inicial — muestra estado idle al cargar la app
render(getState());

// ─── Búsqueda ────────────────────────────────────────────────────────────────

async function handleSearch(query) {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return;

  // 1. Pasar a loading: limpia estado anterior, muestra spinner
  setState({ status: "loading", data: null, error: null, lastQuery: trimmed });
  render(getState());

  try {
    // 2. Fetch — puede lanzar error de red O error HTTP (gracias a fetchJson)
    const pokemon = await getPokemon(trimmed);

    // 3. Éxito: guardar datos y mostrar tarjeta
    setState({ status: "success", data: pokemon });
    render(getState());
  } catch (error) {
    // 4. Error: mostrar mensaje legible al usuario
    const msg = error.message.includes("404")
      ? `No encontramos un Pokémon llamado "${trimmed}". ¿Está bien escrito?`
      : `Error de conexión: ${error.message}`;

    setState({ status: "error", error: msg });
    render(getState());
  }
}

// ─── Eventos ─────────────────────────────────────────────────────────────────

// Form submit
document.querySelector("#search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const query = document.querySelector("#search-input").value;
  handleSearch(query);
});

// Botón Reintentar — reutiliza lastQuery guardado en estado
document.querySelector("#retry-btn").addEventListener("click", () => {
  const { lastQuery } = getState();
  if (lastQuery) {
    handleSearch(lastQuery);
  }
});
