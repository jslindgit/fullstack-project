import Category from './category';
import Item from './item';
import { Item_Category } from './item_category';
import Order from './order';
import User from './user';

Item.belongsToMany(Category, { through: Item_Category });
Category.belongsToMany(Item, { through: Item_Category });

User.hasMany(Order);
Order.belongsTo(User);

export { Category, Item, Item_Category, Order, User };
