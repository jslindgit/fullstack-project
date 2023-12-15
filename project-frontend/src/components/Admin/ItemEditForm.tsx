import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Config } from '../../types/configTypes';
import { ContentID } from '../../content';
import { RootState } from '../../reducers/rootReducer';
import { Item, NewItem, Response } from '../../types/types';

import { pageWidth } from '../../constants';
import { handleError } from '../../util/handleError';
import imageService from '../../services/imageService';
import item_categoryService from '../../services/item_categoryService';
import itemService from '../../services/itemService';
import { contentToText, langTextsToText, useLangFields, useLangTextAreas } from '../../types/languageFunctions';
import localstorageHandler from '../../util/localstorageHandler';
import { imageFilename, imageSubdir } from '../../util/misc';
import useField, { UseField } from '../../hooks/useField';
import { UseTextArea } from '../../hooks/useTextArea';

import { setNotification } from '../../reducers/miscReducer';

import ItemEditImages from './ItemEditImages';

interface Props {
    config: Config;
    item: Item | null;
}
const ItemEditForm = ({ config, item }: Props) => {
    const dispatch = useDispatch();
    const categoriesState = useSelector((state: RootState) => state.categories);
    const usersState = useSelector((state: RootState) => state.user);

    const [categoriesChanged, setCategoriesChanged] = useState<boolean>(false);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);

    const navigate = useNavigate();

    const descriptionFields = useLangTextAreas();
    const instock = useField('integer', ContentID.itemsInStock);
    const nameFields = useLangFields('text');
    const price = useField('decimal', ContentID.itemsPrice);

    useEffect(() => {
        if (item) {
            setSelectedImages(item.images);
        }
    }, [item]);

    useEffect(() => {
        if (item) {
            nameFields.forEach((nf) => {
                const nameLangText = item.name.find((langText) => langText.langCode === nf.langCode);
                nf.field.setNewValue(nameLangText ? nameLangText.text : '');
            });
            descriptionFields.forEach((df) => {
                const descriptionLangText = item.description.find((langText) => langText.langCode === df.langCode);
                df.textArea.setNewValue(descriptionLangText ? descriptionLangText.text : '');
            });
            instock.setNewValue(item.instock.toString());
            price.setNewValue(item.price.toString());

            setSelectedCategories(
                item.categories.map((i) => {
                    return i.id;
                })
            );
        }
    }, [item]);

    const cancel = async () => {
        // If images were uploaded before canceling, remove those from the server:
        const promises: Promise<Response>[] = [];

        selectedImages.forEach((path) => {
            if (!(item && item.images.includes(path))) {
                if (usersState.loggedUser && usersState.loggedUser.admin) {
                    console.log('deleting path:', path);
                    const subdir = imageSubdir(path);
                    const filename = imageFilename(path);

                    promises.push(imageService.deleteImage(subdir, filename, usersState.loggedUser.token));
                }
            }
        });

        Promise.all(promises);

        navigate(localstorageHandler.getPreviousLocation());
    };

    const changesMade = () => {
        let result = false;

        if (item) {
            if (
                item.price.toString() !== price.value.toString() ||
                item.instock.toString() !== instock.value.toString() ||
                categoriesChanged ||
                selectedImages !== item.images
            ) {
                result = true;
            }
            nameFields.forEach((nf) => {
                if (nf.field.value !== item.name.find((langText) => langText.langCode === nf.langCode)?.text) {
                    result = true;
                }
            });
            descriptionFields.forEach((df) => {
                if (df.textArea.value !== item.description.find((langText) => langText.langCode === df.langCode)?.text) {
                    result = true;
                }
            });
        }

        return result;
    };

    const getInputField = (label: string, field: UseField, width: string = '100%') => (
        <tr key={label}>
            <td width='1px' className='adminEditLangCode' style={{ paddingLeft: '1rem', paddingRight: 0 }}>
                {label}
            </td>
            <td>
                <input type={field.type} value={field.value} onChange={field.onChange} style={{ width: width }} />
            </td>
        </tr>
    );

    const getTextArea = (label: string, textArea: UseTextArea) => (
        <tr key={label}>
            <td width='1px' className='adminEditLangCode' style={{ paddingLeft: '1rem', paddingRight: 0 }}>
                {label}
            </td>
            <td>
                <textarea value={textArea.value} onChange={textArea.onChange} style={{ width: '100%', height: '7rem' }} />
            </td>
        </tr>
    );

    const handleCategoryChange = (categoryId: number) => {
        setCategoriesChanged(true);

        const updatedCategories = [...selectedCategories];

        if (updatedCategories.includes(categoryId)) {
            const index = updatedCategories.indexOf(categoryId);
            updatedCategories.splice(index, 1);
        } else {
            updatedCategories.push(categoryId);
        }
        setSelectedCategories(updatedCategories);
    };

    const submit = async () => {
        if (usersState.loggedUser && usersState.loggedUser.admin && usersState.loggedUser.token) {
            const token = usersState.loggedUser.token;

            if (item && changesMade()) {
                const updatedItem: Item = {
                    ...item,
                    description: descriptionFields.map((df) => ({ langCode: df.langCode, text: df.textArea.value.toString() })),
                    instock: Number(instock.value),
                    images: selectedImages,
                    name: nameFields.map((nf) => ({ langCode: nf.langCode, text: nf.field.value.toString() })),
                    price: Number(price.value),
                };

                // Add connections between the edited Item and the selected Categories that are not yet connected to the Item:
                selectedCategories.forEach(async (selected) => {
                    const category = categoriesState.find((c) => {
                        return c.id === selected;
                    });
                    if (category && item.categories.includes(category) === false) {
                        const res = await item_categoryService.addConnection(item, category, token);
                        if (!res.success) {
                            handleError(new Error(res.message));
                        }
                    }
                });

                // Remove connections between the edited Item and Categories that are not selected and currently connected to the Item:
                const toRemove = item.categories.filter((c) => {
                    if (selectedCategories.includes(c.id) === false) {
                        return c;
                    }
                });
                toRemove.forEach(async (c) => {
                    const res = await item_categoryService.deleteConnection(item.id, c.id, token);
                    if (!res.success) {
                        handleError(new Error(res.message));
                    } else {
                        console.log(res);
                    }
                });

                // Update the other info (name, description, etc):
                const res = await itemService.update(updatedItem, usersState.loggedUser.token, config, dispatch);

                dispatch(setNotification({ tone: res.success ? 'Positive' : 'Negative', message: res.message }));
            } else {
                const newItem: NewItem = {
                    description: descriptionFields.map((df) => ({ langCode: df.langCode, text: df.textArea.value.toString() })),
                    instock: Number(instock.value),
                    images: selectedImages,
                    name: nameFields.map((nf) => ({ langCode: nf.langCode, text: nf.field.value.toString() })),
                    price: Number(price.value),
                };

                const res = await itemService.add(newItem, null, usersState.loggedUser.token, config, dispatch);

                dispatch(setNotification({ tone: res.success ? 'Positive' : 'Negative', message: res.message }));
            }

            setSelectedImages([]);
        } else {
            handleError(new Error('Missing token'));
        }
    };

    return (
        <>
            <table align='center' width={pageWidth} className='itemDetails'>
                <tbody>
                    <tr>
                        <td colSpan={3} className='colorGraySemiDark' style={{ paddingLeft: 0 }}>
                            {item
                                ? contentToText(ContentID.adminItemToEdit, config) + ': ' + langTextsToText(item.name, config)
                                : contentToText(ContentID.adminItemNewItem, config)}
                        </td>
                    </tr>
                    <tr>
                        <td style={{ padding: 0 }}>
                            <table width='100%'>
                                <tbody>
                                    <tr>
                                        <td colSpan={2} className='adminItemEditLabel'>
                                            {contentToText(ContentID.miscName, config)}:
                                        </td>
                                    </tr>
                                    {nameFields.map((nf) => getInputField(nf.langCode.toString(), nf.field))}
                                    <tr>
                                        <td colSpan={2} className='adminItemEditLabel'>
                                            {contentToText(ContentID.miscDescription, config)}:
                                        </td>
                                    </tr>
                                    {descriptionFields.map((nf) => getTextArea(nf.langCode.toString(), nf.textArea))}
                                    <tr>
                                        <td colSpan={2} className='adminItemEditLabel'>
                                            {contentToText(price.label, config)}:
                                        </td>
                                    </tr>
                                    {getInputField(config.currency, price, '33%')}
                                    <tr>
                                        <td colSpan={2} className='adminItemEditLabel'>
                                            {contentToText(instock.label, config)}:
                                        </td>
                                    </tr>
                                    {getInputField(contentToText(ContentID.itemsPcs, config), instock, '33%')}
                                    <tr>
                                        <td colSpan={2} width='1px'>
                                            <button type='button' onClick={submit} disabled={!changesMade()}>
                                                {contentToText(ContentID.buttonSave, config)}
                                            </button>
                                            &emsp;
                                            <button type='button' onClick={cancel}>
                                                {contentToText(ContentID.buttonCancel, config)}
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                        <td width='10%'></td>
                        <td width='40%' className='valignTop' style={{ maxWidth: '40%', padding: 0 }}>
                            <table width='100%'>
                                <tbody>
                                    <tr>
                                        <td className='adminItemEditLabel'>{contentToText(ContentID.adminPanelCategories, config)}:</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            {categoriesState.map((c) => (
                                                <button
                                                    key={c.id}
                                                    type='button'
                                                    className={'selectButton ' + (selectedCategories.includes(c.id) ? 'selectButtonTrue' : 'selectButtonFalse')}
                                                    onClick={() => handleCategoryChange(c.id)}
                                                >
                                                    {langTextsToText(c.name, config)}
                                                </button>
                                            ))}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='adminItemEditLabel'>{contentToText(ContentID.adminPanelImages, config)}:</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <ItemEditImages selectedImages={selectedImages} setSelectedImages={setSelectedImages} config={config} />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    );
};

export default ItemEditForm;
