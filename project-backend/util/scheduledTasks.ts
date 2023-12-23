import * as cron from 'node-cron';

import imageService from '../services/imageService';

cron.schedule('* 00 * * *', () => {
    imageService
        .deleteUnusedImages()
        .then()
        .catch((err) => {
            console.error(err);
        });
});
