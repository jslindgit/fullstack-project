import { Config } from '../../types/configTypes';
import { ContentID } from '../../content';
import { ItemSizeAndInstock } from '../../types/types';

import { contentToText } from '../../types/languageFunctions';

interface Props {
    config: Config;
    oneSizeInstock: number;
    setOneSizeInstock: React.Dispatch<React.SetStateAction<number>>;
    setSizes: React.Dispatch<React.SetStateAction<ItemSizeAndInstock[]>>;
    sizes: ItemSizeAndInstock[];
}
const ItemSizes = ({ config, oneSizeInstock, setOneSizeInstock, setSizes, sizes }: Props) => {
    const sizeValues = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

    const unusedSizeValues = (): string[] => sizeValues.filter((sv) => !sizes.find((s) => s.size === sv));

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
            <table className='infoBox'>
                <tbody>
                    <tr className='semiBold'>
                        <td className='widthByContent'>{contentToText(ContentID.itemsSize, config)}</td>
                        <td className='widthByContent'>{contentToText(ContentID.itemsInStock, config)}</td>
                    </tr>
                    {sizes.length > 0 && sizes[0].size !== '-' ? (
                        sizes.map((size) => (
                            <tr key={sizes.indexOf(size)}>
                                <td>
                                    <select value={size.size} onChange={handleSizeChange(sizes.indexOf(size))}>
                                        {sizeValues.map((s) => (
                                            <option key={s} value={s}>
                                                {s}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td>
                                    <input type='number' value={size.instock} onChange={handleInstockChange(sizes.indexOf(size))} />
                                </td>
                                <td>
                                    <button type='button' className='red' onClick={() => handleDeleteSize(sizes.indexOf(size))}>
                                        {contentToText(ContentID.buttonRemove, config)}
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td className='widthByContent'>{contentToText(ContentID.adminItemOneSize, config)}&emsp;</td>
                            <td>
                                <input
                                    type='number'
                                    value={oneSizeInstock}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => setOneSizeInstock(Number(event.target.value))}
                                />
                            </td>
                        </tr>
                    )}
                    <tr>
                        <td colSpan={2}>
                            <button type='button' onClick={handleAddSize} disabled={unusedSizeValues().length < 1}>
                                {contentToText(ContentID.adminItemAddNewSize, config)}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    );
};

export default ItemSizes;
