import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { ContentID } from '../../content';
import { Category } from '../../types/types';
import { RootState } from '../../reducers/rootReducer';
import { UseField } from '../../hooks/useField';
import { UseTextArea } from '../../hooks/useTextArea';

import { setNotification } from '../../reducers/miscReducer';

import categoryService from '../../services/categoryService';
import { contentToText, langTextsToText } from '../../types/languageFunctions';
import { handleError } from '../../util/handleError';
import { pageWidth } from '../../constants';
import { useLangFields, useLangTextAreas } from '../../types/languageFunctions';

import BackButton from '../BackButton';

const AdminCategoryEdit = () => {
    const dispatch = useDispatch();
    const config = useSelector((state: RootState) => state.config);
    const usersState = useSelector((state: RootState) => state.users);

    const [category, setCategory] = useState<Category | undefined>();
    const [loading, setLoading] = useState<string>('Loading...');

    const nameFields = useLangFields('text');
    const descriptionFields = useLangTextAreas();

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
            nameFields.forEach((nf) => {
                const nameLangText = category.name.find((langText) => langText.langCode === nf.langCode);
                nf.field.setNewValue(nameLangText ? nameLangText.text : '');
            });
            descriptionFields.forEach((df) => {
                const descriptionLangText = category.description.find((langText) => langText.langCode === df.langCode);
                df.textArea.setNewValue(descriptionLangText ? descriptionLangText.text : '');
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category]);

    const changesMade = (): boolean => {
        let result = false;

        if (category) {
            nameFields.forEach((nf) => {
                if (nf.field.value !== category.name.find((langText) => langText.langCode === nf.langCode)?.text) {
                    result = true;
                }
            });
            descriptionFields.forEach((df) => {
                if (df.textArea.value !== category.description.find((langText) => langText.langCode === df.langCode)?.text) {
                    return true;
                }
            });
        }

        return result;
    };

    const getInputField = (label: string, field: UseField) => (
        <tr key={label}>
            <td width='1px' className='semiBold' style={{ paddingLeft: '2.5rem', paddingRight: 0 }}>
                {label}
            </td>
            <td>
                <input type={field.type} value={field.value} onChange={field.onChange} />
            </td>
        </tr>
    );

    const getTextArea = (label: string, textArea: UseTextArea) => (
        <tr key={label}>
            <td width='1px' className='semiBold' style={{ paddingLeft: '2.5rem', paddingRight: 0 }}>
                {label}
            </td>
            <td>
                <textarea value={textArea.value} onChange={textArea.onChange} style={{ width: '100%', height: '10rem' }} />
            </td>
        </tr>
    );

    /*const inputField = (input: UseField) => {
        return (
            <>
                <input type={input.type} value={input.value} onChange={input.onChange} style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box' }} />
            </>
        );
    };*/

    const submit = async () => {
        if (category && changesMade()) {
            if (usersState.loggedUser && usersState.loggedUser.admin && usersState.loggedUser.token) {
                const updatedCategory: Category = {
                    ...category,
                    name: nameFields.map((nf) => ({ langCode: nf.langCode, text: nf.field.value.toString() })),
                    description: descriptionFields.map((df) => ({ langCode: df.langCode, text: df.textArea.value.toString() })),
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
            <table align='center' width={pageWidth}>
                <tbody>
                    <tr>
                        <td className='pageHeader'>{contentToText(ContentID.adminEditCategory, config)}</td>
                    </tr>
                </tbody>
            </table>
            <table align='center' width={pageWidth} className='itemDetails'>
                <tbody>
                    <tr>
                        <td className='alignCenter colorGray sizeLarge'>{langTextsToText(category.name, config)}</td>
                    </tr>
                    <tr>
                        <td className='noPaddingTd'>
                            <table width='100%'>
                                <tbody>
                                    <tr>
                                        <td colSpan={2} className='sizeLarge bold' style={{ paddingTop: 0 }}>
                                            {contentToText(ContentID.miscName, config)}
                                        </td>
                                    </tr>
                                    {nameFields.map((nf) => getInputField(nf.langCode.toString(), nf.field))}
                                    <tr>
                                        <td colSpan={2} className='sizeLarge bold'>
                                            {contentToText(ContentID.miscDescription, config)}
                                        </td>
                                    </tr>
                                    {descriptionFields.map((nf) => getTextArea(nf.langCode.toString(), nf.textArea))}
                                    <tr>
                                        <td colSpan={2}>
                                            <button type='button' onClick={submit} disabled={!changesMade()}>
                                                {contentToText(ContentID.buttonSave, config)}
                                            </button>
                                            &emsp;
                                            <BackButton type='button' />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table align='center' width={pageWidth} className='itemDetails valignTop'>
                <tbody>
                    <tr>
                        <td>
                            <table width='100%'>
                                <tbody>
                                    <tr>
                                        <td className='adminItemEditLabel'>ITEMS:</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            {category.items.map((item) => (
                                                <div key={item.id}>{langTextsToText(item.name, config)}</div>
                                            ))}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default AdminCategoryEdit;
