import prisma from "../lib/prisma";
import { Request, Response } from "express";
import { todayCaracasMidnight } from "../lib/date";
import { saveRate } from "../services/data.service";


export async function getCurrentRate(
  _req: Request,
  res: Response
): Promise<void> {

  try {
    const rate = await prisma.rate.findFirst({
      orderBy: {
        date: "desc",
      },
      select: {
        date: true,
        rate: true,
        rateEUR: true
      },
    });

    if (!rate) {
      res.status(404).json({ error: "Rate not found" });
      return;
    }

    res.status(200).json({
      date: rate.date.toISOString().split('T')[0],
      rate: rate.rate,
      rateEUR: rate.rateEUR
    });

  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getLatestRateField(field: "rate" | "rateEUR"): Promise<number | null> {
  const record = await prisma.rate.findFirst({
    orderBy: {
      date: "desc",
    },
    select: {
      [field]: true,
    },
  });

  if (!record) {
    return null;
  }

  return record[field];
}

export async function getCurrentRateUSD(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const rate = await getLatestRateField("rate");

    if (rate === null) {
      res.status(404).json({ error: "Rate not found" });
      return;
    }

    res.status(200).json(rate);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getCurrentRateEUR(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const rateEUR = await getLatestRateField("rateEUR");

    if (rateEUR === null) {
      res.status(404).json({ error: "Rate not found" });
      return;
    }

    res.status(200).json(rateEUR);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getHistoricalRates(
  req: Request,
  res: Response
): Promise<void> {
  try {
    
    const { start_date, end_date } = req.query;

    console.log({start_date, end_date})

    let where;
    if (start_date && end_date) {
      where = {
        date: {
          gte: new Date(start_date + 'T00:00:00.000-04:00'),
          lte: new Date(end_date + 'T23:59:59.999-04:00')
        }
      }
    }

    const rates = await prisma.rate.findMany({
      where,
      orderBy: {
        date: "desc",
      },
      select: {
        date: true,
        rate: true,
        rateEUR: true
      },
    });

    if (!rates) {
      res.status(404).json({ error: "Rates not found" });
      return;
    }

    res.status(200).json(
      rates.map((rate: { date: Date; rate: number; rateEUR: number }) => (
        {
          date: rate.date.toISOString().split('T')[0], 
          rate: rate.rate,
          rateEUR: rate.rateEUR
        }
      ))
    );
    
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log(error)
  }
};

/**
 * Devuelve la tasa del próximo día hábil (fecha valor > hoy en Caracas).
 * Como el BCV salta fines de semana y feriados, "próxima" no es siempre
 * mañana calendario. Si todavía no hay una tasa futura publicada, hace
 * fallback a la tasa vigente con isFuture: false.
 */
export async function getNextRate(
  _req: Request,
  res: Response
): Promise<void> {
  try {
    const today = todayCaracasMidnight();

    const future = await prisma.rate.findFirst({
      where: { date: { gt: today } },
      orderBy: { date: "asc" },
      select: { date: true, rate: true, rateEUR: true },
    });

    if (future) {
      res.status(200).json({
        date: future.date.toISOString().split('T')[0],
        rate: future.rate,
        rateEUR: future.rateEUR,
        isFuture: true,
      });
      return;
    }

    // Fallback: aún no hay tasa futura, devolvemos la vigente.
    const current = await prisma.rate.findFirst({
      orderBy: { date: "desc" },
      select: { date: true, rate: true, rateEUR: true },
    });

    if (!current) {
      res.status(404).json({ error: "Rate not found" });
      return;
    }

    res.status(200).json({
      date: current.date.toISOString().split('T')[0],
      rate: current.rate,
      rateEUR: current.rateEUR,
      isFuture: false,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log(error);
  }
}

/**
 * Dispara un scrapeo del BCV bajo demanda y guarda el resultado.
 * Útil si una corrida del cron falló. Si la variable de entorno SCRAPE_TOKEN
 * está definida, exige el header x-scrape-token; si no, queda abierto (dev).
 */
export async function triggerScrape(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const expectedToken = process.env.SCRAPE_TOKEN;
    if (expectedToken && req.header("x-scrape-token") !== expectedToken) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const saved = await saveRate();

    if (!saved) {
      res.status(502).json({ error: "Scraping failed" });
      return;
    }

    const today = todayCaracasMidnight();
    res.status(200).json({
      date: saved.date.toISOString().split('T')[0],
      rate: saved.rate,
      rateEUR: saved.rateEUR,
      isFuture: saved.date.getTime() > today.getTime(),
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
    console.log(error);
  }
}
