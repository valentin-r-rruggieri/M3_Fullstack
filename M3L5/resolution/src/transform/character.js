const IMAGE_BASE = "https://cdn.thesimpsonsapi.com/500";

function getStatusClass(status) {
  var map = {
    Alive: "alive",
    Dead: "dead",
    unknown: "unknown",
  };
  return map[status] || "unknown";
}

function getFirstPhrase(phrases) {
  if (Array.isArray(phrases) && phrases.length > 0) {
    return phrases[0];
  }
  return "Sin frases";
}

function toCharacterProfile(raw) {
  return {
    id: raw.id,
    name: raw.name ?? "Desconocido",
    image: IMAGE_BASE + "/character/" + raw.id + ".webp",
    occupation: raw.occupation ?? "Sin trabajo",
    status: raw.status ?? "unknown",
    statusClass: getStatusClass(raw.status),
    phrase: getFirstPhrase(raw.phrases),
    age: raw.age,
    gender: raw.gender ?? "Desconocido",
  };
}

export function toCharacterProfileList(rawArray) {
  return rawArray.map(toCharacterProfile);
}
