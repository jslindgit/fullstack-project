import React from 'react';

import { Config } from '../../types/configTypes';
import { ContentID } from '../../content';
import { ItemSizeAndInstock } from '../../types/types';

import { availableSizes } from '../../constants';
import { contentToText } from '../../types/languageFunctions';

interface Props {
    config: Config;
    oneSizeInstock: number;
    setOneSizeInstock: React.Dispatch<React.SetStateAction<number>>;
    setSizes: React.Dispatch<React.SetStateAction<ItemSizeAndInstock[]>>;
    sizes: ItemSizeAndInstock[];
}
const ItemSizes = ({ config, oneSizeInstock, setOneSizeInstock, setSizes, sizes }: Props) => {
    const unusedSizeValues = (): string[] => availableSizes.filter((sv) => !sizes.find((s) => s.size === sv));

    const handleAddSize = () => {
        if (unusedSizeValues().length > 0) {
            setSizes([...sizes, { size: unusedSizeValues()[0], instock: 0 }]);
        }
    };

    const handleDeleteSize = (index: number) => {
        const currentSizes = [...sizes];
        currentSizes.splice(index, 1);
        setSizes(currentSizes);
    };

    const handleInstockChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const currentSizes = [...sizes];
        currentSizes[index].instock = Number(event.target.value);
        setSizes(currentSizes);
    };

    const handleSizeChange = (index: number) => (event: React.ChangeEvent<HTMLSelectElement>) => {
        const currentSizes = [...sizes];
        currentSizes[index].size = event.target.value;
        setSizes(currentSizes);
    };

    return (
        <>
            <div className='infoBox'>
                <div className='grid-container left' data-cols='3' data-gap='1rem'>
                    <div className='semiBold'>{contentToText(ContentID.itemsSize, config)}</div>
                    <div className='semiBold'>{contentToText(ContentID.itemsInStock, config)}</div>
                    <div />
                    {sizes.length > 0 && sizes[0].size !== '-' ? (
                        sizes.map((size) => (
                            <React.Fragment key={sizes.indexOf(size)}>
                                <select value={size.size} onChange={handleSizeChange(sizes.indexOf(size))}>
                                    {availableSizes.map((s) => (
                                        <option key={s} value={s}>
                                            {s}
                                        </option>
                                    ))}
                                </select>
                                <input type='number' value={size.instock} onChange={handleInstockChange(sizes.indexOf(size))} />
                                <button type='button' className='red' onClick={() => handleDeleteSize(sizes.indexOf(size))}>
                                    {contentToText(ContentID.buttonRemove, config)}
                                </button>
                            </React.Fragment>
                        ))
                    ) : (
                        <React.Fragment>
                            <div>{contentToText(ContentID.adminItemOneSize, config)}</div>
                            <input
                                type='number'
                                value={oneSizeInstock}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => setOneSizeInstock(Number(event.target.value))}
                            />
                            <div />
                        </React.Fragment>
                    )}
                </div>
                <button type='button' onClick={handleAddSize} disabled={unusedSizeValues().length < 1} style={{ marginTop: '1rem' }}>
                    + {contentToText(ContentID.adminItemAddNewSize, config)}
                </button>
            </div>
        </>
    );
};

export default ItemSizes;
