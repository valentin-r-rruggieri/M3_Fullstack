const API_BASE = "https://thesimpsonsapi.com/api";

export function buildUrl(params) {
  const url = new URL(API_BASE + "/characters");
  Object.entries(params).forEach(function ([key, value]) {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
}

export async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("HTTP " + response.status + ": " + response.statusText);
  }
  return response.json();
}

export async function fetchCharacters(name) {
  const url = buildUrl({ name: name.trim() || undefined, page: 1 });
  const data = await fetchJson(url);
  const list = data.results;
  if (!Array.isArray(list)) {
    throw new Error("NO_RESULTS");
  }
  return list;
}

export async function getFirstSixCharacters(name) {
  const raw = await fetchCharacters(name);
  return raw.slice(0, 6);
}
