import {  Router } from "express";
import { getCurrentRate, getCurrentRateEUR, getCurrentRateUSD, getHistoricalRates, getNextRate, triggerScrape } from "../controllers/rate.controller";

const rateRouter = Router();

rateRouter.get("/current", getCurrentRate);
rateRouter.get("/current/usd", getCurrentRateUSD);
rateRouter.get("/current/eur", getCurrentRateEUR);
rateRouter.get("/next", getNextRate);
rateRouter.get("/history", getHistoricalRates);
rateRouter.post("/scrape", triggerScrape);


export default rateRouter;
