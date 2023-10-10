import { Category } from './category';
import { Image } from './image';
import { Item } from './item';
import { Item_Category } from './item_category';
import { User } from './user';

Item.belongsToMany(Category, { through: Item_Category });
Category.belongsToMany(Item, { through: Item_Category });

export { Category, Image, Item, Item_Category, User };
