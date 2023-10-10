import { Op } from 'sequelize';

import { Image } from '../models';
import { NewImage } from '../types/types';

import { isNumber, isObject } from '../types/type_functions';
import { handleError } from '../util/error_handler';

const addNew = async (newImage: NewImage): Promise<Image | null> => {
    try {
        const image = await Image.create(newImage);
        await image.save();

        return image;
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

const deleteById = async (id: unknown): Promise<Image | null> => {
    try {
        const image = await getById(id);
        if (image) {
            await image.destroy();
        }
        return image;
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

const getAll = async (searchQuery: string = ''): Promise<Array<Image> | null> => {
    try {
        let where = {};
        if (searchQuery && searchQuery.length > 0) {
            where = {
                [Op.or]: [
                    {
                        filename: {
                            [Op.iLike]: `%${searchQuery}%`,
                        },
                    },
                ],
            };
        }

        const images = await Image.findAll({
            where,
            order: [['name', 'ASC']],
        });

        return images;
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

// prettier-ignore
const getById = async (id: unknown): Promise<Image | null> => {
    try {
        const image = isNumber(Number(id))
            ? await Image.findByPk(Number(id))
            : null;
        return image;
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

const update = async (id: unknown, props: unknown): Promise<Image | null> => {
    try {
        const image = await getById(id);
        if (image) {
            if (isObject(props)) {
                Object.keys(props).forEach((key) => {
                    if (key in image) {
                        image.setDataValue(key, props[key as keyof typeof props]);
                    } else {
                        throw new Error(`Invalid property '${key}' for Image`);
                    }
                });

                await image.save();
            } else {
                throw new Error('Invalid props value (not an object)');
            }
        }
        return image;
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
