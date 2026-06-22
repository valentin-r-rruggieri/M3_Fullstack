/*
 * rmApi.js — Capa de red específica para la Rick & Morty API
 *
 * Responsabilidad única: construir URLs y hacer requests.
 * NO transforma datos. NO toca el DOM. NO sabe de estados de UI.
 *
 * Endpoint usado: GET /api/character/?name=rick&page=1
 * Devuelve: objeto con info (metadata) + results (array de personajes)
 */

import { fetchJson } from "./fetchJson.js";

const BASE_URL = "https://rickandmortyapi.com/api/character/";

/*
 * buildUrl({ name, page })
 * ─────────────────────────
 * Construye la URL con URLSearchParams para evitar bugs de encoding.
 *
 * ANTI-PATRÓN que evita:
 *   ❌ `${BASE_URL}?name=${name}&page=${page}` -> falla con "Rick & Morty"
 *
 * ✅ URLSearchParams codifica automáticamente:
 *   "Rick & Morty" -> "Rick+%26+Morty"
 */
export function buildUrl({ name, page = 1 }) {
  const params = new URLSearchParams({
    name: name.trim(),
    page: String(page),
  });

  return `${BASE_URL}?${params.toString()}`;
}

/*
 * fetchCharacters(name)
 * ──────────────────────
 * Busca personajes por nombre y retorna el ARRAY de resultados (raw).
 * Lanza error con code "NO_RESULTS" si la búsqueda no devuelve nada.
 */
export async function fetchCharacters(name) {
  const url = buildUrl({ name, page: 1 });
  const data = await fetchJson(url);

  const results = data.results;
  if (!Array.isArray(results) || results.length === 0) {
    const err = new Error("No results found");
    err.code = "NO_RESULTS";
    throw err;
  }

  return results;
}

/*
 * getFirstSixCharacters(name)
 * ────────────────────────────
 * La API devuelve hasta 20 por página; tomamos los primeros 6.
 */
export async function getFirstSixCharacters(name) {
  const results = await fetchCharacters(name);
  return results.slice(0, 6);
}
