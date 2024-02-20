import * as cron from 'node-cron';

import imageService from '../services/imageService';
import { dateFormat } from './misc';
import orderService from '../services/orderService';

// Delete unused images (12:00 UTC):
cron.schedule('00 12 * * *', () => {
    console.log(dateFormat(new Date()));

    imageService
        .deleteUnusedImages()
        .then()
        .catch((err) => {
            console.error(err);
        });
});

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
