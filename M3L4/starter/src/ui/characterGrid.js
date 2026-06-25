/*
 * characterGrid.js — Capa de render
 *
 * Responsabilidad única: recibir ViewModels y construir HTML.
 * NUNCA hace fetch. NUNCA transforma datos. Solo pinta el DOM.
 */

const $loading = document.querySelector("#state-loading");
const $error = document.querySelector("#state-error");
const $success = document.querySelector("#state-success");
const $grid = document.querySelector("#cards-grid");
const $errMsg = document.querySelector("#error-message");
const $count = document.querySelector("#results-count");
const $badge = document.querySelector("#state-badge");

/*
 * render(state)
 * ─────────────
 * Patrón: ocultar todo -> mostrar solo el panel del estado actual.
 */
export function render(state) {
  [$loading, $error, $success].forEach((el) => {
    el.classList.add("hidden");
  });

  $badge.textContent = `estado: ${state.status}`;

  if (state.status === "loading") {
    $loading.classList.remove("hidden");
  } else if (state.status === "error") {
    $error.classList.remove("hidden");
    $errMsg.textContent = state.error;
  } else if (state.status === "success") {
    $success.classList.remove("hidden");
    const profiles = state.data;
    $count.textContent = `Mostrando ${profiles.length} personajes`;
    $grid.innerHTML = profiles.map(buildCard).join("");
  }
}

/*
 * buildCard(profile)
 * ───────────────────
 * Construye el HTML de UNA card a partir de un ViewModel.
 */
function buildCard(profile) {
  return `
    <article class="card">
      <img
        class="card__image"
        src="${profile.image}"
        alt="Imagen de ${profile.name}"
        loading="lazy"
      />
      <div class="card__body">
        <h2 class="card__name">${profile.name}</h2>

        <div class="card__meta">
          <span class="status-dot status-dot--${profile.statusClass}"></span>
          <span class="card__status-text">${profile.status} — ${profile.species}</span>
        </div>

        <p class="card__detail">
          🌍 Origen: <span>${profile.originName}</span>
        </p>
        <p class="card__detail">
          📍 Ubicación: <span>${profile.locationName}</span>
        </p>
      </div>
    </article>
  `;
}

/*
 * getUserMessage(error)
 * ──────────────────────
 * Traduce errores técnicos a mensajes entendibles para humanos.
 */
export function getUserMessage(error) {
  if (error?.code === "NO_RESULTS") {
    return "No encontramos personajes con ese nombre.";
  }

  if (error?.status === 404) {
    return "El recurso solicitado no existe (404).";
  }

  if (!navigator.onLine) {
    return "Sin conexión a internet. Verificá tu red y reintentá.";
  }

  return `Error inesperado: ${error?.message ?? "Algo salió mal"}`;
}
