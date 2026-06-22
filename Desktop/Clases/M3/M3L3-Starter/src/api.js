// ============================================================
// api.js — Capa de comunicación con la PokéAPI
// ============================================================
// Tu tarea: implementar fetchJson() y getPokemon() con el
// patrón correcto de doble await y validación de response.ok
// ============================================================

const BASE_URL = "https://pokeapi.co/api/v2/pokemon";

// TODO 1: Implementar fetchJson(url)
//
// Esta función encapsula el patrón completo de fetch robusto:
//
//   Paso 1: await fetch(url)
//           -> retorna un objeto Response (NO los datos todavía)
//           -> este es el PRIMER await
//
//   Paso 2: if (!response.ok) throw new Error(...)
//           -> CRÍTICO: fetch NO rechaza la promesa con 404 o 500
//           -> debemos lanzar el error nosotros si response.ok === false
//           -> sin esto, un 404 parece éxito
//
//   Paso 3: await response.json()
//           -> deserializa el body del response a objeto JS
//           -> este es el SEGUNDO await (necesario porque el body
//              también es un stream asíncrono)
//
//   Paso 4: return data
//
// export async function fetchJson(url) { ... }

// TODO 2: Implementar getPokemon(name)
//
// Construye la URL con BASE_URL y el nombre normalizado
// (minúsculas, sin espacios) y llama a fetchJson().
// Ejemplo de URL: https://pokeapi.co/api/v2/pokemon/pikachu
//
// export async function getPokemon(name) { ... }
