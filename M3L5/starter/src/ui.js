export function render(state) {
  document.getElementById("loading").classList.toggle("hidden", state.status !== "loading");
  document.getElementById("error").classList.toggle("hidden", state.status !== "error");
  document.getElementById("grid").classList.toggle("hidden", state.status !== "success");
  document.getElementById("badge").textContent = "estado: " + state.status;

  if (state.status === "error") {
    document.getElementById("error-message").textContent = state.error?.message || "Error desconocido";
  }

  if (state.status === "success" && state.data) {
    document.getElementById("grid").innerHTML = state.data.map(function (item) {
      return '\n        <div class="card">\n          <img src="https://cdn.thesimpsonsapi.com/500/character/' + item.id + '.webp" alt="' + item.name + '" />\n          <h3>' + item.name + '</h3>\n          <p>' + (item.occupation || "Sin trabajo") + '</p>\n          <span class="status">' + item.status + '</span>\n        </div>\n      ';
    }).join("");
  }
}

export function getUserMessage(error) {
  if (!navigator.onLine) return "Sin conexión a internet";
  if (error?.message) return error.message;
  return "Ocurrió un error inesperado";
}
