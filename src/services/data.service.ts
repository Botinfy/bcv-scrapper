import prisma from "../lib/prisma";
import { Request, Response } from "express";
import { getCurrentRate } from "./puppeteer.service";

export async function saveRate(): Promise<void> {
  try {
    const scrappedResult = await getCurrentRate();

    console.log({scrappedResult: scrappedResult})

    await prisma.rate.create({
      data: {
        date: scrappedResult.date,
        rate: scrappedResult.rate,
      },
    });

  } catch (error) {
    console.error(error);
  }
}
