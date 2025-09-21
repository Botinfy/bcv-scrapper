// src/services/puppeteer.service.ts
import puppeteer from "puppeteer";

type RateResult = { date: Date; rate: number };

export async function getCurrentRate(): Promise<RateResult> {

  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
    ],
  });

  try {
    const page = await browser.newPage();

    await page.goto("https://www.bcv.org.ve/", {
      waitUntil: "domcontentloaded",
      timeout: 60_000,
    });

    // Espera a que aparezcan los selectores
    await page.waitForSelector("#dolar strong", { timeout: 30_000 });
    await page.waitForSelector(".date-display-single", { timeout: 30_000 });

    const { rateText, dateContent } = await page.evaluate(() => {
      const strong = document.querySelector("#dolar strong");
      const dateEl = document.querySelector(".date-display-single");

      const rateText =
        strong?.textContent?.trim() || strong?.innerHTML?.trim() || "";
      const dateContent = dateEl?.getAttribute("content") || "";

      return { rateText, dateContent };
    });

    if (!rateText || !dateContent) {
      throw new Error("No se pudieron obtener 'rate' o 'date' del DOM.");
    }

    // Convierte "xx,yy" ->  xx.yy  y parsea
    const rate = parseFloat(rateText.replace(/\./g, "").replace(",", "."));
    const date = new Date(dateContent);

    if (Number.isNaN(rate) || isNaN(date.getTime())) {
      throw new Error(`Valores inválidos. rate="${rateText}" date="${dateContent}"`);
    }

    // DEBUG opcional
    // console.log(date, rate);

    return { date, rate };
  } finally {
    await browser.close();
  }
}
