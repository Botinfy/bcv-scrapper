# Rate/Crawler API

## Description

This RESTful API provides the following functionality:

- Retrieve the current USD exchange rate and rate history from the BCV website (www.bcv.org.ve)
- Perform daily crawling of the official Central Bank of Venezuela website (https://www.bcv.org.ve) to obtain the current Bs./USD exchange rate
- Store the exchange rate in a database
- Provide endpoints to query both current and historical exchange rates


## Installation

```bash
npm install
```

## Prisma setup

```bash
npx prisma migrate dev
npm run seed
```

## Running the tests

```bash
npm test
```

## Running the API

```bash
npm run dev
```

## Endpoints

- `GET /api/rates/current` — current rate (latest value date) `{ date, rate, rateEUR }`
- `GET /api/rates/current/usd` — current USD rate (number)
- `GET /api/rates/current/eur` — current EUR rate (number)
- `GET /api/rates/next` — next business-day rate (value date in the future), `{ date, rate, rateEUR, isFuture }`. Falls back to the current rate with `isFuture: false` when the next rate has not been published yet.
- `GET /api/rates/history?start_date=&end_date=` — historical rates
- `POST /api/rates/scrape` — force an on-demand scrape. If the `SCRAPE_TOKEN` env var is set, requires the `x-scrape-token` header.

## Cron
The BCV publishes the next business-day rate in the afternoon of the prior day, so the scraper runs every 30 minutes from 16:00 to 22:59 (America/Caracas). Saving is idempotent (upsert per value date), so repeated runs do not create duplicates.

## Swagger
The swagger documentation is available at http://localhost:${PORT}/api-docs
