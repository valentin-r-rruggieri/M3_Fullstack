/*
 * api/joke.js — Igual que M3L7
 *
 * NO TOCAR EN CLASE:
 * Este archivo ya viene completo porque M3L8 no se enfoca en serverless.
 *
 * RECORDATORIO DE M3L7:
 * - La API key vive en process.env.GEMINI_API_KEY.
 * - El frontend NO debe tener la API key.
 * - El frontend llama a /api/joke.
 * - Esta funcion serverless llama a Gemini y devuelve { joke }.
 *
 * FOCO DE M3L8:
 * - No testeamos Gemini real.
 * - No testeamos Vercel real.
 * - Testeamos el cliente que llama a este endpoint usando fetch mockeado.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Solo aceptamos POST porque el cliente envia una accion: generar un chiste.
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // La variable de entorno se lee del backend, nunca del navegador.
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

    // Contrato que consume apiClient.js:
    // response.ok === true y body JSON con propiedad joke.
    return res.status(200).json({ joke });
  } catch (error) {
    console.error("[/api/joke] Error:", error.message);
    // Contrato de error que consume apiClient.js:
    // response.ok === false y body JSON con propiedad error.
    return res.status(500).json({ error: "Error al generar el chiste" });
  }
}
