"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const config_1 = require("./util/config");
const db_1 = require("./util/db");
const categoryRouter_1 = __importDefault(require("./routes/categoryRouter"));
const imageRouter_1 = __importDefault(require("./routes/imageRouter"));
const item_categoryRouter_1 = __importDefault(require("./routes/item_categoryRouter"));
const itemRouter_1 = __importDefault(require("./routes/itemRouter"));
const loginRouter_1 = __importDefault(require("./routes/loginRouter"));
const orderRouter_1 = __importDefault(require("./routes/orderRouter"));
const paytrailRouter_1 = __importDefault(require("./routes/paytrailRouter"));
const settingsRouter_1 = __importDefault(require("./routes/settingsRouter"));
const userRouter_1 = __importDefault(require("./routes/userRouter"));
require("./util/scheduledTasks");
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use((0, cors_1.default)());
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
/*app.get('/', (_req, res) => {
    res.status(200).send('Full Stack open project');
});*/
app.use(express_1.default.static('dist'));
app.get('/api/ping', (_req, res) => {
    console.log('someone pinged here');
    res.status(200).send('pong');
});
app.use('/api/categories', categoryRouter_1.default);
app.use('/api/images', imageRouter_1.default);
app.use('/api/items', itemRouter_1.default);
app.use('/api/item_categories', item_categoryRouter_1.default);
app.use('/api/login', loginRouter_1.default);
app.use('/api/orders', orderRouter_1.default);
app.use('/api/paytrail', paytrailRouter_1.default);
app.use('/api/settings', settingsRouter_1.default);
app.use('/api/users', userRouter_1.default);
app.use('/api/images', (0, cors_1.default)(corsOptions));
app.use('/images', express_1.default.static(path_1.default.join(__dirname, 'images')));
app.get('*', (_req, res) => {
    res.sendFile(path_1.default.join(__dirname, './../dist', 'index.html'));
});
const start = async () => {
    await (0, db_1.connectToDatabase)();
    app.listen(config_1.PORT, () => {
        console.log(`Server running on port ${config_1.PORT}`);
    });
};
void start();
