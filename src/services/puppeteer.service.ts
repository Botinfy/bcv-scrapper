import puppeteer from "puppeteer";

export async function getCurrentRate(): Promise<{date: Date, rate: number}> {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.goto("https://www.bcv.org.ve/", {
    waitUntil: "domcontentloaded",
  });

  const rate = await page.$eval("#dolar", (element) => (
    element?.querySelector("strong")?.innerHTML
  ));
  

  const date = await page.$eval(".date-display-single", (element) => (
    element.getAttribute("content")
  ));

  await browser.close();

  console.log(date, rate);
  return {date: new Date(date || ""), rate: parseFloat(rate?.replace(',', '.') || "")};

}
