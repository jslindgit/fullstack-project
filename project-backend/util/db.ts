import { Sequelize } from 'sequelize';
import { Umzug, SequelizeStorage } from 'umzug';

import { DATABASE_URL } from './config';

//export const sequelize = new Sequelize(DATABASE_URL);
export const sequelize = new Sequelize(DATABASE_URL, {
    logging: (msg) => {
        if (msg.startsWith('ERROR')) {
            console.error(msg); // Log errors to stderr
        }
    },
});

const migrationConf = {
    migrations: {
        glob: 'migrations/*.ts',
    },
    storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
    context: sequelize.getQueryInterface(),
    logger: console,
};

const runMigrations = async () => {
    const migrator = new Umzug(migrationConf);
    const migrations = await migrator.up();
    console.log('Migrations up to date', {
        files: migrations.map((mig) => mig.name),
    });
};

export const rollbackMigration = async () => {
    await sequelize.authenticate();
    const migrator = new Umzug(migrationConf);
    await migrator.down();
};

export const connectToDatabase = async () => {
    try {
        await sequelize.authenticate();
        await runMigrations();
        console.log('Database connected');
    } catch (err) {
        console.log('Connecting database failed:', err);
        return process.exit(1);
    }
};
