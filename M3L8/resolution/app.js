/*
 * app.js — Mismo frontend de M3L7, ahora usando módulos testeables.
 *
 * En M3L8 no testeamos el DOM. Testeamos:
 * - funciones puras en jokeUtils.js
 * - fetch aislado en apiClient.js
 */

import { getJoke } from "./apiClient.js";
import { formatJoke, buildErrorMessage } from "./jokeUtils.js";

const btn = document.getElementById("joke-btn");
const output = document.getElementById("joke-output");
const text = document.getElementById("joke-text");
const errBox = document.getElementById("error-output");
const errTxt = document.getElementById("error-text");

function showLoading() {
  btn.disabled = true;
  btn.textContent = "Generando...";
  output.classList.add("hidden");
  errBox.classList.add("hidden");
}

function showJoke(joke) {
  text.textContent = formatJoke(joke);
  output.classList.remove("hidden");
}

function showError(error) {
  errTxt.textContent = buildErrorMessage(error);
  errBox.classList.remove("hidden");
}

function resetBtn() {
  btn.disabled = false;
  btn.textContent = "Generá un chiste";
}

btn.addEventListener("click", async () => {
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
