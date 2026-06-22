// ============================================================
// payload.js — Construcción del payload para la AI API
// ============================================================
// Tu tarea: construir el payload correcto para Anthropic.
//
// Punto clave:
//   system va TOP-LEVEL.
//   NO va dentro de messages[] como { role: "system" }.
// ============================================================

const CHARACTERS = {
  science: {
    name: "Dr. Science",
    avatar: "🧪",
    system: `Actúa como el Dr. Science, un científico apasionado y didáctico.
Explica conceptos científicos de forma clara y entusiasta.
Responde en máximo 3 líneas. Usa analogías simples.
Si no sabes la respuesta, admítelo y proponé un experimento mental.`,
    temperature: 0.7,
  },
  chef: {
    name: "Chef Claude",
    avatar: "👨‍🍳",
    system: `Actúa como el Chef Claude, un chef creativo y entusiasta.
Hablás de comida, recetas y técnicas culinarias con pasión.
Responde en máximo 3 líneas. Usá metáforas culinarias cuando sea posible.
Si no sabés algo de cocina, sugerí experimentar con ingredientes.`,
    temperature: 0.8,
  },
  detective: {
    name: "Detective",
    avatar: "🕵️",
    system: `Actúa como un detective perspicaz y metódico.
Analizás situaciones con lógica y deducción. Respondés de forma directa.
Máximo 3 líneas. Nunca especulás sin evidencia.
Si algo es incierto, lo señalás claramente y pedís más datos.`,
    temperature: 0.4,
  },
};

// Ya está completo para que el anti-patrón inicial pueda mostrar el personaje.
export function getCharacter(key) {
  return CHARACTERS[key] ?? CHARACTERS.science;
}

// TODO 1: Implementar createSystemPrompt(character)
//
// Por ahora debe devolver character.system.
//
// Lo separamos en una función porque más adelante podríamos enriquecer
// el system prompt con fecha, idioma, preferencias o contexto dinámico.
//
// export function createSystemPrompt(character) { ... }
export function createSystemPrompt(character) {
  // TODO: reemplazar por return character.system
  return character.system;
}

// TODO 2: Implementar buildPayload(character, messages)
//
// Debe devolver este contrato:
//
// {
//   model: "claude-3-5-sonnet-latest",
//   system: createSystemPrompt(character),  ← TOP-LEVEL
//   messages,                               ← solo user/assistant
//   max_tokens: 150,
//   temperature: character.temperature,
// }
//
// Error común:
//   ❌ messages: [{ role: "system", content: "..." }]
//
// export function buildPayload(character, messages) { ... }
export function buildPayload(character, messages) {
  // TODO: reemplazar por el payload real.
  return {};
}

// TODO 3: Implementar isValidPayload(payload)
//
// Debe retornar true solo si:
//   1. payload.model es string
//   2. payload.system es string top-level
//   3. payload.messages es array
//   4. todos los mensajes tienen role "user" o "assistant"
//   5. ningún mensaje tiene role "system"
//
// Tip:
//   payload.messages.every(...)
//
// export function isValidPayload(payload) { ... }
export function isValidPayload(payload) {
  // TODO: reemplazar por validación real.
  return false;
}
