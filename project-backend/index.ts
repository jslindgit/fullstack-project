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
    origin: 'http://localhost:3000', // or your frontend URL
    credentials: true,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

/*app.get('/', (_req, res) => {
    res.status(200).send('Full Stack open project');
});*/

app.use(express.static('dist'));

app.get('/api/ping', (_req, res) => {
    console.log('someone pinged here');
    res.status(200).send('pong');
});

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

app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, './../dist', 'index.html'));
});

const start = async () => {
    await connectToDatabase();

    const port = 3001;

    console.log('PORT:', PORT);

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
};

void start();
