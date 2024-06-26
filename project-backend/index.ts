import 'express-async-errors';
import cors from 'cors';
import express from 'express';
import path from 'path';

import { PORT } from './util/config';
import { connectToDatabase } from './util/db';

import categoryRouter from './routes/categoryRouter';
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

app.use(express.static('dist'));

app.use('/api/categories', categoryRouter);
app.use('/api/items', itemRouter);
app.use('/api/login', loginRouter);
app.use('/api/orders', orderRouter);
app.use('/api/paytrail', paytrailRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/users', userRouter);

app.get('/health', (_req, res) => {
    res.status(200).send('ok');
});

app.get('/version', (_req, res) => {
    res.send('4');
});

app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, './../dist', 'index.html'));
});

const start = async () => {
    process.env.TZ = 'UTC';

    await connectToDatabase();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

void start();
