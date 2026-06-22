/*
 * api.js — Capa de comunicación con la PokéAPI
 *
 * Por qué fetchJson y no fetch directo:
 * - Centraliza el patrón doble-await
 * - Valida response.ok en un solo lugar
 * - Cualquier vista usa el mismo fetch robusto
 */

const BASE_URL = "https://pokeapi.co/api/v2/pokemon";

/*
 * fetchJson(url)
 * --------------
 * PRIMER await: espera la respuesta de red (headers + status)
 * SEGUNDO await: espera que el body se deserialice a JSON
 *
 * GOTCHA: fetch() NO rechaza la promesa ante errores HTTP (404, 500).
 * Por eso validamos response.ok ANTES de intentar parsear el body.
 * Si !response.ok -> lanzamos un Error nosotros -> el catch lo captura.
 */
export async function fetchJson(url) {
  const response = await fetch(url); // 1er await: respuesta de red

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} — ${response.statusText}`);
  }

  const data = await response.json(); // 2do await: parsear body
  return data;
}

/*
 * getPokemon(name)
 * ----------------
 * Consulta la PokéAPI y retorna el objeto pokemon completo.
 * Puede lanzar error si el nombre no existe (404) o hay fallo de red.
 */
export async function getPokemon(name) {
  const url = `${BASE_URL}/${name.toLowerCase().trim()}`;
  return await fetchJson(url);
}
