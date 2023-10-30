import { ChangeEventHandler, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../reducers/rootReducer';
import { Category, Item, NewItem, User } from '../../types/types';

import useField from '../../hooks/useField';
import itemService from '../../services/itemService';
import { toNewItem } from '../../types/typeFunctions';

import { setNotification } from '../../reducers/miscReducer';

import ShowNotification from '../ShowNotification';

interface Props {
    user: User;
    category: Category | undefined;
    items: Item[];
    setItems: React.Dispatch<React.SetStateAction<Item[]>>;
}

const AddItemForm = ({ user, category, items, setItems }: Props) => {
    const name = useField('text');
    const description = useField('text');
    const price = useField('decimal');
    const instock = useField('integer');
    const [selectedCategory, setSelectedCategory] = useState<string>(category ? category.id.toString() : '-1');

    const dispatch = useDispatch();

    const categoriesState = useSelector((state: RootState) => state.categories);
    const configState = useSelector((state: RootState) => state.config);

    useEffect(() => {
        setSelectedCategory(category ? category.id.toString() : '-1');
    }, [category]);

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(event.target.value);
    };

    const inputField = (label: string, type: string, value: string | number, onChange: ChangeEventHandler<HTMLInputElement>) => (
        <>
            <tr>
                <td className='widthByContent'>{label}:</td>
                <td>
                    <input type={type} value={value} onChange={onChange} />
                </td>
            </tr>
        </>
    );

    const submit = async (event: React.FormEvent) => {
        event.preventDefault();
        const newItem: NewItem = toNewItem({ name: name.value, description: description.value, price: price.value, instock: instock.value });
        const res = await itemService.add(newItem, selectedCategory && Number(selectedCategory) >= 0 ? Number(selectedCategory) : null, user.token, configState, dispatch);

        dispatch(setNotification({ tone: res.success ? 'Positive' : 'Negative', message: res.message }));

        if (res.success && res.item) {
            name.reset();
            description.reset();
            price.reset();
            instock.reset();

            setItems([...items, res.item]);
        }
    };

    return (
        <>
            <h3 className='underlined'>Add new item</h3>
            <ShowNotification fontSize='Small' />
            <form onSubmit={submit}>
                <table className='paddingTopBottomOnly' width='100%'>
                    <tbody>
                        {inputField('Name', name.type, name.value, name.onChange)}
                        {inputField('Description', description.type, description.value, description.onChange)}
                        {inputField('Price', price.type, price.value, price.onChange)}
                        {inputField('In stock', instock.type, instock.value, instock.onChange)}
                        <tr>
                            <td>Category:</td>
                            <td>
                                <select id='categorySelect' name='category' value={selectedCategory} onChange={handleCategoryChange}>
                                    {categoriesState.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                    <option value={-1}>UNCATEGORIZED</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>
                                <button type='submit'>Add</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </>
    );
};

export default AddItemForm;
