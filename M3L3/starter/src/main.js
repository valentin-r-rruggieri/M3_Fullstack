// ============================================================
// STARTER — Anti-patrón: fetch directo sin estados ni manejo
// ============================================================
// Esta app "funciona" con Pokémon válidos, pero tiene 4 bugs:
//
//   1. No hay estado "loading" -> pantalla en blanco mientras carga
//   2. No valida response.ok  -> el 404 no entra al catch
//   3. Es fácil olvidar el segundo await -> data puede ser Promise{pending}
//   4. Sin .catch()           -> los errores de red desaparecen en silencio
//
// Tu tarea: reescribir esto usando api.js, state.js y ui.js
// ============================================================

// ❌ Anti-patrón activo:
document.querySelector("#search-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const query = document.querySelector("#search-input").value.trim();
  if (!query) return;

  // ❌ Bug 1: no mostramos loading, la pantalla queda igual mientras espera

  // ❌ Bug 2: fetch sin doble await explícito ni response.ok
  fetch(`https://pokeapi.co/api/v2/pokemon/${query}`)
    .then((response) => response.json()) // ← sin validar response.ok
    .then((data) => {
      // ❌ Bug 3: escritura directa al DOM, sin estado
      const card = document.querySelector("#pokemon-card");
      card.innerHTML = `<p>${data.name}</p>`; // puede ser undefined si 404
      document.querySelector("#state-idle").classList.add("hidden");
      document.querySelector("#state-success").classList.remove("hidden");
    });
  // ❌ Bug 4: sin .catch -> errores de red son silenciosos para la UI
});

// ============================================================
// TODO 1: Importar getPokemon desde ./api.js
// TODO 2: Importar getState, setState desde ./state.js
// TODO 3: Importar render desde ./ui.js
// TODO 4: Llamar render(getState()) al inicio (estado idle)
// TODO 5: Reescribir handleSearch() con el patrón correcto:
//           setState loading -> render -> await getPokemon ->
//           setState success/error -> render
// TODO 6: Reescribir el event listener del form usando handleSearch()
// TODO 7: Agregar event listener al #retry-btn usando lastQuery
// ============================================================
