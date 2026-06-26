import { fetchCharacters, getFirstSixCharacters } from "./api.js";
import { getState, setState } from "./state.js";
import { render, getUserMessage } from "./ui.js";

function loadCharacters(name) {
  render({ status: "loading", data: null, error: null });

  fetchCharacters(name)
    .then(function (raw) {
      setState({ status: "success", data: raw, error: null });
      render(getState());
    })
    .catch(function (err) {
      setState({ status: "error", data: null, error: err });
      render(getState());
    });
}

document.getElementById("retry").addEventListener("click", function () {
  loadCharacters("homer");
});

loadCharacters("homer");
