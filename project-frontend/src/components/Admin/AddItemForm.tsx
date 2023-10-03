import { ChangeEventHandler, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../reducers/rootReducer';
import { NewItem, User } from '../../types/types';

import useField from '../../hooks/useField';
import itemService from '../../services/itemService';
import { toNewItem } from '../../types/type_functions';

import { setNotification } from '../../reducers/miscReducer';

import ShowNotification from '../ShowNotification';

interface Props {
    user: User;
    selected_category_id: number;
}

const AddItemForm = ({ user, selected_category_id }: Props) => {
    const name = useField('text');
    const description = useField('text');
    const price = useField('number');
    const instock = useField('number');
    const [selectedCategory, setSelectedCategory] = useState<string>(selected_category_id.toString());

    const dispatch = useDispatch();

    const categoriesState = useSelector((state: RootState) => state.categories);
    const configState = useSelector((state: RootState) => state.config);

    useEffect(() => {
        setSelectedCategory(selected_category_id.toString());
    }, [selected_category_id]);

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(event.target.value);
    };

    const inputField = (label: string, type: string, value: string | number, onChange: ChangeEventHandler<HTMLInputElement>) => (
        <>
            <tr>
                <td width='10'>{label}:</td>
                <td>
                    <input type={type} value={value} onChange={onChange} />
                </td>
            </tr>
        </>
    );

    const submit = async (event: React.FormEvent) => {
        event.preventDefault();
        const newItem: NewItem = toNewItem({ name: name.value, description: description.value, price: price.value, instock: instock.value });
        const res = await itemService.add(newItem, Number(selectedCategory), user.token, configState, dispatch);

        dispatch(setNotification({ tone: res.success ? 'Positive' : 'Negative', message: res.message }));

        name.reset();
        description.reset();
        price.reset();
        instock.reset();
    };

    return (
        <>
            <h2>Add item</h2>
            <ShowNotification fontSize={14} />
            <form onSubmit={submit}>
                <table>
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
