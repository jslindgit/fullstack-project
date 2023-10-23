import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Category } from '../../types/types';
import { RootState } from '../../reducers/rootReducer';
import { UseField } from '../../hooks/useField';

import { setNotification } from '../../reducers/miscReducer';

import categoryService from '../../services/categoryService';
import { handleError } from '../../util/handleError';
import { pageWidth } from '../../constants';
import useField from '../../hooks/useField';
import useTextArea from '../../hooks/useTextArea';

import BackButton from '../BackButton';

const AdminCategoryEdit = () => {
    const dispatch = useDispatch();
    const usersState = useSelector((state: RootState) => state.users);

    const [category, setCategory] = useState<Category | undefined>();
    const [loading, setLoading] = useState<string>('Loading...');

    const name = useField('text');
    const description = useTextArea();

    const id = Number(useParams().id);

    const setCategoryById = () => {
        try {
            categoryService.getById(id).then((res) => {
                setCategory(res as Category);
            });
        } catch (err: unknown) {
            handleError(err);
            setLoading('Something went wrong :(');
        }
    };

    useEffect(() => {
        setCategoryById();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {
        if (category) {
            name.setNewValue(category.name);
            description.setNewValue(category.description);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category]);

    const changesMade = () => {
        return category && (category.name !== name.value || category.description !== description.value);
    };

    const inputField = (input: UseField) => {
        return (
            <>
                <input type={input.type} value={input.value} onChange={input.onChange} style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} />
            </>
        );
    };

    const submit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (category && changesMade()) {
            if (usersState.loggedUser && usersState.loggedUser.admin && usersState.loggedUser.token) {
                const updatedCategory: Category = {
                    ...category,
                    name: name.value.toString(),
                    description: description.value.toString(),
                };

                const res = await categoryService.update(updatedCategory, usersState.loggedUser.token, dispatch);

                dispatch(setNotification({ tone: res.success ? 'Positive' : 'Negative', message: res.message }));

                setCategoryById();
            } else {
                handleError(new Error('Missing token'));
            }
        }
    };

    if (!usersState.loggedUser?.admin) {
        return (
            <div>
                <br />
                Error: 403
            </div>
        );
    }

    if (!category) {
        return (
            <>
                <br />
                <h4>{loading}</h4>
            </>
        );
    }

    return (
        <div>
            <form onSubmit={submit} className='adminFormItemEdit'>
                <table align='center' width={pageWidth}>
                    <tbody>
                        <tr>
                            <td className='adminHeader tight underlined'>
                                <h3>Admin Panel - Edit Category</h3>
                            </td>
                        </tr>
                        <tr style={{ padding: 0, height: '1rem' }}>
                            <td style={{ padding: 0 }}></td>
                        </tr>
                    </tbody>
                </table>
                <table align='center' width={pageWidth} className='itemDetails valignTop'>
                    <tbody>
                        <tr>
                            <td>
                                <table width='100%' className='padding150'>
                                    <tbody>
                                        <tr>
                                            <td className='adminItemEditLabel'>NAME:</td>
                                        </tr>
                                        <tr>
                                            <td>{inputField(name)}</td>
                                        </tr>
                                        <tr>
                                            <td className='adminItemEditLabel'>DESCRIPTION:</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <textarea value={description.value} onChange={description.onChange} style={{ width: '100%', height: '10rem' }}></textarea>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td width='1px'>
                                                <button type='submit' disabled={!changesMade()}>
                                                    Save
                                                </button>
                                                &emsp;
                                                <BackButton type='button' />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                            <td width='10%'></td>
                            <td width='40%' style={{ maxWidth: '40%' }}>
                                <table width='100%' className='padding150'>
                                    <tbody>
                                        <tr>
                                            <td className='adminItemEditLabel'>ITEMS:</td>
                                        </tr>
                                        <tr>
                                            <td>
                                                {category.items.map((item) => (
                                                    <div key={item.id}>{item.name}</div>
                                                ))}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    );
};

export default AdminCategoryEdit;
