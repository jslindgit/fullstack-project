import React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ContentID } from '../../content';
import { Category, Item, NewItem, User } from '../../types/types';
import { UseField } from '../../hooks/useField';
import { UseTextArea } from '../../hooks/useTextArea';
import { RootState } from '../../reducers/rootReducer';

import { contentToText, langTextsToText, useLangFields, useLangTextAreas } from '../../types/languageFunctions';
import itemService from '../../services/itemService';
import useField from '../../hooks/useField';

import { setNotification } from '../../reducers/miscReducer';

interface Props {
    user: User | null;
    category: Category | undefined;
    items: Item[];
    setItems: React.Dispatch<React.SetStateAction<Item[]>>;
}

const AddItemForm = ({ user, category, items, setItems }: Props) => {
    const dispatch = useDispatch();
    const categoriesState = useSelector((state: RootState) => state.categories);
    const config = useSelector((state: RootState) => state.config);

    const [selectedCategory, setSelectedCategory] = useState<string>(category ? category.id.toString() : '-1');

    const descriptionFields = useLangTextAreas();
    const instock = useField('integer');
    const nameFields = useLangFields('text');
    const price = useField('decimal');

    useEffect(() => {
        setSelectedCategory(category ? category.id.toString() : '-1');
    }, [category]);

    if (!user || !user.admin) {
        return <>Error: Invalid User</>;
    }

    const getInputField = (label: string, field: UseField, placeHolder: string = '') => (
        <React.Fragment key={label}>
            <tr key={label}>
                <td width='1px' className='adminEditLangCode' style={{ paddingRight: 0 }}>
                    {label}
                </td>
                <td>
                    <input type={field.type} value={field.value} onChange={field.onChange} placeholder={placeHolder} style={{ width: '100%' }} />
                </td>
            </tr>
        </React.Fragment>
    );

    const getTextArea = (label: string, textArea: UseTextArea, placeHolder: string) => (
        <tr key={label}>
            <td width='1px' className='adminEditLangCode' style={{ paddingRight: 0 }}>
                {label}
            </td>
            <td>
                <textarea value={textArea.value} onChange={textArea.onChange} placeholder={placeHolder} style={{ width: '100%', height: '5rem' }} />
            </td>
        </tr>
    );

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(event.target.value);
    };

    const submit = async () => {
        const newItem: NewItem = {
            description: descriptionFields.map((df) => ({ langCode: df.langCode, text: df.textArea.value.toString() })),
            images: [],
            instock: Number(instock.value),
            name: nameFields.map((nf) => ({ langCode: nf.langCode, text: nf.field.value.toString() })),
            price: Number(price.value),
        };

        const res = await itemService.add(
            newItem,
            selectedCategory && Number(selectedCategory) >= 0 ? Number(selectedCategory) : null,
            user.token,
            config,
            dispatch
        );

        dispatch(setNotification({ tone: res.success ? 'Positive' : 'Negative', message: res.message }));

        if (res.success && res.item) {
            nameFields.forEach((nf) => nf.field.reset());
            descriptionFields.forEach((df) => df.textArea.reset());
            instock.reset();
            price.reset();

            setItems([...items, res.item]);
        }
    };

    return (
        <>
            <div className='pageHeader'>{contentToText(ContentID.adminAddNewItem, config)}</div>
            <table width='100%'>
                <tbody>
                    <tr>
                        <td className='adminEditSubHeader' style={{ paddingTop: 0 }}>
                            {contentToText(ContentID.miscName, config)}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table width='100%'>
                                <tbody>
                                    {nameFields.map((nf) =>
                                        getInputField(nf.langCode, nf.field, `${contentToText(ContentID.miscName, config)} (${nf.langCode})`)
                                    )}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td className='adminEditSubHeader'>{contentToText(ContentID.miscDescription, config)}</td>
                    </tr>
                    <tr>
                        <td>
                            <table width='100%'>
                                <tbody>
                                    {descriptionFields.map((df) =>
                                        getTextArea(df.langCode, df.textArea, `${contentToText(ContentID.miscDescription, config)} (${df.langCode})`)
                                    )}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td className='adminEditSubHeader' style={{ paddingTop: 0 }}>
                            {contentToText(ContentID.itemsPrice, config)}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table width='100%'>
                                <tbody>{getInputField(config.currency, price)}</tbody>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td className='adminEditSubHeader' style={{ paddingTop: 0 }}>
                            {contentToText(ContentID.itemsInStock, config)}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <table width='100%'>
                                <tbody>{getInputField('Kpl', instock)}</tbody>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td className='adminEditSubHeader'>{contentToText(ContentID.itemsCategory, config)}</td>
                    </tr>
                    <tr>
                        <td>
                            <select id='categorySelect' name='category' value={selectedCategory} onChange={handleCategoryChange}>
                                {categoriesState.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {langTextsToText(c.name, config)}
                                    </option>
                                ))}
                                <option value={-1}>UNCATEGORIZED</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <button type='button' onClick={submit}>
                                {contentToText(ContentID.buttonAdd, config)}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    );
};

export default AddItemForm;
