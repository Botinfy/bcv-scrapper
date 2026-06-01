/**
 * @swagger
 * /api/rates/current:
 *   get:
 *     summary: Obtiene la tasa actual
 *     responses:
 *       200:
 *         description: Tasa actual
 *         
 */

/**
 * @swagger
 * /api/rates/current/usd:
 *   get:
 *     summary: Obtiene únicamente la tasa USD actual
 *     responses:
 *       200:
 *         description: Tasa USD actual (número)
 *         content:
 *           application/json:
 *             schema:
 *               type: number
 *             example: 57.12
 */

/**
 * @swagger
 * /api/rates/current/eur:
 *   get:
 *     summary: Obtiene únicamente la tasa EUR actual
 *     responses:
 *       200:
 *         description: Tasa EUR actual (número)
 *         content:
 *           application/json:
 *             schema:
 *               type: number
 *             example: 61.34
 */

/**
 * @swagger
 * /api/rates/next:
 *   get:
 *     summary: Obtiene la tasa del próximo día hábil (fecha valor futura)
 *     description: >
 *       Devuelve la tasa cuya fecha valor es posterior a hoy (hora Caracas).
 *       Como el BCV salta fines de semana y feriados, "próxima" no siempre es
 *       mañana calendario. Si aún no hay una tasa futura publicada, hace
 *       fallback a la tasa vigente con isFuture en false.
 *     responses:
 *       200:
 *         description: Próxima tasa (o vigente como fallback)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 date:
 *                   type: string
 *                   example: 2026-06-01
 *                 rate:
 *                   type: number
 *                   example: 554.42
 *                 rateEUR:
 *                   type: number
 *                   example: 645.67
 *                 isFuture:
 *                   type: boolean
 *                   description: true si la fecha valor es futura; false si es fallback a la vigente
 *                   example: true
 *       404:
 *         description: No hay tasas registradas
 */

/**
 * @swagger
 * /api/rates/scrape:
 *   post:
 *     summary: Fuerza un scrapeo del BCV bajo demanda y guarda el resultado
 *     description: >
 *       Dispara una captura inmediata de la tasa del BCV (idempotente por fecha
 *       valor). Si la variable de entorno SCRAPE_TOKEN está definida, requiere
 *       el header x-scrape-token.
 *     parameters:
 *       - in: header
 *         name: x-scrape-token
 *         schema:
 *           type: string
 *         required: false
 *         description: Token de protección (solo si SCRAPE_TOKEN está configurada)
 *     responses:
 *       200:
 *         description: Tasa capturada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 date:
 *                   type: string
 *                   example: 2026-06-01
 *                 rate:
 *                   type: number
 *                   example: 554.42
 *                 rateEUR:
 *                   type: number
 *                   example: 645.67
 *                 isFuture:
 *                   type: boolean
 *                   example: true
 *       401:
 *         description: Token inválido o ausente
 *       502:
 *         description: Falló el scrapeo del BCV
 */

/**
 * @swagger
 * /api/rates/history:
 *   get:
 *     summary: Obtiene el historial de las tasas desde una fecha inicial hasta una fecha final
 *     parameters:
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *         description: Fecha inicial en formato YYYY-MM-DD
 *         example: 2024-01-01
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *         description: Fecha final en formato YYYY-MM-DD
 *         example: 2024-12-31
 *     responses:
 *       200:
 *         description: Lista de tasas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     example: 2025-01-30
 *                   rate:
 *                     type: number
 *                     example: 9.99
 */
