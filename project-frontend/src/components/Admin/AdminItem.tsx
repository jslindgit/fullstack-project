import { useSelector } from 'react-redux';

import { Item } from '../../types/types';
import { ItemInputs } from './AdminItems';
import { RootState } from '../../reducers/rootReducer';
import { UseField } from '../../hooks/useField';

import format from '../../util/format';
import { isString } from '../../types/type_functions';

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
        const width = input.value.toString().length * (isString(input.value) ? 9 : 18);
        return (
            <>
                <input type={input.type} value={input.value} onChange={input.onChange} style={{ width }} />
            </>
        );
    };

    if (isEdited) {
        return (
            <tr>
                <td>{inputField(inputs.name)}</td>
                <td>{inputField(inputs.description)}</td>
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
                <td>
                    <button type='submit'>Save</button>
                </td>
                <td>
                    <button type='button' onClick={editItemCancel}>
                        Cancel
                    </button>
                </td>
            </tr>
        );
    } else {
        return (
            <tr>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{format.currency(item.price, configState)}</td>
                <td>{item.instock}</td>
                <td>{item.id}</td>
                <td>{item.categories ? item.categories.length : 0}</td>
                <td>
                    <button type='button' onClick={() => editItem(item)}>
                        Edit
                    </button>
                </td>
                <td>
                    <button type='button' className='red' onClick={() => deleteItem(item)}>
                        Delete
                    </button>
                </td>
            </tr>
        );
    }
};

export default AdminItem;
