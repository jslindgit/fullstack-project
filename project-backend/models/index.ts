import { Category } from './category';
import { Item } from './item';
import { User } from './user';

// Connections:
import { Item_Category } from './item_category';

Item.belongsToMany(Category, { through: Item_Category });
Category.belongsToMany(Item, { through: Item_Category });

module.exports = {
    Category,
    Item,
    Item_Category,
    User,
};
