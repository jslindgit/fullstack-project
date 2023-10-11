import { Image_Item } from '../models';
import { NewImage_Item } from '../types/types';
import { isNumber } from '../types/type_functions';
import { handleError } from '../util/error_handler';

const addNew = async (newImage_Item: NewImage_Item): Promise<Image_Item | null> => {
    try {
        const image_item = await Image_Item.create(newImage_Item);
        await image_item.save();
        return image_item;
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

const deleteById = async (id: unknown): Promise<Image_Item | null> => {
    try {
        const image_item = await getById(id);
        if (image_item) {
            await image_item.destroy();
        }
        return image_item;
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

const deleteByImageAndItemId = async (imageId: unknown, itemId: unknown): Promise<Image_Item | null> => {
    try {
        const image_item = isNumber(imageId) && isNumber(itemId) ? await Image_Item.findOne({ where: { image_id: imageId, item_id: itemId } }) : null;
        if (image_item) {
            await image_item.destroy();
        }
        return image_item;
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

const getAll = async (): Promise<Array<Image_Item> | null> => {
    try {
        return await Image_Item.findAll();
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

const getById = async (id: unknown): Promise<Image_Item | null> => {
    try {
        return isNumber(Number(id)) ? await Image_Item.findByPk(Number(id)) : null;
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

const getByImageAndItemId = async (imageId: unknown, itemId: unknown): Promise<Image_Item | null> => {
    try {
        return isNumber(imageId) && isNumber(itemId) ? await Image_Item.findOne({ where: { image_id: imageId, item_id: itemId } }) : null;
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

export default {
    addNew,
    deleteById,
    deleteByImageAndItemId,
    getAll,
    getById,
    getByImageAndItemId,
};
