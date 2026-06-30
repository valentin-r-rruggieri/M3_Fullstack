/*
 * api/chat.js — Vercel Serverless Function para el chat de M3L7
 *
 * Responsabilidad:
 * - Recibir el payload construido por el engine del frontend.
 * - Leer GEMINI_API_KEY desde process.env.
 * - Adaptar el payload interno del chat a Gemini.
 * - Devolver un shape compatible con normalizer.js: content[].
 *
 * La API key nunca se envía al navegador.
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const payload = parseBody(req.body);
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY no configurada" });
    }

    const messages = Array.isArray(payload?.messages) ? payload.messages : [];
    if (messages.length === 0) {
      return res.status(400).json({ error: "El payload debe incluir messages[]" });
    }

    const system = typeof payload.system === "string" ? payload.system : "";
    const temperature = typeof payload.temperature === "number" ? payload.temperature : 0.7;
    const maxOutputTokens = typeof payload.max_tokens === "number" ? payload.max_tokens : 150;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: system,
    });

    const contents = toGeminiContents(messages);

    const result = await model.generateContent({
      contents,
      generationConfig: {
        temperature,
        maxOutputTokens,
      },
    });

    const text = result.response.text().trim();

    return res.status(200).json({
      id: `msg_gemini_${Date.now()}`,
      type: "message",
      role: "assistant",
      content: [
        {
          type: "text",
          text,
        },
      ],
      stop_reason: "end_turn",
      usage: {
        input_tokens: estimateTokens(JSON.stringify(payload)),
        output_tokens: estimateTokens(text),
      },
    });
  } catch (error) {
    console.error("[/api/chat] Error:", error);

    if (isRateLimitError(error)) {
      return res.status(429).json({
        error: "Rate limit de Gemini. Reintentá en unos segundos.",
        retryAfterSeconds: 8,
      });
    }

    return res.status(500).json({
      error: "Error generando respuesta del chat",
    });
  }
}

function parseBody(body) {
  if (typeof body === "string") {
    return JSON.parse(body || "{}");
  }
  return body ?? {};
}

function toGeminiContents(messages) {
  return messages
    .filter((msg) => msg?.role === "user" || msg?.role === "assistant")
    .map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: String(msg.content ?? "") }],
    }));
}

function estimateTokens(text) {
  return Math.max(1, Math.ceil(String(text).length / 4));
}

function isRateLimitError(error) {
  const text = String(error?.message ?? "");
  return error?.status === 429 || text.includes("429") || text.toLowerCase().includes("quota");
}
