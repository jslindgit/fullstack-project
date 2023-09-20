import { Model, DataTypes } from 'sequelize';

import { sequelize } from '../util/db';

export class User extends Model {}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING,
            validate: {
                isEmail: true,
            },
            unique: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        admin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        disabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        token: {
            type: DataTypes.STRING,
            defaultValue: '',
        },
    },
    {
        sequelize,
        underscored: true,
        timestamps: true,
        modelName: 'user',
    }
);
