import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Config } from '../../types/configTypes';
import { ContentID } from '../../content';
import { RootState } from '../../reducers/rootReducer';
import { Item, NewItem, Response } from '../../types/types';

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

import ItemEditCategories from './ItemEditCategories';
import ItemEditImages from './ItemEditImages';

interface Props {
    config: Config;
    itemToEdit: Item | null;
    width: number | string;
}
const ItemEditForm = ({ config, itemToEdit, width }: Props) => {
    const dispatch = useDispatch();
    const categoriesState = useSelector((state: RootState) => state.categories);
    const usersState = useSelector((state: RootState) => state.user);

    const initialCategories = useRef<number[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);

    const navigate = useNavigate();

    const descriptionFields = useLangTextAreas();
    const instock = useField('integer', ContentID.itemsInStock);
    const nameFields = useLangFields('text');
    const price = useField('decimal', ContentID.itemsPrice);

    // Set initial values for Name/Description/Instock/Price/Images (if editing an existing Item):
    useEffect(() => {
        if (itemToEdit) {
            nameFields.forEach((nf) => {
                const nameLangText = itemToEdit.name.find((langText) => langText.langCode === nf.langCode);
                nf.field.setNewValue(nameLangText ? nameLangText.text : '');
            });
            descriptionFields.forEach((df) => {
                const descriptionLangText = itemToEdit.description.find((langText) => langText.langCode === df.langCode);
                df.textArea.setNewValue(descriptionLangText ? descriptionLangText.text : '');
            });
            instock.setNewValue(itemToEdit.instock.toString());
            price.setNewValue(itemToEdit.price.toString());

            const categories = itemToEdit.categories.map((i) => {
                return i.id;
            });

            initialCategories.current = [...categories];
            setSelectedCategories([...categories]);

            setSelectedImages(itemToEdit.images);
        }
    }, [itemToEdit]);

    const cancel = async () => {
        // If images were uploaded before canceling, remove those from the server:
        const promises: Promise<Response>[] = [];

        selectedImages.forEach((path) => {
            if (!(itemToEdit && itemToEdit.images.includes(path))) {
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
        if (itemToEdit) {
            if (
                itemToEdit.price.toString() !== price.value.toString() ||
                itemToEdit.instock.toString() !== instock.value.toString() ||
                JSON.stringify(selectedCategories.sort()) !== JSON.stringify(initialCategories.current.sort()) ||
                selectedImages !== itemToEdit.images
            ) {
                return true;
            }
            nameFields.forEach((nf) => {
                if (nf.field.value !== itemToEdit.name.find((langText) => langText.langCode === nf.langCode)?.text) {
                    return true;
                }
            });
            descriptionFields.forEach((df) => {
                if (df.textArea.value !== itemToEdit.description.find((langText) => langText.langCode === df.langCode)?.text) {
                    return true;
                }
            });
        } else {
            return (
                price.value.toString().length > 0 &&
                instock.value.toString().length > 0 &&
                nameFields.every((nf) => nf.field.value.toString().length > 0) &&
                descriptionFields.every((df) => df.textArea.value.length > 0)
            );
        }

        return false;
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

    const reset = () => {
        setSelectedCategories([]);
        setSelectedImages([]);

        descriptionFields.forEach((df) => {
            df.textArea.reset();
        });
        nameFields.forEach((nf) => {
            nf.field.reset();
        });

        instock.reset();
        price.reset();
    };

    const submit = async () => {
        if (usersState.loggedUser && usersState.loggedUser.admin && usersState.loggedUser.token) {
            const token = usersState.loggedUser.token;

            if (changesMade()) {
                let returnedItem: Item | null = null;

                if (itemToEdit) {
                    const finalItem: Item = {
                        ...itemToEdit,
                        description: descriptionFields.map((df) => ({ langCode: df.langCode, text: df.textArea.value.toString() })),
                        instock: Number(instock.value),
                        images: selectedImages,
                        name: nameFields.map((nf) => ({ langCode: nf.langCode, text: nf.field.value.toString() })),
                        price: Number(price.value),
                    };

                    const res = await itemService.update(finalItem, usersState.loggedUser.token, config, dispatch);
                    returnedItem = res.item;

                    dispatch(setNotification({ tone: res.success ? 'Positive' : 'Negative', message: res.message }));
                } else {
                    const finalItem: NewItem = {
                        description: descriptionFields.map((df) => ({ langCode: df.langCode, text: df.textArea.value.toString() })),
                        instock: Number(instock.value),
                        images: selectedImages,
                        name: nameFields.map((nf) => ({ langCode: nf.langCode, text: nf.field.value.toString() })),
                        price: Number(price.value),
                    };

                    const res = await itemService.add(finalItem, null, usersState.loggedUser.token, config, dispatch);
                    returnedItem = res.item;

                    dispatch(setNotification({ tone: res.success ? 'Positive' : 'Negative', message: res.message }));
                }

                if (returnedItem) {
                    // Add connections between the updated/added Item and the selected Categories that are not yet connected to the Item:
                    selectedCategories.forEach(async (selected) => {
                        const category = categoriesState.categories.find((c) => {
                            return c.id === selected;
                        });
                        if (category && returnedItem && !(returnedItem.categories && returnedItem.categories.includes(category))) {
                            await item_categoryService.addConnection(returnedItem, category, token);
                        }
                    });

                    // Remove connections between the updated/added Item and Categories that are not selected and are currently connected to the Item:
                    if (returnedItem.categories) {
                        const toRemove = returnedItem.categories.filter((c) => {
                            if (!selectedCategories.includes(c.id)) {
                                return c;
                            }
                        });
                        toRemove.forEach(async (c) => {
                            if (returnedItem) {
                                await item_categoryService.deleteConnection(returnedItem.id, c.id, token);
                            }
                        });
                    }
                }
            }

            if (itemToEdit) {
                navigate(localstorageHandler.getPreviousLocation());
            } else {
                reset();
            }
        } else {
            handleError(new Error('Missing token'));
        }
    };

    return (
        <>
            <table align='center' width={width} className='itemDetails'>
                <tbody>
                    <tr>
                        <td colSpan={3} className='alignCenter colorGraySemiDark' style={{ paddingLeft: 0 }}>
                            {itemToEdit
                                ? contentToText(ContentID.adminItemToEdit, config) + ': ' + langTextsToText(itemToEdit.name, config)
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
                                            <ItemEditCategories
                                                selectedCategories={selectedCategories}
                                                setSelectedCategories={setSelectedCategories}
                                                config={config}
                                            />
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
