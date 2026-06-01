import cron from 'node-cron';
import { saveRate } from '../services/data.service';
import { todayCaracasMidnight } from '../lib/date';

/**
 * Programa el scrapeo de la tasa del BCV.
 *
 * El BCV publica la tasa del próximo día hábil en la tarde del día anterior,
 * por eso corremos varias veces entre las 16:00 y las 22:59 (hora Caracas):
 * tolera que el BCV publique tarde o que una corrida falle. El guardado es
 * idempotente (upsert por fecha valor), así que repetir es seguro.
 */
export function dailyScraping() {
    cron.schedule('*/30 16-22 * * *', async () => {
        const saved = await saveRate();

        if (!saved) {
            console.error('[cron] Falló el scrapeo de la tasa.');
            return;
        }

        const today = todayCaracasMidnight();
        if (saved.date.getTime() > today.getTime()) {
            console.log(`[cron] Capturada tasa futura ✅ (fecha valor ${saved.date.toISOString().split('T')[0]})`);
        } else {
            console.log('[cron] El BCV aún no publica la próxima tasa.');
        }
    }, {
        timezone: 'America/Caracas'
    });

    console.log('Cron job started');
}
