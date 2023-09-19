import { Category } from './category';
import { Item } from './item';
import { Item_Category } from './item_category';
import { User } from './user';

Item.belongsToMany(Category, { through: Item_Category });
Category.belongsToMany(Item, { through: Item_Category });

export { Category, Item, Item_Category, User };
