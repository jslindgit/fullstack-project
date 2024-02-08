"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item_Category = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../util/db");
class Item_Category extends sequelize_1.Model {
}
exports.Item_Category = Item_Category;
Item_Category.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    itemId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'items', key: 'id' },
    },
    categoryId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'categories', key: 'id' },
    },
}, {
    sequelize: db_1.sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'item_category',
});
