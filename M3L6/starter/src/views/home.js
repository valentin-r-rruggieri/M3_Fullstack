import { getCharacter } from "../engine/payload.js";
import { navigateTo } from "../router.js";

const CHARACTER_KEYS = ["science", "chef", "detective"];

const THEMES = {
  science: { gradient: "linear-gradient(135deg, #1d4ed8, #1e40af)", accent: "#60a5fa" },
  chef: { gradient: "linear-gradient(135deg, #ea580c, #c2410c)", accent: "#fb923c" },
  detective: { gradient: "linear-gradient(135deg, #7c3aed, #6d28d9)", accent: "#a78bfa" },
};

export function renderHome() {
  const $app = document.querySelector("#app");
  $app.className = "view-home";

  $app.innerHTML = `
    <div class="home-hero">
      <h1 class="home-hero__title">🤖 Chat AI Engine</h1>
      <p class="home-hero__subtitle">Elegí un personaje y empezá a conversar</p>
    </div>
    <div class="home-cards">
      ${CHARACTER_KEYS.map((key) => renderCard(key)).join("")}
    </div>
  `;

  document.querySelectorAll(".home-card").forEach((card) => {
    card.addEventListener("click", () => {
      const key = card.dataset.character;
      navigateTo(`/chat/${key}`);
    });
  });
}

function renderCard(key) {
  const char = getCharacter(key);
  const theme = THEMES[key];

  return `
    <div class="home-card" data-character="${key}" style="--card-gradient: ${theme.gradient}; --card-accent: ${theme.accent}">
      <div class="home-card__header">
        <span class="home-card__avatar">${char.avatar}</span>
        <h2 class="home-card__name">${char.name}</h2>
      </div>
      <p class="home-card__desc">${char.system.slice(0, 120)}...</p>
      <div class="home-card__footer">
        <span class="home-card__tag" style="background: ${theme.accent}33; color: ${theme.accent}">
          temp ${char.temperature}
        </span>
        <span class="home-card__action">Chatear →</span>
      </div>
    </div>
  `;
}
