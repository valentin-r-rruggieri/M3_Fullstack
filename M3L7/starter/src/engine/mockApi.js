/*
 * mockApi.js — Simulación de la AI API para la clase
 *
 * El frontend nunca debe exponer una API key real. Por eso este ejercicio usa
 * un mock con el mismo shape general de Anthropic: content[] + usage + stop_reason.
 *
 * Para migrar a producción, se reemplaza callAI() por un fetch a un proxy/serverless
 * que agregue la API key del lado servidor.
 */

let requestCount = 0;

const MOCK_RESPONSES = {
  science: [
    "¡Excelente pregunta! Si lo pensamos como un laboratorio, primero aislamos las variables y después observamos qué cambia.",
    "Desde ciencia, la clave es evidencia: hipótesis, prueba y revisión. Sin datos, solo tenemos una idea interesante.",
    "Ese fenómeno se entiende mejor con una analogía: es como empujar una fila de fichas, cada interacción transmite energía.",
    "Buena pregunta. Depende del sistema y sus condiciones iniciales; cambiar una variable puede alterar todo el resultado.",
  ],
  chef: [
    "Como en una buena salsa, primero armamos una base sólida y después ajustamos el sabor. Técnica antes que improvisación.",
    "Esto se parece a cocinar a fuego bajo: paciencia, control y pequeños cambios producen un resultado mucho mejor.",
    "En cocina, cada ingrediente tiene una función. Si entendés esa función, podés reemplazar sin arruinar el plato.",
    "Mi consejo de chef: probá, corregí y volvé a probar. El paladar se entrena igual que una habilidad técnica.",
  ],
  detective: [
    "Los hechos disponibles apuntan a una conclusión parcial. Antes de cerrar el caso, necesito separar evidencia de suposición.",
    "Interesante. Hay una pista fuerte: el detalle que parece menor suele explicar el patrón completo.",
    "Elemental: si una hipótesis no explica todos los datos, no la descartamos todavía, pero tampoco la damos por probada.",
    "Procedamos con método. Primero identificamos qué sabemos, luego qué falta y recién después inferimos.",
  ],
};

function simulateLatency() {
  const ms = 800 + Math.random() * 1200;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function detectCharacterKey(payload) {
  const system = payload?.system ?? "";

  if (system.includes("Chef Claude")) return "chef";
  if (system.includes("detective") || system.includes("Detective")) return "detective";
  return "science";
}

function getLastUserMessage(payload) {
  const messages = Array.isArray(payload?.messages) ? payload.messages : [];
  const lastUser = [...messages].reverse().find((msg) => msg?.role === "user");
  return lastUser?.content ?? "";
}

function estimateTokens(text) {
  return Math.max(1, Math.ceil(String(text).length / 4));
}

/*
 * callAI(payload)
 * Simula la llamada a la API.
 */
export async function callAI(payload) {
  requestCount += 1;
  await simulateLatency();

  const characterKey = detectCharacterKey(payload);
  const responses = MOCK_RESPONSES[characterKey];
  const responseText = responses[(requestCount - 1) % responses.length];
  const userText = getLastUserMessage(payload);
  const inputTokens = estimateTokens(JSON.stringify(payload));
  const outputTokens = estimateTokens(responseText);

  return {
    id: `msg_mock_${requestCount}`,
    type: "message",
    role: "assistant",
    content: [
      {
        type: "text",
        text: `${responseText}${userText ? `\n\nSobre "${userText}", miraría primero el contexto.` : ""}`,
      },
    ],
    stop_reason: "end_turn",
    usage: {
      input_tokens: inputTokens,
      output_tokens: outputTokens,
    },
  };
}
