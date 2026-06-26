const API_BASE = "https://thesimpsonsapi.com/api";

export async function fetchCharacters(name) {
  const url = API_BASE + "/characters?name=" + name;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

export function getFirstSixCharacters(name) {
  return fetchCharacters(name).then(function (data) {
    return data.slice(0, 6);
  });
}
