import * as cron from 'node-cron';

import { dateFormat } from './misc';
import orderService from '../services/orderService';

// Delete expired unpaid orders (13:00 UTC):
cron.schedule('00 13 * * *', () => {
    console.log(dateFormat(new Date()));

    orderService
        .deleteExpiredUnpaidOrders()
        .then()
        .catch((err) => {
            console.error(err);
        });
});
