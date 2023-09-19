import express from 'express';

import { PORT } from './util/config';
import { connectToDatabase } from './util/db';

import categoryRouter from './routes/category_router';
import itemRouter from './routes/item_router';

const app = express();
app.use(express.json());

app.get('/', (_req, res) => {
    res.status(200).send('Full Stack open project');
});

app.use('/api/categories', categoryRouter);
app.use('/api/items', itemRouter);

const start = async () => {
    await connectToDatabase();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

void start();
