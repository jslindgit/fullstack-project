import cors from 'cors';
import express from 'express';
import path from 'path';

import { PORT } from './util/config';
import { connectToDatabase } from './util/db';

import categoryRouter from './routes/categoryRouter';
import imageRouter from './routes/imageRouter';
import item_categoryRouter from './routes/item_categoryRouter';
import itemRouter from './routes/itemRouter';
import loginRouter from './routes/loginRouter';
import orderRouter from './routes/orderRouter';
import paytrailRouter from './routes/paytrailRouter';
import settingsRouter from './routes/settingsRouter';
import userRouter from './routes/userRouter';

import './util/scheduledTasks';

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(cors());

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200,
};

app.use(express.static('dist'));

app.use('/api/categories', categoryRouter);
app.use('/api/images', imageRouter);
app.use('/api/items', itemRouter);
app.use('/api/item_categories', item_categoryRouter);
app.use('/api/login', loginRouter);
app.use('/api/orders', orderRouter);
app.use('/api/paytrail', paytrailRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/users', userRouter);

app.use('/api/images', cors(corsOptions));

app.use('/images', express.static(path.join(__dirname, 'images')));

app.get('/version', (_req, res) => {
    res.send('2');
});

app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, './../dist', 'index.html'));
});

const start = async () => {
    await connectToDatabase();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

void start();
