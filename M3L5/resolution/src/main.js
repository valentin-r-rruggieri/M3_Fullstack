/*
 * main.js — Coordinador del flujo
 *
 * Responsabilidad ÚNICA: orquestar el pipeline completo.
 * No implementa fetch, transform ni render, solo los coordina.
 *
 * Flujo:
 *   fetchMessages() -> setState success/data
 *   catch -> getUserMessage -> setState error
 */

import { fetchMessages } from "./api.js";
import { getState, setState } from "./state.js";
import { render, getUserMessage } from "./ui.js";

async function loadMessages() {
  setState({ status: "loading", data: null, error: null });
  render(getState());

  try {
    const posts = await fetchMessages();
    setState({ status: "success", data: posts });
    render(getState());
  } catch (err) {
    console.error("Error al cargar mensajes:", err);
    setState({ status: "error", error: getUserMessage(err) });
    render(getState());
  }
}

document.querySelector("#retry-btn").addEventListener("click", loadMessages);

document.querySelector("#composer-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.querySelector("#composer-input");
  const text = input.value.trim();
  if (!text) return;

  const list = document.querySelector("#state-success");
  if (list && !list.classList.contains("hidden")) {
    list.innerHTML += "<div class=\"message message--user\">"
      + "<p class=\"message__author\">Vos</p>"
      + "<p>" + text + "</p>"
      + "</div>";
    const panel = document.querySelector("#messages");
    if (panel) panel.scrollTop = panel.scrollHeight;
  }
  input.value = "";
});

loadMessages();
