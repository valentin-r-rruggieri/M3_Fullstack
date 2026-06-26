import { getFirstSixCharacters } from "./api.js";
import { toCharacterProfileList } from "./transform/character.js";
import { getState, setState } from "./state.js";
import { render, getUserMessage } from "./ui.js";

function loadGallery(name) {
  setState({ status: "loading", data: null, error: null });
  render(getState());

  getFirstSixCharacters(name)
    .then(function (raw) {
      var profiles = toCharacterProfileList(raw);
      setState({ status: "success", data: profiles, error: null });
      render(getState());
    })
    .catch(function (err) {
      var message = getUserMessage(err);
      setState({ status: "error", data: null, error: new Error(message) });
      render(getState());
    });
}

document.getElementById("retry").addEventListener("click", function () {
  loadGallery("homer");
});

loadGallery("homer");
