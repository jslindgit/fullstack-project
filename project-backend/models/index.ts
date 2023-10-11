import { Category } from './category';
import { Image } from './image';
import { Image_Item } from './image_item';
import { Item } from './item';
import { Item_Category } from './item_category';
import { User } from './user';

Item.belongsToMany(Category, { through: Item_Category });
Category.belongsToMany(Item, { through: Item_Category });

Image.belongsToMany(Item, { through: Image_Item });
Item.belongsToMany(Image, { through: Image_Item });

export { Category, Image, Image_Item, Item, Item_Category, User };
