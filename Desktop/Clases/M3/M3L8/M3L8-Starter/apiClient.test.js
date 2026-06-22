import { describe, it, expect, vi, beforeEach } from "vitest";
import { getJoke } from "./apiClient.js";

/*
 * apiClient.test.js — Test guiado para fetch mockeado
 *
 * ESTE ES EL SEGUNDO ARCHIVO QUE COMPLETA EL ALUMNO.
 *
 * Objetivo didactico:
 * - Entender que un unit test no debe llamar a internet, Vercel ni Gemini.
 * - Reemplazar fetch real por una funcion falsa controlada con vi.fn().
 * - Verificar el contrato del frontend con /api/joke.
 *
 * Que NO estamos testeando:
 * - Que Gemini responda.
 * - Que Vercel deploye.
 * - Que el DOM renderice.
 *
 * Que SI estamos testeando:
 * - Que getJoke() llame a "/api/joke".
 * - Que use method POST.
 * - Que mande JSON.
 * - Que devuelva data.joke cuando response.ok es true.
 * - Que lance Error cuando response.ok es false.
 */

// TODO 1:
// Descomentar esta linea.
//
// Que hace:
// - Reemplaza fetch real por un mock.
// - A partir de ese momento el test controla que devuelve fetch.
// - Evita requests reales durante npm test.

// global.fetch = vi.fn();

describe("getJoke", () => {
  // TODO 2:
  // Descomentar este beforeEach.
  //
  // Por que importa:
  // - fetch guarda cuantas veces fue llamado.
  // - Si no limpiamos entre tests, un test puede contaminar al siguiente.
  // - mockClear() deja el mock listo para el proximo it().

  // beforeEach(() => {
  //   fetch.mockClear();
  // });

  // TODO 3:
  // Descomentar y completar este primer test.
  //
  // Lectura paso a paso:
  // 1. fetch.mockResolvedValueOnce(...) simula una respuesta exitosa.
  // 2. await getJoke() ejecuta la funcion real.
  // 3. expect(fetch).toHaveBeenCalledWith(...) verifica como fue llamada.
  //
  // Si este test pasa, sabemos que apiClient.js respeta el contrato basico
  // con la serverless function /api/joke.

  // it("llama a /api/joke con POST", async () => {
  //   fetch.mockResolvedValueOnce({
  //     ok: true,
  //     json: async () => ({ joke: "Chiste mock" }),
  //   });
  //
  //   await getJoke();
  //
  //   expect(fetch).toHaveBeenCalledWith("/api/joke", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ topic: "anything" }),
  //   });
  // });

  // TODO 4 OPCIONAL SI HAY TIEMPO:
  // Agregar un test de success:
  // - mockear fetch con { ok: true, json: async () => ({ joke: "Chiste mock" }) }
  // - ejecutar const result = await getJoke()
  // - esperar que result sea "Chiste mock"
  //
  // TODO 5 OPCIONAL SI HAY TIEMPO:
  // Agregar un test de error:
  // - mockear fetch con { ok: false, json: async () => ({ error: "Error del servidor" }) }
  // - esperar que getJoke() rechace con ese error
});
