"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const category_1 = __importDefault(require("../models/category"));
const item_1 = __importDefault(require("../models/item"));
const error_handler_1 = require("../util/error_handler");
const type_functions_1 = require("../types/type_functions");
const item_categoryService_1 = __importDefault(require("./item_categoryService"));
const addNew = async (newCategory) => {
    try {
        const category = await category_1.default.create(newCategory);
        await category.save();
        return category;
    }
    catch (err) {
        (0, error_handler_1.handleError)(err);
        return null;
    }
};
const deleteById = async (id) => {
    try {
        const category = await getById(id);
        if (category) {
            // First delete the connection tables involving this Category:
            await item_categoryService_1.default.deleteByCategoryId(category.id);
            await category.destroy();
        }
        return category;
    }
    catch (err) {
        (0, error_handler_1.handleError)(err);
        return null;
    }
};
const getAll = async (searchQuery = '') => {
    try {
        let where = {};
        if (searchQuery && searchQuery.length > 0) {
            where = {
                [sequelize_1.Op.or]: [
                    {
                        name: {
                            [sequelize_1.Op.iLike]: `%${searchQuery}%`,
                        },
                    },
                ],
            };
        }
        const categories = await category_1.default.findAll({
            include: [
                {
                    model: item_1.default,
                    through: { attributes: [] },
                    attributes: ['id', 'addedBy', 'description', 'fitsInLetter', 'images', 'instock', 'name', 'price', 'sizes', 'sold'],
                    include: [
                        {
                            model: category_1.default,
                            through: { attributes: [] },
                        },
                    ],
                },
            ],
            where,
            order: [
                ['name', 'ASC'],
                [item_1.default, 'name', 'ASC'],
            ],
        });
        return categories;
    }
    catch (err) {
        (0, error_handler_1.handleError)(err);
        return null;
    }
};
// prettier-ignore
const getById = async (id) => {
    try {
        const category = (0, type_functions_1.isNumber)(Number(id))
            ? await category_1.default.findByPk(Number(id), {
                include: [
                    {
                        model: item_1.default,
                        through: { attributes: [] },
                        attributes: ['id', 'addedBy', 'description', 'fitsInLetter', 'images', 'instock', 'name', 'price', 'sizes', 'sold'],
                        include: [
                            {
                                model: category_1.default,
                                through: { attributes: [] },
                            },
                        ],
                    },
                ],
            })
            : null;
        return category;
    }
    catch (err) {
        (0, error_handler_1.handleError)(err);
        return null;
    }
};
const update = async (id, props) => {
    try {
        const category = await getById(id);
        if (category) {
            if ((0, type_functions_1.isObject)(props)) {
                Object.keys(props).forEach((key) => {
                    if (key in category && key !== 'id') {
                        category.setDataValue(key, props[key]);
                    }
                    else {
                        throw new Error(`Invalid property '${key}' for Category`);
                    }
                });
                await category.save();
            }
            else {
                throw new Error('Invalid props value (not an object)');
            }
        }
        return category;
    }
    catch (err) {
        (0, error_handler_1.handleError)(err);
        return null;
    }
};
exports.default = {
    addNew,
    deleteById,
    getAll,
    getById,
    update,
};
