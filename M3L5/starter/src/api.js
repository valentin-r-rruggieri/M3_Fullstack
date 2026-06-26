/*
 * ============================================================
 *  src/api.js  —  Capa de comunicación con la API
 * ============================================================
 *
 *  ?  ANTI-PATRÓN 1: Concatenación manual de URLs
 *  ?  ANTI-PATRÓN 2: Falta de validación response.ok
 *  ?  ANTI-PATRÓN 3: Devuelve el objeto raíz, no data.results
 *
 *  ?  Corregido por: PROMPT 01 — Debugger de API
 *  ?  Archivo final: resolution/src/api.js
 * ============================================================
 */

const API_BASE = "https://thesimpsonsapi.com/api";

/*
 * ============================================================
 *  ANTI-PATRÓN 1: Concatenación manual de URLs
 * ============================================================
 *
 *  PROBLEMA:
 *    Usamos + para concatenar la URL. Si name contiene caracteres
 *    especiales como "&", "?", o espacios, la URL se rompe.
 *
 *    Ejemplo:  name = "Bart & Lisa"
 *    Genera:   /characters?name=Bart & Lisa
 *    La URL se corta en el "&" y el servidor recibe solo "Bart ".
 *
 *  DETECCIÓN:
 *    1. Abrí DevTools → Console
 *    2. Escribí en la consola:
 *       const url = "https://thesimpsonsapi.com/api/characters?name=" + "Bart & Lisa"
 *    3. Observá que la URL resultado es incorrecta (el & se interpreta como separador de query params).
 *
 *  SOLUCIÓN (Prompt 01):
 *    Usar URLSearchParams para construir la URL de forma segura:
 *      const url = new URL(API_BASE + "/characters");
 *      url.searchParams.set("name", name);
 *      url.searchParams.set("page", "1");
 *      return url.toString();
 *
 *    Esto codifica automáticamente los caracteres especiales.
 * ============================================================
 */
export async function fetchCharacters(name) {
  const url = API_BASE + "/characters?name=" + name;

  /*
   * ============================================================
   *  ANTI-PATRÓN 2: Falta de validación response.ok
   * ============================================================
   *
   *  PROBLEMA:
   *    fetch() NO rechaza la promesa cuando el servidor responde
   *    con errores HTTP (404, 500). Solo rechaza si hay un error
   *    de red real (ej: no hay internet).
   *
   *    Si la API responde 404, el código igual ejecuta
   *    response.json() y el error pasa desapercibido.
   *    La UI se queda en "loading" para siempre.
   *
   *  DETECCIÓN:
   *    1. Abrí DevTools → Network
   *    2. Cambiá la URL por una inválida:
   *       const API_BASE = "https://thesimpsonsapi.com/api"
   *       /characters?name=xyz_no_existe
   *    3. Recargá la app
   *    4. Observá que Network muestra error 404 (rojo)
   *    5. Observá que la UI se queda en "Cargando personajes..."
   *    6. Observá que la consola NO muestra ningún error
   *
   *  SOLUCIÓN (Prompt 01):
   *    Validar response.ok ANTES de llamar a response.json():
   *      if (!response.ok) {
   *        throw new Error("HTTP " + response.status + ": " + response.statusText);
   *      }
   *      return response.json();
   * ============================================================
   */
  const response = await fetch(url);
  const data = await response.json();

  /*
   * ============================================================
   *  ANTI-PATRÓN 3: Devuelve el objeto raíz en vez de data.results
   * ============================================================
   *
   *  PROBLEMA:
   *    La API de Simpsons devuelve:
   *      { count: 1182, next: "...", prev: null, pages: 60, results: [...] }
   *
   *    El array de personajes está en data.results, pero devolvemos
   *    data (el objeto completo). Cuando main.js haga:
   *      state.data.map(...)  →  ERROR: data.map is not a function
   *
   *    Porque el objeto raíz NO tiene método .map().
   *
   *  DETECCIÓN:
   *    1. Abrí DevTools → Console
   *    2. Escribí:
   *       const api = await import("./src/api.js");
   *       const r = await api.fetchCharacters("homer");
   *       console.log(r);  // → { count, next, prev, pages, results }
   *       console.log(Array.isArray(r));  // → false
   *    3. Observá que NO es un array, es el objeto raíz.
   *
   *  SOLUCIÓN (Prompt 01):
   *    Extraer y validar data.results:
   *      const list = data.results;
   *      if (!Array.isArray(list)) {
   *        throw new Error("NO_RESULTS");
   *      }
   *      return list;
   * ============================================================
   */
  return data;
}

/*
 * ============================================================
 *  ANTI-PATRÓN 4: getFirstSixCharacters asume que data es array
 * ============================================================
 *
 *  PROBLEMA:
 *    Llama a fetchCharacters que devuelve el objeto raíz en vez
 *    del array. Al hacer data.slice(0,6) sobre el objeto raíz,
 *    JavaScript lanza: "data.slice is not a function"
 *
 *  DETECCIÓN:
 *    La UI nunca muestra personajes. En la consola aparece:
 *      Uncaught TypeError: data.slice is not a function
 *
 *  SOLUCIÓN (Prompt 01):
 *    Una vez que fetchCharacters devuelva data.results (un array),
 *    este código funcionará correctamente.
 * ============================================================
 */
export function getFirstSixCharacters(name) {
  return fetchCharacters(name).then(function (data) {
    return data.slice(0, 6);
  });
}

/*
 * ============================================================
 *  RESUMEN: Lo que cambia con PROMPT 01
 * ============================================================
 *
 *  Archivo final: resolution/src/api.js
 *
 *  Funciones que se agregan:
 *    - buildUrl(params)     → usa URLSearchParams
 *    - fetchJson(url)       → valida response.ok
 *
 *  Funciones que se corrigen:
 *    - fetchCharacters(name) → usa buildUrl + fetchJson + data.results
 *    - getFirstSixCharacters → funciona porque recibe un array real
 * ============================================================
 */