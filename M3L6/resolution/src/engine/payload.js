/*
 * payload.js — Construcción y validación del payload para la AI API
 *
 * Contrato de Anthropic Messages API:
 * {
 *   model: string,
 *   system: string,     // TOP-LEVEL: no va dentro de messages[]
 *   messages: [
 *     { role: "user" | "assistant", content: string }
 *   ],
 *   max_tokens: number,
 *   temperature: number
 * }
 *
 * Error común: copiar el patrón de OpenAI y poner
 * { role: "system", content: "..." } dentro de messages[].
 * En Anthropic eso genera 400 Bad Request.
 */

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

/*
 * getCharacter(key)
 * Devuelve el perfil del personaje pedido o el default si la key no existe.
 */
export function getCharacter(key) {
  return CHARACTERS[key] ?? CHARACTERS.science;
}

/*
 * createSystemPrompt(character)
 * Está separado para que mañana podamos enriquecer el prompt con fecha,
 * idioma, preferencias del usuario u otros datos dinámicos.
 */
export function createSystemPrompt(character) {
  return character.system;
}

/*
 * buildPayload(character, messages)
 * Construye el request completo. Lo crítico: system va top-level.
 */
export function buildPayload(character, messages) {
  return {
    model: "claude-3-5-sonnet-latest",
    system: createSystemPrompt(character),
    messages,
    max_tokens: 150,
    temperature: character.temperature,
  };
}

/*
 * isValidPayload(payload)
 * Valida el contrato mínimo y detecta el bug de role: "system" dentro de messages[].
 */
export function isValidPayload(payload) {
  if (typeof payload?.model !== "string") return false;
  if (typeof payload?.system !== "string") return false;
  if (!Array.isArray(payload?.messages)) return false;

  return payload.messages.every((msg) => {
    const hasValidRole = msg?.role === "user" || msg?.role === "assistant";
    const hasTextContent = typeof msg?.content === "string";
    return hasValidRole && hasTextContent;
  });
}
