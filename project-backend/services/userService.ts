import bcrypt from 'bcrypt';
import { Op } from 'sequelize';

import { Order } from '../models';
import User, { NewUser, removePasswordHash, removePasswordHashAndToken, UserAttributes } from '../models/user';

import { handleError } from '../util/error_handler';
import { isNumber, isObject, isString } from '../types/type_functions';

const addNew = async (newUser: NewUser): Promise<UserAttributes | null> => {
    try {
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(newUser.password, saltRounds);

        const user = await User.create({ ...newUser, passwordHash: passwordHash });
        await user.save();

        return removePasswordHash(user);
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

const deleteById = async (id: unknown): Promise<UserAttributes | null> => {
    try {
        const user = isNumber(Number(id)) ? await User.findByPk(Number(id)) : null;
        if (user) {
            await user.destroy();
        }
        return removePasswordHash(user);
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

const getAll = async (searchQuery: string = ''): Promise<Array<UserAttributes | null>> => {
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
            include: [
                {
                    model: Order,
                },
            ],
            attributes: { exclude: ['passwordHash', 'token'] },
            where,
            order: [['username', 'ASC']],
        });

        return users;
    } catch (err: unknown) {
        handleError(err);
        return [];
    }
};

// prettier-ignore
const getById = async (id: unknown, includeToken: boolean): Promise<UserAttributes | null> => {
    try {
        const user = isNumber(Number(id))
            ? await User.findByPk(Number(id), {
                include: [
                    {
                        model: Order,
                    },
                ],
                attributes: { exclude: includeToken ? ['passwordHash'] : ['passwordHash', 'token'] }
            })
            : null;
        return user;
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

// prettier-ignore
const getUsernameIsAvailable = async (username: unknown): Promise<boolean> => {
    try {
        const user = isString(username)
            ? await User.findOne({
                where: { username: username },
            })
            : null;

        return user === null;
    } catch (err: unknown) {
        handleError(err);
        return false;
    }
};

const update = async (id: unknown, props: unknown): Promise<UserAttributes | null> => {
    try {
        const user = isNumber(Number(id)) ? await User.findByPk(Number(id)) : null;

        if (user) {
            if (isObject(props)) {
                Object.keys(props).forEach((key) => {
                    if (key in user) {
                        if (key !== 'id') {
                            user.setDataValue(key as keyof UserAttributes, props[key as keyof typeof props]);
                        }
                    } else {
                        throw new Error(`Invalid property '${key}' for User`);
                    }
                });

                await user.save();
            } else {
                throw new Error('Invalid props value (not an object)');
            }
        }

        return removePasswordHashAndToken(user);
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
    getUsernameIsAvailable,
    update,
};
