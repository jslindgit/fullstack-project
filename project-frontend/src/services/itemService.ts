import { Order } from '../types/orderTypes';
import { ItemSizeAndInstock } from '../types/types';

import { handleError } from '../util/handleError';

import { itemGetById, itemUpdateInstockAndSold } from '../redux/slices/itemSlice';
import store, { StoreDispatch } from '../redux/store';

export const updateInstockAndSoldValues = async (order: Order, storeDispatch: StoreDispatch) => {
    try {
        order.items.forEach(async (shoppingItem) => {
            const item = await store.dispatch(itemGetById.initiate(shoppingItem.id)).unwrap();

            if (item) {
                const currentSizes = [...item.sizes];
                const size = currentSizes.find((s) => s.size === (shoppingItem.size.length > 0 ? shoppingItem.size : '-'));
                const finalSizes: ItemSizeAndInstock[] = size
                    ? [...currentSizes.filter((s) => s.size !== size.size), { size: size.size, instock: size.instock - shoppingItem.quantity }]
                    : currentSizes;

                const instockAndSold = {
                    sizes: finalSizes.map((sizeAndInstock) => JSON.stringify(sizeAndInstock)),
                    sold: item.sold + shoppingItem.quantity,
                };

                await storeDispatch(itemUpdateInstockAndSold.initiate({ itemId: item.id, instockAndSold: instockAndSold }));
            } else {
                handleError(`Item with id ${shoppingItem.id} not found.`);
            }
        });
    } catch (err: unknown) {
        handleError(err);
    }
};
