import { describe, it, expect } from "vitest";
import { formatJoke, buildErrorMessage } from "./jokeUtils.js";

/*
 * jokeUtils.test.js — Tests ya escritos para practicar rojo -> verde
 *
 * NO TOCAR EN CLASE:
 * Estos tests son la consigna ejecutable. Si fallan, no se corrige el test:
 * se corrige jokeUtils.js.
 *
 * COMO LEER UN TEST:
 * - describe() agrupa tests de una funcion.
 * - it() describe un comportamiento puntual.
 * - expect(...).toBe(...) compara resultado recibido vs resultado esperado.
 *
 * Orden de trabajo:
 * 1. Ejecutar npm test.
 * 2. Leer el primer error.
 * 3. Ir a jokeUtils.js.
 * 4. Implementar el comportamiento minimo.
 * 5. Guardar y ver si Vitest pasa de rojo a verde.
 */

describe("formatJoke", () => {
  it("quita espacios extra", () => {
    // Arrange: texto con espacios de mas.
    // Act: formatJoke procesa el texto.
    // Assert: esperamos el texto limpio.
    expect(formatJoke("  Hola  ")).toBe("Hola");
  });

  it("devuelve fallback si viene vacío", () => {
    // Si Gemini o el backend devolvieran un string vacio,
    // la UI no deberia mostrar una card vacia.
    expect(formatJoke("")).toBe("No se pudo generar un chiste.");
  });
});

describe("buildErrorMessage", () => {
  it("arma un mensaje legible para la UI", () => {
    // Arrange: simulamos un error como el que podria lanzar apiClient.js.
    const error = new Error("Error del servidor");

    // Assert: la UI debe recibir un mensaje entendible para humanos,
    // no un texto tecnico o incompleto.
    expect(buildErrorMessage(error)).toBe(
      "No pudimos generar el chiste: Error del servidor"
    );
  });
});
