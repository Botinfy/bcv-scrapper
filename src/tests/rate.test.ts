import request from 'supertest';
import app from '../index';
import prisma from '../lib/prisma';
import { caracasMidnight, todayCaracasMidnight } from '../lib/date';

const DAY = 24 * 60 * 60 * 1000;
const today = todayCaracasMidnight();
const past = caracasMidnight(new Date(today.getTime() - 5 * DAY));
const future = caracasMidnight(new Date(today.getTime() + 2 * DAY));

// Estado base determinista: una tasa pasada y la vigente de hoy. SIN tasa futura.
// Los tests que necesitan una tasa futura la crean explícitamente.
beforeEach(async () => {
  await prisma.rate.deleteMany();
  await prisma.rate.createMany({
    data: [
      { date: past, rate: 40.0, rateEUR: 44.0 },
      { date: today, rate: 50.0, rateEUR: 55.0 },
    ],
  });
});

afterAll(async () => {
  await prisma.rate.deleteMany();
  await prisma.$disconnect();
});

describe('GET /api/rates/current', () => {
  it('should return the current rate with date and rate properties', async () => {
    const response = await request(app).get('/api/rates/current');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('date');
    expect(response.body).toHaveProperty('rate');
    expect(typeof response.body.rate).toBe('number');
    expect(typeof response.body.date).toBe('string');
  });
});

describe('GET /api/rates/current/usd', () => {
  it('should return only the USD rate as a number', async () => {
    const response = await request(app).get('/api/rates/current/usd');
    expect(response.status).toBe(200);
    expect(typeof response.body).toBe('number');
  });
});

describe('GET /api/rates/current/eur', () => {
  it('should return only the EUR rate as a number', async () => {
    const response = await request(app).get('/api/rates/current/eur');
    expect(response.status).toBe(200);
    expect(typeof response.body).toBe('number');
  });
});

describe('GET /api/rates/history', () => {
  it('should return the history of rates with date and rate properties', async () => {
    const response = await request(app).get('/api/rates/history');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    response.body.forEach((rate: { date: string; rate: number }) => {
      expect(rate).toHaveProperty('date');
      expect(rate).toHaveProperty('rate');
      expect(typeof rate.rate).toBe('number');
      expect(typeof rate.date).toBe('string');
    });
  });
});

describe('GET /api/rates/next', () => {
  it('returns the future rate with isFuture true when one exists', async () => {
    await prisma.rate.create({ data: { date: future, rate: 60.0, rateEUR: 66.0 } });

    const response = await request(app).get('/api/rates/next');
    expect(response.status).toBe(200);
    expect(response.body.isFuture).toBe(true);
    expect(response.body.rate).toBe(60.0);
    expect(response.body.date).toBe(future.toISOString().split('T')[0]);
  });

  it('falls back to the current rate with isFuture false when no future rate exists', async () => {
    const response = await request(app).get('/api/rates/next');
    expect(response.status).toBe(200);
    expect(response.body.isFuture).toBe(false);
    expect(response.body.rate).toBe(50.0); // la vigente de hoy
  });

  it('returns 404 when there are no rates at all', async () => {
    await prisma.rate.deleteMany();

    const response = await request(app).get('/api/rates/next');
    expect(response.status).toBe(404);
  });
});

describe('upsert idempotency (saveRate / value date)', () => {
  it('does not create duplicate rows for the same value date', async () => {
    await prisma.rate.deleteMany();
    const date = today;

    await prisma.rate.upsert({
      where: { date },
      update: { rate: 70.0, rateEUR: 77.0 },
      create: { date, rate: 70.0, rateEUR: 77.0 },
    });
    await prisma.rate.upsert({
      where: { date },
      update: { rate: 71.0, rateEUR: 78.0 },
      create: { date, rate: 71.0, rateEUR: 78.0 },
    });

    const rows = await prisma.rate.findMany({ where: { date } });
    expect(rows).toHaveLength(1);
    expect(rows[0].rate).toBe(71.0); // se actualizó, no se duplicó
  });
});
