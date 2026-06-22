// ============================================================
// normalizer.js — Normalización de la respuesta de la AI API
// ============================================================
// Tu tarea: convertir el shape real de Anthropic en texto seguro
// para la UI.
//
// Anthropic devuelve:
//   content: [
//     { type: "text", text: "Hola..." },
//     { type: "tool_use", ... }
//   ]
//
// NO devuelve un string directo.
// ============================================================

// TODO 1: Implementar normalizeAIResponse(raw)
//
// Debe devolver:
//   { text: string, truncated: boolean }
//
// Pasos:
//   1. Validar si raw?.content es array:
//        const blocks = Array.isArray(raw?.content) ? raw.content : []
//
//   2. Filtrar solo bloques de texto:
//        block.type === "text" && typeof block.text === "string"
//
//   3. Mapear cada bloque a block.text
//
//   4. Unir con join("") y limpiar con trim()
//
//   5. truncated debe ser true si:
//        raw?.stop_reason === "max_tokens"
//
// Casos edge que NO deben romper:
//   normalizeAIResponse({ content: null })
//   normalizeAIResponse({ content: [{ type: "tool_use" }] })
//   normalizeAIResponse({})
//
// export function normalizeAIResponse(raw) { ... }
export function normalizeAIResponse(raw) {
  // TODO: reemplazar por normalización real.
  return { text: "", truncated: false };
}

// TODO 2: Implementar extractUsage(raw)
//
// Debe devolver:
//   {
//     inputTokens: raw?.usage?.input_tokens ?? 0,
//     outputTokens: raw?.usage?.output_tokens ?? 0,
//   }
//
// Esto sirve para loguear tokens en consola durante la clase.
//
// export function extractUsage(raw) { ... }
export function extractUsage(raw) {
  // TODO: reemplazar por extracción real.
  return { inputTokens: 0, outputTokens: 0 };
}
