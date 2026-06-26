const IMAGE_BASE = "https://cdn.thesimpsonsapi.com/500";

function getStatusClass(status) {
  var map = {
    Alive: "alive",
    Dead: "dead",
    unknown: "unknown",
  };
  return map[status] || "unknown";
}

var FILTER_WORDS = ["suck"];

function getFirstPhrase(phrases) {
  if (!Array.isArray(phrases) || phrases.length === 0) {
    return "Sin frases";
  }
  var clean = phrases.filter(function (p) {
    return !FILTER_WORDS.some(function (w) {
      return p.toLowerCase().includes(w);
    });
  });
  return clean.length > 0 ? clean[0] : "Sin frases";
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
