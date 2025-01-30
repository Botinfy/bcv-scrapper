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

## Cron
The cron job is set to run every day at 7:30 AM.

## Swagger
The swagger documentation is available at http://localhost:3000/api-docs
