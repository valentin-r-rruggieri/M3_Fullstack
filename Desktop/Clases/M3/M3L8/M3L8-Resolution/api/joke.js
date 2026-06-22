/*
 * api/joke.js — Igual que M3L7
 *
 * Este archivo ya viene completo porque M3L8 no se enfoca en serverless.
 * El foco de esta clase es agregar tests al proyecto que ya construimos.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY no configurada" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt =
      "Generá un dad joke (chiste de papá) corto en español. " +
      "Debe ser un chiste con un juego de palabras o un remate inesperado. " +
      "Solo el chiste, sin explicaciones ni comillas al inicio.";

    const result = await model.generateContent(prompt);
    const joke = result.response.text().trim();

    return res.status(200).json({ joke });
  } catch (error) {
    console.error("[/api/joke] Error:", error.message);
    return res.status(500).json({ error: "Error al generar el chiste" });
  }
}
