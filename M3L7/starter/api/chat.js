// ============================================================
// api/chat.js — Serverless Function segura
// ============================================================
// STARTER M3L7
//
// Este archivo se convierte automáticamente en el endpoint:
//   POST /api/chat
//
// Objetivo de la clase:
//   1. Crear primero una respuesta MOCK desde backend.
//   2. Conectar el frontend con fetch("/api/chat").
//   3. Reemplazar el mock por Gemini real usando process.env.GEMINI_API_KEY.
//
// Importante:
//   - La API key NO va en src/.
//   - La API key NO va en app/frontend.
//   - La API key se lee acá, en backend, con process.env.
// ============================================================

export default async function handler(req, res) {
  // TODO 1:
  // Validar método HTTP.
  //
  // if (req.method !== "POST") {
  //   return res.status(405).json({ error: "Method not allowed" });
  // }

  // TODO 2:
  // Leer el payload que llega desde aiClient.js.
  //
  // const payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  // const messages = Array.isArray(payload?.messages) ? payload.messages : [];
  // const lastUser = [...messages].reverse().find((msg) => msg.role === "user");

  // TODO 3:
  // Crear una respuesta mock con el MISMO shape que espera normalizer.js:
  //
  // return res.status(200).json({
  //   id: "msg_mock_serverless",
  //   type: "message",
  //   role: "assistant",
  //   content: [
  //     {
  //       type: "text",
  //       text: `Respuesta mock desde /api/chat. Recibí: "${lastUser?.content ?? ""}"`,
  //     },
  //   ],
  //   stop_reason: "end_turn",
  //   usage: { input_tokens: 0, output_tokens: 0 },
  // });

  // TODO 4:
  // Cuando el mock funcione, reemplazarlo por Gemini:
  // - importar GoogleGenerativeAI
  // - leer process.env.GEMINI_API_KEY
  // - crear el modelo
  // - transformar messages[] a contents[] de Gemini
  // - devolver content[] para que el frontend no cambie

  return res.status(501).json({
    error: "TODO: implementar /api/chat en api/chat.js",
  });
}
