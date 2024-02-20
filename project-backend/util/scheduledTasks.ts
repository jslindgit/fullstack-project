import * as cron from 'node-cron';

import imageService from '../services/imageService';
import { dateFormat } from './misc';
import orderService from '../services/orderService';

// Delete unused images:
cron.schedule('0 * * * *', () => {
    console.log(dateFormat(new Date()));

    imageService
        .deleteUnusedImages()
        .then()
        .catch((err) => {
            console.error(err);
        });
});

// Delete expired unpaid orders:
cron.schedule('*/2 * * * *', () => {
    console.log(dateFormat(new Date()));

    orderService
        .deleteExpiredUnpaidOrders()
        .then()
        .catch((err) => {
            console.error(err);
        });
});
