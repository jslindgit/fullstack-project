import express from 'express';
import cors from 'cors';

import { PORT } from './util/config';
import { connectToDatabase } from './util/db';

import categoryRouter from './routes/category_router';
import item_categoryRouter from './routes/item_category_router';
import itemRouter from './routes/item_router';
import userRouter from './routes/user_router';

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (_req, res) => {
    res.status(200).send('Full Stack open project');
});

app.get('/api/ping', (_req, res) => {
    console.log('someone pinged here');
    res.status(200).send('pong');
});

app.use('/api/categories', categoryRouter);
app.use('/api/items', itemRouter);
app.use('/api/item_categories', item_categoryRouter);
app.use('/api/users', userRouter);

const start = async () => {
    await connectToDatabase();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

void start();
