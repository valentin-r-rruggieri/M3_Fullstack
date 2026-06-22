/*
 * api.js — Capa de red
 *
 * ⚠️ STARTER — BUG INTENCIONAL: falta validación de response.ok
 * ──────────────────────────────────────────────────────────────
 * Este archivo tiene un bug real: no verifica si la respuesta
 * HTTP fue exitosa antes de parsear el body.
 *
 * SÍNTOMA que vas a observar:
 *   1. Abrí DevTools → Network
 *   2. Cambiá API_URL por una URL inválida
 *      (ej: agregar "/invalida" al final)
 *   3. Recargá la app
 *   4. Network muestra 404 (rojo)
 *   5. PERO la UI se queda en "loading" para siempre
 *   6. El catch nunca se ejecuta
 *
 * TU TAREA:
 *   1. Reproducí el síntoma con DevTools
 *   2. Recolectá la evidencia (status code, snippet, síntoma en UI)
 *   3. Escribí un prompt estructurado para este bug
 *   4. Aplicá el fix mínimo
 *   5. Verificá los criterios de éxito
 */

const API_URL = "https://jsonplaceholder.typicode.com/posts?_limit=8";

export async function fetchMessages() {
  const response = await fetch(API_URL);

  /*
   * ⚠️ BUG: falta validar response.ok aquí
   * Si la API responde 404 o 500, este código NO lo detecta.
   * La promesa de fetch() solo se rechaza ante fallos de RED,
   * no ante errores HTTP. Sin el chequeo, el 404 llega al .json()
   * como si fuera éxito, y el catch nunca se ejecuta.
   * La UI queda colgada en "loading" para siempre.
   */

  return response.json();
}

/*
 * ──────────────────────────────────────────────────────────
 * PLANTILLA DE PROMPT para este bug (completala antes de pedir el fix):
 *
 * Contexto:
 *   [qué estás construyendo, en qué archivo está el problema]
 *
 * Objetivo:
 *   [qué querés que pase cuando la API responde 404 o 500]
 *
 * Restricciones:
 *   [sin frameworks, mantener modularidad, etc.]
 *
 * Evidencia:
 *   - Status code en Network: [completar]
 *   - Síntoma en UI: [completar]
 *   - Snippet del código problemático:
 *     [pegar solo la función fetchMessages]
 *
 * Formato de salida:
 *   [qué tipo de respuesta querés: hipótesis, fix mínimo, checklist]
 *
 * Criterios de éxito:
 *   [cómo sabés que está resuelto: qué ves en Network/Console/UI]
 * ──────────────────────────────────────────────────────────
 */
