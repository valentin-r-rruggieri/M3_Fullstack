/*
 * app.js — Mismo frontend de M3L7, ahora usando modulos testeables.
 *
 * NO TOCAR EN CLASE:
 * Este archivo ya esta armado para que el alumno no pierda tiempo con DOM.
 *
 * QUE OBSERVAR:
 * - app.js coordina la UI: loading, exito, error y reset del boton.
 * - app.js NO sabe como se llama Gemini.
 * - app.js NO arma mensajes de error a mano.
 * - app.js delega esas responsabilidades en modulos testeables.
 *
 * QUE SI SE PRACTICA EN M3L8:
 * - jokeUtils.js: funciones puras faciles de testear.
 * - apiClient.test.js: fetch mockeado con vi.fn().
 */

import { getJoke } from "./apiClient.js";
import { formatJoke, buildErrorMessage } from "./jokeUtils.js";

// Referencias DOM: ya estan completas. Si cambia un id en index.html, esto falla.
const btn = document.getElementById("joke-btn");
const output = document.getElementById("joke-output");
const text = document.getElementById("joke-text");
const errBox = document.getElementById("error-output");
const errTxt = document.getElementById("error-text");

function showLoading() {
  // Estado visual mientras esperamos la respuesta.
  // No lo testeamos hoy porque modifica DOM directamente.
  btn.disabled = true;
  btn.textContent = "Generando...";
  output.classList.add("hidden");
  errBox.classList.add("hidden");
}

function showJoke(joke) {
  // Punto importante:
  // app.js no limpia ni valida el texto. Eso lo hace formatJoke().
  // Ese diseño nos permite testear la logica sin renderizar el DOM.
  text.textContent = formatJoke(joke);
  output.classList.remove("hidden");
}

function showError(error) {
  // Mismo criterio:
  // app.js no decide el texto final del error. Lo delega en buildErrorMessage().
  errTxt.textContent = buildErrorMessage(error);
  errBox.classList.remove("hidden");
}

function resetBtn() {
  // Vuelve la UI al estado interactivo despues de success o error.
  btn.disabled = false;
  btn.textContent = "Generá un chiste";
}

btn.addEventListener("click", async () => {
  // Flujo completo:
  // 1. mostrar loading
  // 2. pedir chiste con getJoke()
  // 3. mostrar exito o error
  // 4. liberar boton siempre, incluso si falla
  showLoading();

  try {
    const joke = await getJoke();
    showJoke(joke);
  } catch (error) {
    showError(error);
  } finally {
    resetBtn();
  }
});
