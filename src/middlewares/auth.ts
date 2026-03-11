// este codigo es para generar como una puerta extra que servira para autenticar la API KEY.

import { Request, Response, NextFunction } from "express";

export const verifyApiKey = (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const apiKey = req.header("x-api-key"); //no se si es el nombre

    if (!apiKey) {

        return res.status(401).json({ error: "the API key is missing" });

    }

    if (apiKey !== process.env.API_KEY) {
        return res.status(403).json({ error: "API Key not valid." });
    }


    next();
};


