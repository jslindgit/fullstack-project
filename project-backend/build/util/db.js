"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDatabase = exports.rollbackMigration = exports.sequelize = void 0;
const sequelize_1 = require("sequelize");
const umzug_1 = require("umzug");
const config_1 = require("./config");
exports.sequelize = new sequelize_1.Sequelize(config_1.DATABASE_URL);
const migrationConf = {
    migrations: {
        glob: 'migrations/*.ts',
    },
    storage: new umzug_1.SequelizeStorage({ sequelize: exports.sequelize, tableName: 'migrations' }),
    context: exports.sequelize.getQueryInterface(),
    logger: console,
};
const runMigrations = async () => {
    const migrator = new umzug_1.Umzug(migrationConf);
    const migrations = await migrator.up();
    console.log('Migrations up to date', {
        files: migrations.map((mig) => mig.name),
    });
};
const rollbackMigration = async () => {
    await exports.sequelize.authenticate();
    const migrator = new umzug_1.Umzug(migrationConf);
    await migrator.down();
};
exports.rollbackMigration = rollbackMigration;
const connectToDatabase = async () => {
    try {
        await exports.sequelize.authenticate();
        await runMigrations();
        console.log('Database connected');
    }
    catch (err) {
        console.log('Connecting database failed:', err);
        return process.exit(1);
    }
    //return null;
};
exports.connectToDatabase = connectToDatabase;
