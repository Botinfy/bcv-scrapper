import { Router } from "express";
import { getCurrentRate, getCurrentRateEUR, getCurrentRateUSD, getHistoricalRates } from "../controllers/rate.controller";
import { verifyApiKey } from "../middlewares/auth"; // el nuevo middleware para auth

const rateRouter = Router();

// Aplicar el middleware a todas las rutas del router
rateRouter.use(verifyApiKey);

rateRouter.get("/current", getCurrentRate);
rateRouter.get("/current/usd", getCurrentRateUSD);
rateRouter.get("/current/eur", getCurrentRateEUR);
rateRouter.get("/history", getHistoricalRates);

export default rateRouter;
