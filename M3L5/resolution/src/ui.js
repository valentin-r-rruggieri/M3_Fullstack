var $loading, $error, $success, $badge, $errorMessage;

function init() {
  $loading = document.getElementById("loading");
  $error = document.getElementById("error");
  $success = document.getElementById("grid");
  $badge = document.getElementById("badge");
  $errorMessage = document.getElementById("error-message");
}

function buildCard(profile) {
  return (
    '<article class="card">' +
      '<img src="' + profile.image + '" alt="' + profile.name + '" loading="lazy" />' +
      '<div class="card__body">' +
        '<h3 class="card__name">' + profile.name + '</h3>' +
        '<p class="card__occupation">' + profile.occupation + '</p>' +
        '<div class="card__meta">' +
          '<span class="status-dot status-dot--' + profile.statusClass + '"></span>' +
          '<span class="card__status">' + profile.status + '</span>' +
          (profile.age ? '<span class="card__age">' + profile.age + ' años</span>' : "") +
        '</div>' +
        '<blockquote class="card__phrase">"' + profile.phrase + '"</blockquote>' +
      '</div>' +
    '</article>'
  );
}

export function render(state) {
  if (!$loading) init();

  $loading.classList.toggle("hidden", state.status !== "loading");
  $error.classList.toggle("hidden", state.status !== "error");
  $success.classList.toggle("hidden", state.status !== "success");
  $badge.textContent = "estado: " + state.status;

  if (state.status === "error") {
    $errorMessage.textContent = getUserMessage(state.error);
  }

  if (state.status === "success" && state.data) {
    $success.innerHTML = state.data.map(buildCard).join("");
  }
}

export function getUserMessage(error) {
  if (!navigator.onLine) return "Sin conexión a internet. Verificá tu red.";
  if (error?.code === "NO_RESULTS") return "No se encontraron personajes con ese nombre.";
  if (error?.message?.startsWith("HTTP 404")) return "Personajes no encontrados (404).";
  if (error?.message?.startsWith("HTTP 5")) return "El servidor de Simpsons no responde. Intentá más tarde.";
  if (error?.message) return error.message;
  return "Ocurrió un error inesperado.";
}
