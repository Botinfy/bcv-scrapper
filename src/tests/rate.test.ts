import request from 'supertest';
import app from '../index';

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

describe('GET /api/rates/history', () => {
    it('should return the history of rates with date and rate properties', async () => {
      const response = await request(app)
        .get('/api/rates/history')
        .query({
          start_date: '2025-01-01',
          end_date: '2025-01-30',
        });
  
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((rate: { date: string; rate: number }) => {
        expect(rate).toHaveProperty('date');
        expect(rate).toHaveProperty('rate');
        // Opcional: Verificar que 'rate' sea un número
        expect(typeof rate.rate).toBe('number');
        // Opcional: Verificar que 'date' sea una cadena
        expect(typeof rate.date).toBe('string');
      });
    });
  });
