import express from 'express';
import cors from 'cors';

import { PORT } from './util/config';
import { connectToDatabase } from './util/db';

import categoryRouter from './routes/categoryRouter';
import image_itemRouter from './routes/image_itemRouter';
import imageRouter from './routes/imageRouter';
import item_categoryRouter from './routes/item_categoryRouter';
import itemRouter from './routes/itemRouter';
import loginRouter from './routes/loginRouter';
import userRouter from './routes/userRouter';

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
app.use('/api/image_items', image_itemRouter);
app.use('/api/images', imageRouter);
app.use('/api/items', itemRouter);
app.use('/api/item_categories', item_categoryRouter);
app.use('/api/login', loginRouter);
app.use('/api/users', userRouter);

const start = async () => {
    await connectToDatabase();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

void start();
