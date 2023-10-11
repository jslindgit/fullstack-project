import { useSelector } from 'react-redux';

import { Item } from '../../types/types';
import { ItemInputs } from './AdminItems';
import { RootState } from '../../reducers/rootReducer';
import { UseField } from '../../hooks/useField';

import format from '../../util/format';

interface Props {
    item: Item;
    isEdited: boolean;
    inputs: ItemInputs;
    deleteItem: (item: Item) => void;
    editItem: (item: Item) => void;
    editItemCancel: () => void;
    setSelectedCategories: React.Dispatch<React.SetStateAction<number[]>>;
    setCategoriesChanged: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminItem = ({ item, isEdited, inputs, deleteItem, editItem, editItemCancel, setSelectedCategories, setCategoriesChanged }: Props) => {
    const categoriesState = useSelector((state: RootState) => state.categories);
    const configState = useSelector((state: RootState) => state.config);

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCategoriesChanged(true);

        const options = event.target.options;
        const selected: number[] = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selected.push(Number(options[i].value));
            }
        }
        setSelectedCategories(selected);
    };

    const inputField = (input: UseField) => {
        return (
            <>
                <input type={input.type} value={input.value} onChange={input.onChange} style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} />
            </>
        );
    };

    if (isEdited) {
        return (
            <tr>
                <td>{inputField(inputs.name)}</td>
                <td>
                    <textarea value={inputs.description.value} onChange={inputs.description.onChange} style={{ width: '100%', height: '10rem' }}></textarea>
                </td>
                <td>{inputField(inputs.price)}</td>
                <td>{inputField(inputs.instock)}</td>
                <td>{item.id}</td>
                <td>
                    <select multiple onChange={handleCategoryChange}>
                        {categoriesState.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </td>
                <td style={{ paddingRight: '0.75rem' }}>TODO</td>
                <td>
                    <button type='submit' className='compactButton'>
                        Save
                    </button>
                </td>
                <td>
                    <button type='button' className='compactButton' onClick={editItemCancel}>
                        Cancel
                    </button>
                </td>
            </tr>
        );
    } else {
        const descriptionMaxLengthToShow = 300;
        return (
            <tr>
                <td>{item.name}</td>
                <td>{item.description.length > descriptionMaxLengthToShow ? item.description.substring(0, descriptionMaxLengthToShow - 1) + '...' : item.description}</td>
                <td className='noWrap'>{format.currency(item.price, configState)}</td>
                <td className='noWrap'>{item.instock} pcs</td>
                <td>{item.id}</td>
                <td>{item.categories ? item.categories.length.toString() : 0}</td>
                <td style={{ paddingRight: '0.75rem' }}>TODO</td>
                <td style={{ paddingRight: 0 }}>
                    <button type='button' className='compactButton' onClick={() => editItem(item)}>
                        Edit
                    </button>
                </td>
                <td>
                    <button type='button' className='red compactButton' onClick={() => deleteItem(item)}>
                        Delete
                    </button>
                </td>
            </tr>
        );
    }
};

export default AdminItem;
