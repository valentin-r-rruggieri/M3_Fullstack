/*
 * ============================================================
 *  src/ui.js  —  Capa de renderizado (básica, mejorable)
 * ============================================================
 *
 *  ?  ANTI-PATRÓN 9: No cachea referencias del DOM
 *  ?  ANTI-PATRÓN 10: buildCard está inline, no es reutilizable
 *  ?  ANTI-PATRÓN 11: getUserMessage incompleto
 *  ?  ANTI-PATRÓN 12: Usa datos crudos en vez de ViewModel
 *
 *  ?  Corregido por: PROMPT 03 — Refactor de Arquitectura
 *  ?  Archivo final: resolution/src/ui.js
 * ============================================================
 */

/*
 * ============================================================
 *  ANTI-PATRÓN 9: No cachea referencias del DOM
 * ============================================================
 *
 *  PROBLEMA:
 *    Cada vez que se llama a render(), ejecuta
 *    document.getElementById() para CADA elemento del DOM.
 *    Esto es ineficiente porque busca en el DOM cada vez
 *    aunque los elementos nunca cambian.
 *
 *  DETECCIÓN:
 *    En DevTools → Performance, grabá una recarga y observá
 *    que los getElementById aparecen en cada frame de render.
 *
 *  SOLUCIÓN (Prompt 03):
 *    Usar una función init() que cachee las referencias:
 *      var $loading, $error, $success, $badge, $errorMessage;
 *      function init() {
 *        $loading = document.getElementById("loading");
 *        $error = document.getElementById("error");
 *        ...
 *      }
 *      // Llamar init() una sola vez al principio
 * ============================================================
 */
export function render(state) {
  document.getElementById("loading").classList.toggle("hidden", state.status !== "loading");
  document.getElementById("error").classList.toggle("hidden", state.status !== "error");
  document.getElementById("grid").classList.toggle("hidden", state.status !== "success");
  document.getElementById("badge").textContent = "estado: " + state.status;

  if (state.status === "error") {
    document.getElementById("error-message").textContent = state.error?.message || "Error desconocido";
  }

  /*
   * ============================================================
   *  ANTI-PATRÓN 10: buildCard está inline
   * ============================================================
   *
   *  PROBLEMA:
   *    El HTML de la card se construye directamente dentro del
   *    .map(). No se puede reutilizar, testear, o modificar
   *    fácilmente.
   *
   *  SOLUCIÓN (Prompt 03):
   *    function buildCard(profile) { return "..."; }
   *    Y acá simplemente: state.data.map(buildCard).join("")
   * ============================================================
   *
   *  ANTI-PATRÓN 12: Usa datos crudos en vez de ViewModel
   * ============================================================
   *
   *  PROBLEMA:
   *    Render espera que item tenga: id, name, occupation, status
   *    Pero recibe objetos crudos de la API que pueden faltar
   *    o tener estructura anidada.
   *
   *    Además NO usa statusClass (necesario para CSS de colores)
   *    ni phrase (la frase del personaje).
   *
   *  SOLUCIÓN (Prompt 03):
   *    Recibir ViewModels ya transformados:
   *      profile.name       → string limpio
   *      profile.image      → URL completa del CDN
   *      profile.statusClass → "alive" | "dead" | "unknown"
   *      profile.phrase     → primera frase o "Sin frases"
   * ============================================================
   */
  if (state.status === "success" && state.data) {
    document.getElementById("grid").innerHTML = state.data.map(function (item) {
      return '\n        <div class="card">\n          <img src="https://cdn.thesimpsonsapi.com/500/character/' + item.id + '.webp" alt="' + item.name + '" />\n          <h3>' + item.name + '</h3>\n          <p>' + (item.occupation || "Sin trabajo") + '</p>\n          <span class="status">' + item.status + '</span>\n        </div>\n      ';
    }).join("");
  }
}

/*
 * ============================================================
 *  ANTI-PATRÓN 11: getUserMessage incompleto
 * ============================================================
 *
 *  PROBLEMA:
 *    Solo cubre 3 casos: offline, error.message, y default.
 *    No distingue entre:
 *      - HTTP 404 (personajes no encontrados)
 *      - HTTP 5xx (error del servidor)
 *      - NO_RESULTS (búsqueda sin resultados)
 *      - Timeout (conexión lenta)
 *
 *  SOLUCIÓN (Prompt 03):
 *    Casos específicos:
 *      if (error?.code === "NO_RESULTS")
 *        return "No se encontraron personajes con ese nombre.";
 *      if (error?.message?.startsWith("HTTP 404"))
 *        return "Personajes no encontrados (404).";
 *      if (error?.message?.startsWith("HTTP 5"))
 *        return "El servidor no responde. Intentá más tarde.";
 * ============================================================
 */
export function getUserMessage(error) {
  if (!navigator.onLine) return "Sin conexión a internet";
  if (error?.message) return error.message;
  return "Ocurrió un error inesperado";
}

/*
 * ============================================================
 *  RESUMEN: Lo que cambia con PROMPT 03
 * ============================================================
 *
 *  ui.js refactorizado:
 *    - init() para cachear referencias DOM (una sola vez)
 *    - buildCard(profile) función separada, reutilizable
 *    - render() usa referencias cacheadas y buildCard
 *    - getUserMessage() cubre: offline, 404, 5xx, NO_RESULTS, default
 *
 *  Los ViewModels llegan desde transform/character.js con:
 *    profile.id, .name, .image (URL completa), .occupation,
 *    .status, .statusClass, .phrase, .age, .gender
 * ============================================================
 */