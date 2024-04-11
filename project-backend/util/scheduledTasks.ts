import * as cron from 'node-cron';

import { dateFormat } from './misc';
import orderService from '../services/orderService';

// cron.schedule('minute hour day-of-month month day-of-week)

// Delete expired unpaid orders (13:30 UTC):
cron.schedule('30 13 * * *', () => {
    console.log(dateFormat(new Date()));

    orderService
        .deleteExpiredUnpaidOrders()
        .then()
        .catch((err) => {
            console.error(err);
        });
});
