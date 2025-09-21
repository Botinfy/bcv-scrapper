import {  Router } from "express";
import { getHistoricalRates, getCurrentRate } from "../controllers/rate.controller";

const rateRouter = Router();

rateRouter.get("/current", getCurrentRate);
rateRouter.get("/history", getHistoricalRates);


export default rateRouter;

