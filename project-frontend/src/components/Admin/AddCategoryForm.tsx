import { ChangeEventHandler } from 'react';
import { useDispatch } from 'react-redux';

import { User } from '../../types/types';

import useField from '../../hooks/useField';
import categoryService from '../../services/categoryService';
import { toNewCategory } from '../../types/type_functions';

import { addCategory } from '../../reducers/category_reducer';
import { setNotification } from '../../reducers/misc_reducer';

import ShowNotification from '../ShowNotification';

interface Props {
    user: User | null;
}

const AddCategoryForm = ({ user }: Props) => {
    const name = useField('text');
    const description = useField('text');

    const dispatch = useDispatch();

    if (!user || !user.admin) {
        return <>Error: Invalid User</>;
    }

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

        const newCategory = toNewCategory({ name: name.value, description: description.value });
        const res = await categoryService.add(newCategory, user.token);
        if (res.success && res.addedCategory) {
            dispatch(addCategory(res.addedCategory));
        }

        dispatch(setNotification({ tone: res.success ? 'Positive' : 'Negative', message: res.message }));

        name.reset();
        description.reset();
    };

    return (
        <>
            <h2>Add new category</h2>
            <ShowNotification fontSize={12} />
            <form onSubmit={submit}>
                <table>
                    <tbody>
                        {inputField('Name', name.type, name.value, name.onChange)}
                        {inputField('Description', description.type, description.value, description.onChange)}
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

export default AddCategoryForm;
