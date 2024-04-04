import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { ContentID } from '../../content';
import { ShoppingItem } from '../../types/orderTypes';
import { RootState } from '../../reducers/rootReducer';

import { itemsTotalSum } from '../../util/checkoutProvider';
import format from '../../util/format';
import { contentToText } from '../../types/languageFunctions';

import ShoppingCartRow from './ShoppinCartRow';

interface Props {
    allowEdit: boolean;
    removeItem: ((shoppingItem: number) => void) | null;
    shoppingItems: ShoppingItem[];
    totalSumContentID?: ContentID;
}

const ShoppingCartContent = ({ allowEdit, shoppingItems, removeItem, totalSumContentID = ContentID.cartSubtotal }: Props) => {
    const config = useSelector((state: RootState) => state.config);

    const [viewportWidth, setViewportWidth] = useState<number>(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setViewportWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const narrowView = () => {
        return viewportWidth < 700;
    };

    if (shoppingItems.length <= 0) {
        return (
            <div className='alignLeft sizeLarge'>
                <br />
                {contentToText(ContentID.cartIsEmpty, config)}
                <br />
                <br />
            </div>
        );
    }

    return (
        <div>
            <div className='grid-container left middle padded1rem striped' data-cols={narrowView() ? '1' : 'shoppingcart-row'}>
                {narrowView() === false ? (
                    <React.Fragment>
                        <div className='gridStripedHeaderRow gridSpan2'>{contentToText(ContentID.cartProduct, config)}</div>
                        <div className='gridStripedHeaderRow'>{contentToText(ContentID.cartUnitPrice, config)}</div>
                        <div className='gridStripedHeaderRow'>{contentToText(ContentID.cartQuantity, config)}</div>
                        <div className='gridStripedHeaderRow gridSpan2'>{contentToText(ContentID.cartTotalPrice, config)}</div>
                    </React.Fragment>
                ) : (
                    <div className='marginTop-2' />
                )}
                {shoppingItems.map((shoppingItem) => (
                    <ShoppingCartRow
                        key={shoppingItem.id + shoppingItem.size}
                        allowEdit={allowEdit}
                        indexOf={shoppingItems.indexOf(shoppingItem)}
                        narrowView={narrowView()}
                        removeItem={removeItem}
                        shoppingItem={shoppingItem}
                    />
                ))}
                {narrowView() === false && (
                    <React.Fragment>
                        <div className='gridSpan3' />
                        <div className='semiBold'>{contentToText(totalSumContentID, config)}:</div>
                        <div className='bold gridSpan2'>{format.currency(itemsTotalSum(shoppingItems.map((shoppingItem) => shoppingItem)), config)}</div>
                    </React.Fragment>
                )}
            </div>
            {narrowView() && (
                <div className='alignRight padding1 semiBold sizeLarge'>
                    {contentToText(totalSumContentID, config)}:&ensp;
                    <span className='bold'> {format.currency(itemsTotalSum(shoppingItems.map((shoppingItem) => shoppingItem)), config)}</span>
                </div>
            )}
        </div>
    );
};

export default ShoppingCartContent;
