/**
 * api/functions.js — Vercel Serverless Function: proxy seguro a Gemini
 *
 * ¿POR QUÉ EXISTE ESTE ARCHIVO? (L7 — API Keys y Seguridad)
 * La API key de Gemini NO puede vivir en el frontend (JavaScript del navegador)
 * porque cualquier usuario puede verla en DevTools → Sources.
 *
 * FLUJO SEGURO:
 *   Frontend (navegador)
 *     ↓ fetch('/api/functions')  ← nunca llama a Gemini directamente
 *   Esta función (corre en servidores de Vercel)
 *     ↓ process.env.GEMINI_API_KEY  ← la key vive solo acá, nunca en el browser
 *   API de Gemini
 *     ↓ respuesta del personaje
 *   Esta función retorna la respuesta al frontend
 *
 * ESTRUCTURA DE VERCEL SERVERLESS FUNCTIONS (L7):
 *   - Archivo en /api → Vercel lo convierte en endpoint /api/functions
 *   - Exporta una función default handler(req, res)
 *   - req: información de la petición HTTP (método, headers, body)
 *   - res: objeto para enviar la respuesta HTTP
 *
 * MODELO DE GEMINI USADO: gemini-2.0-flash-lite
 *   - Recomendado para proyectos de aprendizaje (consigna oficial)
 *   - Rápido y económico, consume poco del crédito de $300 de Google
 *   - Evitar modelos como gemini-2.0-pro que consumen mucho más
 */

import { GoogleGenerativeAI } from '@google/generative-ai'

/**
 * SHERLOCK_SYSTEM_PROMPT — System prompt del personaje (L6 — Diseño de prompts)
 *
 * El system prompt define la personalidad del personaje.
 * Este texto vive SOLO en el servidor (serverless function), NUNCA en el frontend.
 * Así el usuario no puede verlo ni manipularlo desde DevTools.
 *
 * Buenas prácticas del system prompt (L5 — AI Prompting para Frontend):
 *   ✅ Define el ROL claramente
 *   ✅ Establece el TONO y estilo de habla
 *   ✅ Impone RESTRICCIONES de longitud (chat vs. ensayo)
 *   ✅ Define cómo manejar preguntas fuera del personaje
 *   ✅ Dice el idioma de respuesta (español)
 */
const SHERLOCK_SYSTEM_PROMPT = `Eres Sherlock Holmes, el famoso detective privado de Baker Street 221B, Londres. 
Tienes una mente brillante, analítica y deductiva que supera con creces la de cualquier inspector de Scotland Yard.
Tu compañero es el Dr. John Watson, que documenta tus casos.

PERSONALIDAD:
- Eres directo, seguro de ti mismo, a veces condescendiente pero siempre fascinante
- Hablas con precisión quirúrgica y usas vocabulario elevado
- Haces observaciones agudas sobre los detalles que otros ignoran
- Tienes desdén por lo obvio y por las mentes mediocres
- Expresás emoción principalmente a través de la ironía y el sarcasmo inteligente
- Ocasionalmente usás tu frase característica o variantes de "Elemental"

COMPORTAMIENTO:
- Responde SIEMPRE en español
- Mantén las respuestas CORTAS: máximo 3-4 oraciones (es un chat, no un monólogo)
- Si te hacen preguntas modernas, interpretálas desde tu perspectiva victoriana del siglo XIX
- Nunca rompas el personaje bajo ninguna circunstancia
- Si no sabés algo, razonás desde la lógica y la evidencia disponible
- Podés hacer referencias a tus casos (El Sabueso de los Baskerville, Irene Adler, Moriarty, etc.)

EJEMPLO DE TON:
"Observo que usted hace esa pregunta sin haber considerado las implicaciones evidentes. 
Permítame guiar su razonamiento hacia la conclusión obvia."`

/**
 * handler(req, res) — Función principal de la Serverless Function
 *
 * Recibe los mensajes del frontend, llama a Gemini con la API key segura,
 * y retorna la respuesta del personaje.
 *
 * @param {Object} req - Request HTTP de Vercel
 *   req.method:  'POST', 'GET', etc.
 *   req.body:    { messages: Array }
 * @param {Object} res - Response HTTP de Vercel
 *   res.status(N).json(obj): retornar JSON con código de estado
 */
export default async function handler(req, res) {

  // PASO 1: Solo aceptar peticiones POST
  // El frontend envía los mensajes con POST porque usa el body.
  // Una petición GET no tiene body y no puede enviar el historial.
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Método no permitido. Solo se acepta POST.',
    })
  }

  try {
    // PASO 2: Extraer datos del body de la petición
    const { messages } = req.body

    // Validar que llegaron los datos necesarios
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({
        error: 'El campo "messages" es requerido y debe ser un array.',
      })
    }

    // PASO 3: Obtener la API key del servidor (NUNCA del frontend)
    //
    // process.env.GEMINI_API_KEY:
    //   - En desarrollo local: viene del archivo .env (cargado por vercel dev)
    //   - En producción Vercel: viene de Settings → Environment Variables
    //   - El usuario NUNCA puede ver este valor en el navegador
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      console.error('[functions.js] GEMINI_API_KEY no está configurada')
      return res.status(500).json({
        error: 'Configuración del servidor incompleta. Contactar al administrador.',
      })
    }

    // PASO 4: Inicializar el cliente de Gemini con la API key segura
    const genAI = new GoogleGenerativeAI(apiKey)

    // Modelo recomendado para el PI (consigna oficial)
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-lite',
      // systemInstruction: el system prompt define la personalidad del personaje.
      // Va acá (server-side) y no en el frontend para:
      //   1. Que el usuario no pueda ver ni manipular el prompt
      //   2. Que sea parte del contexto del modelo desde el inicio
      systemInstruction: SHERLOCK_SYSTEM_PROMPT,
    })

    // PASO 5: Construir el historial de conversación para Gemini
    //
    // Gemini usa el formato: [{ role: 'user', parts: [{ text: '...' }] }]
    // Nuestro historial usa:  [{ role: 'user', content: '...' }]
    // Necesitamos transformarlo (L4 — Transformación de datos de APIs)
    //
    // IMPORTANTE: en Gemini, el rol del asistente se llama 'model', no 'assistant'.
    // Si enviáramos 'assistant', Gemini devuelve error 400.
    const geminiHistory = messages
      .slice(0, -1) // todos menos el último (el último es el nuevo mensaje)
      .map((msg) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }))

    // El último mensaje es la pregunta actual del usuario
    const lastMessage = messages[messages.length - 1]

    if (!lastMessage || !lastMessage.content) {
      return res.status(400).json({
        error: 'No se encontró el mensaje del usuario en el historial.',
      })
    }

    // PASO 6: Iniciar el chat con el historial y enviar el último mensaje
    //
    // startChat() con el historial previo permite que Gemini "recuerde"
    // la conversación anterior (L6 — Historial de conversación).
    // Sin este historial, el personaje respondería sin contexto.
    const chat = model.startChat({
      history: geminiHistory,
      generationConfig: {
        maxOutputTokens: 300,  // respuestas cortas para chat (L6 — tokens)
        temperature: 0.8,      // un poco de variabilidad para naturalidad (L6)
      },
    })

    const result = await chat.sendMessage(lastMessage.content)
    const response = await result.response

    // PASO 7: Extraer el texto de la respuesta
    //
    // La respuesta de Gemini llega como objeto complejo.
    // response.text() extrae el texto limpio.
    const replyText = response.text().trim()

    if (!replyText) {
      return res.status(500).json({
        error: 'La AI no generó una respuesta. Intentá de nuevo.',
      })
    }

    // PASO 8: Retornar la respuesta al frontend
    // El frontend espera: { reply: string }
    return res.status(200).json({
      reply: replyText,
    })

  } catch (error) {
    // PASO 9: Manejo de errores de la API de Gemini (L3 — manejo de errores)
    console.error('[functions.js] Error llamando a Gemini:', error.message)

    // Rate limiting (429): demasiadas peticiones
    if (error.message?.includes('429') || error.status === 429) {
      return res.status(429).json({
        error: 'Límite de peticiones alcanzado. Esperá unos segundos e intentá de nuevo.',
      })
    }

    // API key inválida
    if (error.message?.includes('API_KEY_INVALID') || error.status === 400) {
      return res.status(500).json({
        error: 'La configuración de la API no es válida. Verificá las variables de entorno.',
      })
    }

    // Error genérico
    return res.status(500).json({
      error: 'Error al generar respuesta del personaje. Intentá de nuevo.',
    })
  }
}
