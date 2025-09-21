import express from "express";
import rates from "./routes/rates.routes";

import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

import { dailyScraping } from "./cron/daily";
import { saveRate } from "./services/data.service";


const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Rate API',
      version: '1.0.0',
      description: 'API para obtener tasas de cambio',
    },
  },
  apis: ['./src/docs/*.ts', './src/routes/*.ts'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api/rates", rates);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.listen(PORT, async() => {
  await saveRate();
  console.log(`Server is running on port ${PORT}`);
  dailyScraping();
});

export default app;