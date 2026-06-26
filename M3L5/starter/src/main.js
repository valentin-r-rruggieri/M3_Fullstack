/*
 * ============================================================
 *  src/main.js  —  Coordinador principal (ANTI-PATRÓN)
 * ============================================================
 *
 *  ?  ANTI-PATRÓN 5: Mezcla fetch + render sin separación
 *  ?  ANTI-PATRÓN 6: No usa getFirstSixCharacters
 *  ?  ANTI-PATRÓN 7: Renderiza datos crudos de la API
 *  ?  ANTI-PATRÓN 8: No hay capa de transformación
 *
 *  ?  Corregido por: PROMPT 03 — Refactor de Arquitectura
 *  ?  Archivo final: resolution/src/main.js
 * ============================================================
 */

/*
 * ============================================================
 *  Imports actuales
 * ============================================================
 *
 *  PROBLEMA: Importamos fetchCharacters directamente, pero
 *  deberíamos usar getFirstSixCharacters que limita a 6.
 *
 *  TAMBIÉN FALTA: importar toCharacterProfileList desde
 *  transform/character.js para convertir raw API → ViewModel.
 *
 *  SOLUCIÓN (Prompt 03):
 *    import { getFirstSixCharacters } from "./api.js";
 *    import { toCharacterProfileList } from "./transform/character.js";
 *    import { getState, setState } from "./state.js";
 *    import { render, getUserMessage } from "./ui.js";
 * ============================================================
 */
import { fetchCharacters, getFirstSixCharacters } from "./api.js";
import { getState, setState } from "./state.js";
import { render, getUserMessage } from "./ui.js";

/*
 * ============================================================
 *  ANTI-PATRÓN 5: loadCharacters mezcla todo
 * ============================================================
 *
 *  PROBLEMA:
 *    Esta función hace TODO junto:
 *    1. Llama a fetch (a través de fetchCharacters)
 *    2. Maneja el estado
 *    3. Llama al render
 *
 *    No hay separación de responsabilidades. Si algo falla,
 *    es difícil saber dónde.
 *
 *    Además NO usa getFirstSixCharacters, así que trae
 *    TODOS los personajes (página completa) en vez de solo 6.
 *
 *  DETECCIÓN:
 *    1. Abrí DevTools → Network
 *    2. Recargá la app
 *    3. Observá que la respuesta tiene 20 personajes (no 6)
 *    4. Observá que la UI muestra error porque data.map() falla
 *       (data es el objeto raíz, no un array)
 *
 *  SOLUCIÓN (Prompt 03):
 *    Separar en un pipeline claro:
 *      loading → getFirstSixCharacters → toCharacterProfileList → success
 * ============================================================
 */
function loadCharacters(name) {
  /*
   * Renderiza loading manualmente (sin usar setState).
   * Esto es otro anti-patrón: estamos llamando render()
   * directamente en vez de usar setState() que luego llama a render().
   */
  render({ status: "loading", data: null, error: null });

  /*
   * ANTI-PATRÓN 6: No usa getFirstSixCharacters
   *
   * Llama a fetchCharacters que:
   * 1. No valida response.ok (ANTI-PATRÓN 2)
   * 2. Devuelve el objeto raíz, no el array (ANTI-PATRÓN 3)
   *
   * Si todo funcionara bien igual traería 20 personajes en vez de 6.
   */
  fetchCharacters(name)
    .then(function (raw) {
      /*
       * ANTI-PATRÓN 7: Renderiza datos crudos de la API
       *
       * raw es el objeto raíz { count, next, prev, pages, results }.
       * Lo guarda directamente en state.data.
       *
       * Cuando render() haga state.data.map(...) va a fallar
       * porque los objetos NO tienen método .map().
       *
       * SOLUCIÓN (Prompt 03):
       *   var profiles = toCharacterProfileList(raw);
       *   setState({ status: "success", data: profiles, error: null });
       */
      setState({ status: "success", data: raw, error: null });
      render(getState());
    })
    .catch(function (err) {
      /*
       * Si llegamos acá, el error se muestra en la UI.
       * Pero si la API responde 404 sin response.ok,
       * el catch NUNCA se ejecuta (ANTI-PATRÓN 2).
       */
      setState({ status: "error", data: null, error: err });
      render(getState());
    });
}

/*
 * Botón de reintentar — funciona bien, no necesita cambios.
 */
document.getElementById("retry").addEventListener("click", function () {
  loadCharacters("homer");
});

/*
 * Carga inicial.
 */
loadCharacters("homer");

/*
 * ============================================================
 *  RESUMEN: Lo que cambia con PROMPT 03
 * ============================================================
 *
 *  Archivo final: resolution/src/main.js
 *
 *  Se CREA transform/character.js (nuevo archivo):
 *    - toCharacterProfile(raw) → ViewModel plano con ?. y ??
 *    - toCharacterProfileList(rawArray) → Array.map()
 *    - getStatusClass(status) → "Alive" → "alive" (para CSS)
 *    - getFirstPhrase(phrases) → primera frase o "Sin frases"
 *
 *  main.js refactorizado:
 *    - Usa getFirstSixCharacters (trae solo 6)
 *    - Usa toCharacterProfileList (transforma los datos)
 *    - Pipeline limpio: loading → fetch → transform → success/error
 *    - Usa setState + render (no render directo)
 * ============================================================
 */