/*
 * api/joke.js — Serverless Function: proxy seguro hacia Gemini
 *
 * ESTRUCTURA DE UNA SERVERLESS FUNCTION EN VERCEL:
 *   - Va en la carpeta /api
 *   - Exporta una función default llamada handler
 *   - Recibe (req, res) — igual que Express
 *   - Vercel le asigna automáticamente la ruta /api/joke
 *
 * ¿Por qué la API key está segura acá?
 *   Este código corre en los SERVIDORES DE VERCEL, no en el navegador.
 *   process.env solo existe en el servidor — el usuario nunca lo ve.
 *   El frontend no sabe ni que Gemini existe.
 */

import { GoogleGenerativeAI } from '@google/generative-ai'

export default async function handler(req, res) {
  // 1. Solo aceptamos POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // 2. API key: viene de process.env — NUNCA del body ni del frontend
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY no configurada' })
    }

    // 3. Inicializar Gemini
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    // 4. Prompt del dad joke
    const prompt =
      'Generá un dad joke (chiste de papá) corto en español. ' +
      'Debe ser un chiste con un juego de palabras o un remate inesperado. ' +
      'Solo el chiste, sin explicaciones ni comillas al inicio.'

    // 5. Llamar a Gemini
    const result = await model.generateContent(prompt)
    const joke   = result.response.text().trim()

    // 6. Retornar al frontend — SOLO el chiste, nunca la key
    return res.status(200).json({ joke })

  } catch (error) {
    console.error('[/api/joke] Error:', error.message)
    return res.status(500).json({ error: 'Error al generar el chiste' })
  }
}
