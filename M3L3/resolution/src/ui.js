/*
 * ui.js — Todo lo que toca el DOM
 *
 * UNA sola función render(state) decide qué mostrar.
 * Patrón: ocultar todo -> mostrar solo el panel que corresponde.
 * Esto garantiza que nunca haya dos paneles visibles a la vez.
 */

// Referencias DOM (se toman una sola vez)
const $idle = document.querySelector("#state-idle");
const $loading = document.querySelector("#state-loading");
const $success = document.querySelector("#state-success");
const $error = document.querySelector("#state-error");
const $card = document.querySelector("#pokemon-card");
const $errMsg = document.querySelector("#error-message");
const $badge = document.querySelector("#state-badge");
const $btn = document.querySelector("#search-btn");

export function render(state) {
  // 1. Ocultar todos los paneles
  [$idle, $loading, $success, $error].forEach((el) => {
    el.classList.add("hidden");
  });

  // 2. Actualizar badge de debug (estado visible en pantalla)
  $badge.textContent = `estado: ${state.status}`;

  // 3. Mostrar el panel correcto según estado
  if (state.status === "idle") {
    $idle.classList.remove("hidden");
    $btn.disabled = false;
  } else if (state.status === "loading") {
    $loading.classList.remove("hidden");
    $btn.disabled = true; // evitar doble submit mientras carga
  } else if (state.status === "success") {
    $success.classList.remove("hidden");
    $card.innerHTML = buildPokemonCard(state.data);
    $btn.disabled = false;
  } else if (state.status === "error") {
    $error.classList.remove("hidden");
    $errMsg.textContent = state.error;
    $btn.disabled = false;
  }
}

/*
 * buildPokemonCard(pokemon)
 * -------------------------
 * Construye el HTML de la tarjeta con los datos del pokémon.
 * Campos usados: name, id, sprites, types, height, weight, base_experience
 */
function buildPokemonCard(pokemon) {
  const img =
    pokemon.sprites.other["official-artwork"].front_default ||
    pokemon.sprites.front_default ||
    "";
  const name = pokemon.name;
  const id = `#${String(pokemon.id).padStart(3, "0")}`;
  const height = (pokemon.height / 10).toFixed(1) + " m";
  const weight = (pokemon.weight / 10).toFixed(1) + " kg";
  const experience = pokemon.base_experience || "N/D";
  const types = pokemon.types
    .map((item) => `<span class="pokemon-card__type">${item.type.name}</span>`)
    .join("");

  return `
    <div class="pokemon-card__media">
      <img src="${img}" alt="Imagen de ${name}" />
    </div>
    <div class="pokemon-card__header">
      <h2 class="pokemon-card__name">${name}</h2>
      <p class="pokemon-card__id">${id}</p>
    </div>
    <div class="pokemon-card__types">${types}</div>
    <div class="pokemon-card__stats">
      <div class="pokemon-card__stat">
        <span>Altura</span>
        <strong>${height}</strong>
      </div>
      <div class="pokemon-card__stat">
        <span>Peso</span>
        <strong>${weight}</strong>
      </div>
      <div class="pokemon-card__stat">
        <span>EXP</span>
        <strong>${experience}</strong>
      </div>
    </div>
  `;
}
