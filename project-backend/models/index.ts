import Category from './category';
import Item from './item';
import { Item_Category } from './item_category';
import Order, { associate as associateOrder } from './order';
import User, { associate as associateUser } from './user';

Item.belongsToMany(Category, { through: Item_Category });
Category.belongsToMany(Item, { through: Item_Category });

associateUser();
associateOrder();

export { Category, Item, Item_Category, Order, User };
