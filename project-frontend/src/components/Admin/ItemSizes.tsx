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

    const handleAddAllSizes = () => {
        const newSizes: ItemSizeAndInstock[] = [];

        availableSizes.forEach((s) => {
            const existing = sizes.find((e) => e.size === s);
            newSizes.push({ size: s, instock: existing ? existing.instock : 0 });
        });

        setSizes([...newSizes]);
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

    const multipleSizes = (): boolean => {
        return sizes.length > 0 && sizes[0].size !== '-';
    };

    return (
        <>
            <div className='infoBox'>
                <div className='grid-container left middle' data-cols='3' data-gap='1rem'>
                    <div className='semiBold'>{contentToText(ContentID.itemsSize, config)}</div>
                    <div className='semiBold'>
                        {contentToText(ContentID.itemsInStock, config)} ({contentToText(ContentID.itemsPcs, config)})
                    </div>
                    <div />
                    <div className={'displayContents' + (multipleSizes() ? ' colorGraySemiLight strikeThrough' : '')}>
                        <div>{contentToText(ContentID.adminItemOneSize, config)}</div>
                        <input
                            type='number'
                            value={oneSizeInstock}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setOneSizeInstock(Number(event.target.value))}
                            disabled={multipleSizes()}
                        />
                        <div />
                    </div>
                    {sizes.map((size) => (
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
                    ))}
                </div>
                <button className='marginTop2' type='button' onClick={handleAddSize} disabled={unusedSizeValues().length < 1}>
                    + {contentToText(ContentID.adminItemAddNewSize, config)}
                </button>
                <button className='marginLeft1 marginTop2' type='button' onClick={handleAddAllSizes} disabled={unusedSizeValues().length < 1}>
                    + {contentToText(ContentID.adminItemAddAllSizes, config)}
                </button>
            </div>
        </>
    );
};

export default ItemSizes;
