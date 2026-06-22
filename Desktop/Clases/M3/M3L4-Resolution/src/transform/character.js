/*
 * character.js — Transformación de raw API -> ViewModel
 *
 * Responsabilidad única: convertir el objeto crudo de la API en
 * un objeto estable y predecible para la UI.
 */

/*
 * getOriginName(raw)
 * El campo origin es un OBJETO: { name: "Earth (C-137)", url: "..." }.
 * Usamos optional chaining para no romper si origin viene null/undefined.
 */
function getOriginName(raw) {
  return raw.origin?.name ?? "Unknown";
}

/*
 * getLocationName(raw)
 * Mismo patrón que origin: objeto anidado { name, url }.
 */
function getLocationName(raw) {
  return raw.location?.name ?? "Unknown";
}

/*
 * getStatusClass(status)
 * Mapea el status de la API a la clase CSS del punto de color.
 */
function getStatusClass(status) {
  const map = {
    Alive: "alive",
    Dead: "dead",
    unknown: "unknown",
  };

  return map[status] ?? "unknown";
}

/*
 * toCharacterProfile(rawCharacter)
 * ─────────────────────────────────
 * Convierte raw JSON anidado en un ViewModel plano.
 * Usamos ?? y no || para no pisar valores válidos como "" o 0.
 */
export function toCharacterProfile(rawCharacter) {
  const { id, name, status, species, image } = rawCharacter;

  return {
    id: id ?? 0,
    name: name ?? "Desconocido",
    image: image ?? "",
    status: status ?? "unknown",
    statusClass: getStatusClass(status),
    species: species ?? "Unknown",
    originName: getOriginName(rawCharacter),
    locationName: getLocationName(rawCharacter),
  };
}

/*
 * toCharacterProfileList(rawArray)
 * ─────────────────────────────────
 * Array.map() transforma una colección raw en otra colección de ViewModels.
 */
export function toCharacterProfileList(rawArray) {
  return rawArray.map(toCharacterProfile);
}
