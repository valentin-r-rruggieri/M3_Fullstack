/*
 * gemini.js — Adaptador de historial M3L6 a Gemini
 *
 * M3L6 guarda historial como:
 *   { role: "user" | "assistant", content: string }
 *
 * Gemini necesita:
 *   { role: "user" | "model", parts: [{ text }] }
 */

export function toGeminiContents(messages) {
  return messages
    .filter((msg) => msg?.role === "user" || msg?.role === "assistant")
    .map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: String(msg.content ?? "") }],
    }));
}
