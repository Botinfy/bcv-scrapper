import cron from 'node-cron';
import { saveRate } from '../services/data.service';

//
export function dailyScraping() {
    cron.schedule('0 0 * * *', async () => {
        await saveRate();
    }, {
        timezone: 'America/Caracas'
    });

    console.log('Cron job started');
}

