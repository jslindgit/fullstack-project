import { Op } from 'sequelize';

import { User } from '../models';
import { NewUser } from '../types/types';
import { isNumber, isObject } from '../types/type_functions';
import { handleError } from '../util/error_handler';

const addNew = async (newUser: NewUser): Promise<User | null> => {
    try {
        const user = await User.create(newUser);
        await user.save();
        return user;
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

const deleteById = async (id: unknown): Promise<User | null> => {
    try {
        const user = await getById(id);
        if (user) {
            await user.destroy();
        }
        return user;
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

const getAll = async (searchQuery: string = ''): Promise<Array<User> | null> => {
    try {
        let where = {};
        if (searchQuery && searchQuery.length > 0) {
            where = {
                [Op.or]: [
                    {
                        username: {
                            [Op.iLike]: `%${searchQuery}%`,
                        },
                    },
                    {
                        name: {
                            [Op.iLike]: `%${searchQuery}%`,
                        },
                    },
                ],
            };
        }

        const users = await User.findAll({
            where,
            order: [['username', 'ASC']],
        });

        return users;
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

const getById = async (id: unknown): Promise<User | null> => {
    try {
        const user = isNumber(Number(id)) ? await User.findByPk(Number(id)) : null;
        return user;
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

const update = async (id: unknown, props: unknown): Promise<User | null> => {
    try {
        const user = await getById(id);
        if (user) {
            if (isObject(props)) {
                Object.keys(props).forEach((key) => {
                    if (key in user && key !== 'id') {
                        user.setDataValue(key, props[key as keyof typeof props]);
                    } else {
                        throw new Error(`Invalid property '${key}' for User`);
                    }
                });

                await user.save();
            } else {
                throw new Error('Invalid props value (not an object)');
            }
        }
        return user;
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

export default {
    addNew,
    deleteById,
    getAll,
    getById,
    update,
};