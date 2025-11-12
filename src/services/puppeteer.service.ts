// src/services/puppeteer.service.ts
import puppeteer from "puppeteer";
import { getPuppeteerConfig } from "../config/puppeteer.config";

type RateResult = { date: Date; rate: number; rateEUR: number };

export async function getCurrentRate(): Promise<RateResult> {

  const browser = await puppeteer.launch(getPuppeteerConfig());

  try {
    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36"
    );

    await page.goto("https://www.bcv.org.ve/", {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });

    // Espera a que aparezcan los selectores
    await page.waitForSelector("#dolar strong", { timeout: 30_000 });
    await page.waitForSelector("#euro strong", { timeout: 30_000 });
    await page.waitForSelector(".date-display-single", { timeout: 30_000 });

    const { rateText, dateContent, rateTextEUR } = await page.evaluate(() => {
      const strong = document.querySelector("#dolar strong");
      const strongEUR = document.querySelector("#euro strong");
      const dateEl = document.querySelector(".date-display-single");

      const rateText =
        strong?.textContent?.trim() || strong?.innerHTML?.trim() || "";
      const rateTextEUR =
        strongEUR?.textContent?.trim() || strongEUR?.innerHTML?.trim() || "";
      const dateContent = dateEl?.getAttribute("content") || "";

      return { rateText, rateTextEUR, dateContent };
    });

    if (!rateText || !dateContent) {
      throw new Error("No se pudieron obtener 'rate' o 'date' del DOM.");
    }

    // Convierte "xx,yy" ->  xx.yy  y parsea
    const rate = parseFloat(rateText.replace(/\./g, "").replace(",", "."));
    const rateEUR = parseFloat(rateTextEUR.replace(/\./g, "").replace(",", "."));
    const date = new Date(dateContent);

    if (Number.isNaN(rate) || isNaN(date.getTime())) {
      throw new Error(`Valores inválidos. rate="${rateText}" rateEUR="${rateTextEUR}" date="${dateContent}"`);
    }

    // DEBUG opcional
    // console.log(date, rate);

    return { date, rate, rateEUR };
  } 
  catch (error) {
    console.error("Error al obtener la tasa actual:", error);
    throw error;
  }
  finally {
    await browser.close();
  }
}
