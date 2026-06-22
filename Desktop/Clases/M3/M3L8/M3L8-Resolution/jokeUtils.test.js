import { describe, it, expect } from "vitest";
import { formatJoke, buildErrorMessage } from "./jokeUtils.js";

describe("formatJoke", () => {
  it("quita espacios extra", () => {
    expect(formatJoke("  Hola  ")).toBe("Hola");
  });

  it("devuelve fallback si viene vacío", () => {
    expect(formatJoke("")).toBe("No se pudo generar un chiste.");
  });
});

describe("buildErrorMessage", () => {
  it("arma un mensaje legible para la UI", () => {
    const error = new Error("Error del servidor");

    expect(buildErrorMessage(error)).toBe(
      "No pudimos generar el chiste: Error del servidor"
    );
  });
});
