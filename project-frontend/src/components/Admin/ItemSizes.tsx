import { ItemSizeAndInstock } from '../../types/types';

interface Props {
    setSizes: React.Dispatch<React.SetStateAction<ItemSizeAndInstock[]>>;
    sizes: ItemSizeAndInstock[];
}
const ItemSizes = ({ setSizes, sizes }: Props) => {
    const sizeValues = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

    const handleAddSize = () => {
        if (sizes.length < sizeValues.length) {
            setSizes([...sizes, { size: sizeValues.filter((sv) => !sizes.find((s) => s.size === sv))[0], instock: 0 }]);
        }
    };

    return (
        <>
            <table>
                <tbody>
                    <tr>
                        <td className='widthByContent'>Size</td>
                        <td className='widthByContent'>In stock</td>
                    </tr>
                    {sizes.map((size) => (
                        <tr key={size.size}>
                            <td>
                                <select value={size.size}>
                                    {sizeValues.map((s) => (
                                        <option key={s} value={s}>
                                            {s}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td>
                                <input type='number' value={size.instock} />
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan={2}>
                            <button type='button' onClick={handleAddSize}>
                                Add size
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    );
};

export default ItemSizes;
