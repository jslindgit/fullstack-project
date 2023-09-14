//import cors from 'cors';
import express from 'express';

import { PORT } from './util/config';
import { connectToDatabase } from './util/db';

const app = express();
app.use(express.json());
//app.use(cors);

app.get('/', (_req, res) => {
    res.status(200).send('Full Stack open');
});


const start = async () => {
    await connectToDatabase();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

void start();