/*
 * api/joke.js — Serverless Function
 *
 * CONCEPTOS CLAVE:
 *   - Este archivo está en /api → Vercel lo convierte en /api/joke
 *   - Exporta una función handler(req, res) — igual que Express
 *   - Corre en el servidor de Vercel, NO en el navegador
 *   - process.env.GEMINI_API_KEY solo existe en el servidor
 *
 * PASOS EN CLASE:
 *   PASO 2: Crear la versión MOCK (sin Gemini, chiste hardcodeado)
 *   PASO 6: Reemplazar con Gemini real usando process.env
 */


// TODO PASO 2 — Versión MOCK (sin Gemini):
//
// export default async function handler(req, res) {
//
//   // Validar método HTTP
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' })
//   }
//
//   // Simular delay de API real (para probar el estado de loading)
//   await new Promise(r => setTimeout(r, 600))
//
//   // Chiste hardcodeado — así verificamos el flujo sin gastar tokens
//   const joke = '[MOCK] ¿Por qué el programador usa lentes? Porque no puede ver C# 🥁'
//
//   return res.status(200).json({ joke })
// }


// TODO PASO 6 — Versión REAL con Gemini:
// (reemplazar completamente la versión mock)
//
// import { GoogleGenerativeAI } from '@google/generative-ai'
//
// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' })
//   }
//
//   try {
//     // La API key viene de process.env — NUNCA del body ni del frontend
//     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
//     const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
//
//     const result = await model.generateContent(
//       'Generá un dad joke corto en español con juego de palabras. Solo el chiste.'
//     )
//     const joke = result.response.text().trim()
//
//     return res.status(200).json({ joke })
//
//   } catch (error) {
//     console.error('[/api/joke] Error:', error.message)
//     return res.status(500).json({ error: 'Error al generar el chiste' })
//   }
// }
