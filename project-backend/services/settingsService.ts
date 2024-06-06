import Settings, { SettingsAttributes, SettingsInstance, NewSettings } from '../models/settings';

import { handleError } from '../util/error_handler';
import { isNumber, isObject } from '../types/type_functions';

const addNew = async (newSettings: NewSettings): Promise<SettingsInstance | null> => {
    try {
        const settings = await Settings.create(newSettings);
        await settings.save();
        return settings;
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

const deleteById = async (id: unknown): Promise<SettingsInstance | null> => {
    try {
        const settings = await getById(id);
        if (settings) {
            await settings.destroy();
        }
        return settings;
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

const getAll = async (): Promise<SettingsInstance[]> => {
    try {
        return await Settings.findAll();
    } catch (err: unknown) {
        handleError(err);
        return [];
    }
};

// prettier-ignore
const getById = async (id: unknown): Promise<SettingsInstance | null> => {
    try {
        const settings = isNumber(Number(id))
            ? await Settings.findByPk(Number(id))
            : null;
        return settings;
    } catch (err: unknown) {
        handleError(err);
        return null;
    }
};

const update = async (id: unknown, props: unknown): Promise<SettingsInstance | null> => {
    try {
        const settings = await getById(id);
        if (settings) {
            if (isObject(props)) {
                Object.keys(props).forEach((key) => {
                    if (key in settings && key !== 'id') {
                        settings.setDataValue(key as keyof SettingsAttributes, props[key as keyof typeof props]);
                    } else {
                        throw new Error(`Invalid property '${key}' for Settings`);
                    }
                });

                await settings.save();
            } else {
                throw new Error('Invalid props value (not an object)');
            }
        }
        return settings;
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
