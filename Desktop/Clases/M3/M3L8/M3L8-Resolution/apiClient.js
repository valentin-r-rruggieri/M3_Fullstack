/*
 * apiClient.js — Fetch separado de la UI
 *
 * Esta función ya viene completa. En clase la testeamos con fetch mockeado.
 */

export async function getJoke() {
  const response = await fetch("/api/joke", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic: "anything" }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error del servidor");
  }

  return data.joke;
}
