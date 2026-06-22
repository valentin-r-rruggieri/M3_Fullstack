/*
 * main.js — Coordinador del flujo
 *
 * Única responsabilidad: escuchar eventos y orquestar el pipeline:
 *   getFirstSixCharacters -> toCharacterProfileList -> render
 */

import { getFirstSixCharacters } from "./services/rmApi.js";
import { toCharacterProfileList } from "./transform/character.js";
import { render, getUserMessage } from "./ui/characterGrid.js";

const state = {
  status: "idle",
  data: null,
  error: null,
};

function setState(updates) {
  Object.assign(state, updates);
  render(state);
}

/*
 * loadGallery(name)
 * ──────────────────
 * Flujo completo:
 *   loading -> fetch raw -> transform ViewModels -> success/error
 */
async function loadGallery(name) {
  setState({ status: "loading", data: null, error: null });

  try {
    const rawChars = await getFirstSixCharacters(name);
    console.log("Raw characters recibidos:", rawChars.length, rawChars);

    const profiles = toCharacterProfileList(rawChars);
    console.log("ViewModels generados:", profiles);

    setState({ status: "success", data: profiles });
  } catch (err) {
    console.error("Error en loadGallery:", err);
    setState({ status: "error", error: getUserMessage(err) });
  }
}

document.querySelector("#retry-btn").addEventListener("click", () => {
  loadGallery("rick");
});

loadGallery("rick");
