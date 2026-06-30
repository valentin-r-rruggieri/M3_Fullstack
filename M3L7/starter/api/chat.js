// ============================================================
// api/chat.js — Serverless Function segura
// ============================================================
// STARTER M3L7
//
// Este archivo se convierte automaticamente en el endpoint:
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
//   - La API key se lee aca, en backend, con process.env.
// ============================================================

// TODO 0:
// Usar los helpers ya creados en api/utils para que esta funcion serverless
// quede limpia y orientada al flujo principal.
//
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { isRateLimitError, getHttpStatus } from "./utils/errors.js";
// import { toGeminiContents } from "./utils/gemini.js";
// import { parseJsonBody, getMessages, getGenerationSettings } from "./utils/request.js";
// import { createChatResponse } from "./utils/response.js";

export default async function handler(req, res) {
  // TODO 1:
  // Validar metodo HTTP.
  //
  // if (req.method !== "POST") {
  //   return res.status(405).json({ error: "Method not allowed" });
  // }

  // TODO 2:
  // Leer el payload que llega desde aiClient.js.
  // Ese payload trae messages[], que es el historial recortado de M3L6.
  //
  // const payload = parseJsonBody(req.body);
  // const messages = getMessages(payload);
  // const lastUser = [...messages].reverse().find((msg) => msg.role === "user");

  // TODO 3:
  // Crear una respuesta mock desde backend con el MISMO shape que espera normalizer.js:
  //
  // return res.status(200).json(createChatResponse({
  //   text: `Respuesta mock desde /api/chat. Recibi: "${lastUser?.content ?? ""}"`,
  //   payload,
  // }));

  // TODO 4:
  // Cuando el mock funcione, reemplazarlo por Gemini:
  // - leer process.env.GEMINI_API_KEY
  // - crear GoogleGenerativeAI
  // - leer system/model/temperature/maxOutputTokens con getGenerationSettings()
  // - transformar TODO messages[] a contents[] de Gemini con toGeminiContents()
  // - llamar model.generateContent()
  // - devolver content[] con createChatResponse() para que el frontend no cambie

  return res.status(501).json({
    error: "TODO: implementar /api/chat en api/chat.js",
  });
}
