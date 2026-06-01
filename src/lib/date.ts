// Utilidades de fecha para la zona horaria de Venezuela.
// Venezuela usa UTC-4 fijo (no tiene horario de verano), por eso el offset es constante.
const CARACAS_OFFSET = "-04:00";

/**
 * Normaliza cualquier fecha a la medianoche (00:00:00) del día correspondiente
 * en hora de Caracas. Sirve como "fecha valor" canónica para deduplicar tasas:
 * todos los scrapes del mismo día valor colapsan en la misma fecha.
 */
export function caracasMidnight(d: Date): Date {
  // Obtenemos el año/mes/día tal como se ven en Caracas y reconstruimos
  // la medianoche local de ese día (expresada con el offset -04:00).
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Caracas",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);

  const get = (type: string) => parts.find((p) => p.type === type)?.value;
  const ymd = `${get("year")}-${get("month")}-${get("day")}`;

  return new Date(`${ymd}T00:00:00.000${CARACAS_OFFSET}`);
}

/**
 * Devuelve "hoy" a medianoche en hora de Caracas. Se usa para distinguir la
 * tasa vigente (fecha valor <= hoy) de la próxima (fecha valor > hoy).
 */
export function todayCaracasMidnight(): Date {
  return caracasMidnight(new Date());
}
