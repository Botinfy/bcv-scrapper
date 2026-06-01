import prisma from "../lib/prisma";
import { getCurrentRate } from "./puppeteer.service";

type SavedRate = { date: Date; rate: number; rateEUR: number };

/**
 * Scrapea la tasa actual del BCV y la guarda de forma idempotente.
 * Usa upsert sobre la fecha valor (date es @unique): si ya existe esa fecha
 * valor la actualiza (soporta correcciones del BCV), si no la crea. Así
 * múltiples corridas del cron o del arranque no generan duplicados.
 * Devuelve el registro guardado (lo usa el trigger manual).
 */
export async function saveRate(): Promise<SavedRate | null> {
  try {
    const scrappedResult = await getCurrentRate();

    console.log({ scrappedResult });

    const saved = await prisma.rate.upsert({
      where: { date: scrappedResult.date },
      update: {
        rate: scrappedResult.rate,
        rateEUR: scrappedResult.rateEUR,
      },
      create: {
        date: scrappedResult.date,
        rate: scrappedResult.rate,
        rateEUR: scrappedResult.rateEUR,
      },
    });

    return { date: saved.date, rate: saved.rate, rateEUR: saved.rateEUR };
  } catch (error) {
    console.error(error);
    return null;
  }
}
