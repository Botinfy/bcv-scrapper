import {  Router } from "express";
import { getCurrentRate, getCurrentRateEUR, getCurrentRateUSD, getHistoricalRates } from "../controllers/rate.controller";

const rateRouter = Router();

rateRouter.get("/current", getCurrentRate);
rateRouter.get("/current/usd", getCurrentRateUSD);
rateRouter.get("/current/eur", getCurrentRateEUR);
rateRouter.get("/history", getHistoricalRates);


export default rateRouter;

