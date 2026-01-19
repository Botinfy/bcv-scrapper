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
