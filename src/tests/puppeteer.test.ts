import { getCurrentRate } from "../services/puppeteer.service";

describe('scraping', () => {
    it('should scrape the rates from the website', async () => {
        const response = await getCurrentRate();
        console.log(response);
        expect(response).toHaveProperty('date');
        expect(response).toHaveProperty('rate');
        expect(typeof response.rate).toBe('number');
        expect(response.date instanceof Date).toBe(true);
    });
});