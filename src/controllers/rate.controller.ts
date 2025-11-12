import prisma from "../lib/prisma";
import { Request, Response } from "express";


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
      rates.map(rate => (
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
