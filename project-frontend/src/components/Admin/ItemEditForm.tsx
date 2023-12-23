import { useEffect, useState } from 'react';
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
import useField, { UseField } from '../../hooks/useField';
import { UseTextArea } from '../../hooks/useTextArea';

import { setNotification } from '../../reducers/miscReducer';

import ItemEditCategories from './ItemEditCategories';
import ItemEditImages from './ItemEditImages';

export interface ImageToUpload {
    file: File;
    dataUrl: string;
}

interface Props {
    config: Config;
    initialCategories: number[] | undefined;
    itemToEdit: Item | null;
    onCancel?: (() => void) | undefined;
    onSubmit?: (() => void) | undefined;
    setItemAdded?: React.Dispatch<React.SetStateAction<Item | null>>;
    width: number | string;
}
const ItemEditForm = ({ config, initialCategories, itemToEdit, onCancel = undefined, onSubmit = undefined, setItemAdded, width }: Props) => {
    const dispatch = useDispatch();
    const categoriesState = useSelector((state: RootState) => state.categories);
    const usersState = useSelector((state: RootState) => state.user);

    const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);
    const [imagesToUpload, setImagesToUpload] = useState<ImageToUpload[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

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
        }
    }, [itemToEdit]);

    const cancel = async () => {
        if (onCancel) {
            onCancel();
        }

        navigate(localstorageHandler.getPreviousLocation());
    };

    const changesMade = (): boolean => {
        if (itemToEdit) {
            if (
                itemToEdit.price.toString() !== price.value.toString() ||
                itemToEdit.instock.toString() !== instock.value.toString() ||
                (initialCategories && JSON.stringify(selectedCategories.sort()) !== JSON.stringify(initialCategories.sort())) ||
                (!initialCategories && selectedCategories.length > 0)
            ) {
                return true;
            }
            if (imagesToRemove.length > 0 || imagesToUpload.length > 0) {
                return true;
            }
            if (nameFields.find((nf) => nf.field.value !== itemToEdit.name.find((langText) => langText.langCode === nf.langCode)?.text)) {
                return true;
            }
            if (descriptionFields.find((df) => df.textArea.value !== itemToEdit.description.find((langText) => langText.langCode === df.langCode)?.text)) {
                return true;
            }

            return false;
        }

        return true;
    };

    const getInputField = (label: string, field: UseField, placeHolder: string, width: string) => (
        <tr key={label}>
            <td width='1px' className='adminEditLangCode' style={{ paddingLeft: '1rem', paddingRight: 0 }}>
                {label}
            </td>
            <td>
                <input type={field.type} value={field.value} onChange={field.onChange} placeholder={placeHolder} style={{ width: width }} />
            </td>
        </tr>
    );

    const getTextArea = (label: string, textArea: UseTextArea, placeHolder: string) => (
        <tr key={label}>
            <td width='1px' className='adminEditLangCode' style={{ paddingLeft: '1rem', paddingRight: 0 }}>
                {label}
            </td>
            <td>
                <textarea value={textArea.value} onChange={textArea.onChange} placeholder={placeHolder} style={{ width: '100%', height: '7rem' }} />
            </td>
        </tr>
    );

    const reset = () => {
        setSelectedCategories([]);
        setImagesToUpload([]);

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

                const imageCategory = 'products';

                // Uploaded new images to server:
                imagesToUpload.forEach(async (imageToUpload) => {
                    if (usersState.loggedUser) {
                        await imageService.add(imageToUpload.file, imageCategory, usersState.loggedUser.token);
                    }
                });

                if (itemToEdit) {
                    const finalItem: Item = {
                        ...itemToEdit,
                        description: descriptionFields.map((df) => ({ langCode: df.langCode, text: df.textArea.value.toString() })),
                        instock: Number(instock.value),
                        images: [
                            ...itemToEdit.images.filter((img) => !imagesToRemove.includes(img)),
                            ...imagesToUpload.map((imageToUpload) => imageCategory + '\\' + imageToUpload.file.name),
                        ],
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
                        images: [...imagesToUpload.map((imageToUpload) => imageCategory + '\\' + imageToUpload.file.name)],
                        name: nameFields.map((nf) => ({ langCode: nf.langCode, text: nf.field.value.toString() })),
                        price: Number(price.value),
                    };

                    const res = await itemService.add(finalItem, null, usersState.loggedUser.token, config, dispatch);
                    returnedItem = res.item;

                    dispatch(setNotification({ tone: res.success ? 'Positive' : 'Negative', message: res.message }));
                }

                if (returnedItem) {
                    const promises: Promise<Response>[] = [];

                    // Add connections between the updated/added Item and the selected Categories that are not yet connected to the Item:
                    selectedCategories.forEach(async (selected) => {
                        const category = categoriesState.categories.find((c) => {
                            return c.id === selected;
                        });
                        if (category && returnedItem && !(returnedItem.categories && returnedItem.categories.includes(category))) {
                            promises.push(item_categoryService.addConnection(returnedItem, category, token));
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
                                promises.push(item_categoryService.deleteConnection(returnedItem.id, c.id, token));
                            }
                        });
                    }

                    Promise.all(promises);

                    if (setItemAdded) {
                        setItemAdded(returnedItem);
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

        if (onSubmit) {
            onSubmit();
        }
    };

    const validateFields = (): boolean => {
        return (
            descriptionFields.every((df) => df.textArea.stringValue().length > 0) &&
            instock.stringValue().length > 0 &&
            nameFields.every((nf) => nf.field.stringValue().length > 0) &&
            price.stringValue().length > 0 &&
            price.numValue() >= 0 &&
            price.numValue() <= config.maxItemPriceEUR
        );
    };

    return (
        <>
            <table align='center' width={width} className='itemDetails'>
                <tbody>
                    <tr>
                        <td colSpan={3} className='alignCenter colorGraySemiDark' style={{ paddingLeft: 0 }}>
                            {itemToEdit ? (
                                <>
                                    <span className='semiBold'>{contentToText(ContentID.adminItemToEdit, config) + ': '}</span>
                                    {langTextsToText(itemToEdit.name, config)}
                                </>
                            ) : (
                                <span className='semiBold'>{contentToText(ContentID.adminItemNewItem, config)}</span>
                            )}
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
                                    {nameFields.map((nf) =>
                                        getInputField(
                                            nf.langCode.toString(),
                                            nf.field,
                                            `${contentToText(ContentID.adminItemName, config)} (${nf.langCode})`,
                                            '100%'
                                        )
                                    )}
                                    <tr>
                                        <td colSpan={2} className='adminItemEditLabel'>
                                            {contentToText(ContentID.miscDescription, config)}:
                                        </td>
                                    </tr>
                                    {descriptionFields.map((df) =>
                                        getTextArea(
                                            df.langCode.toString(),
                                            df.textArea,
                                            `${contentToText(ContentID.adminItemDescription, config)} (${df.langCode})`
                                        )
                                    )}
                                    <tr>
                                        <td colSpan={2} className='adminItemEditLabel'>
                                            {contentToText(price.label, config)}:
                                        </td>
                                    </tr>
                                    {getInputField(config.currency, price, '0–' + config.maxItemPriceEUR, '33%')}
                                    <tr>
                                        <td colSpan={2} className='adminItemEditLabel'>
                                            {contentToText(instock.label, config)}:
                                        </td>
                                    </tr>
                                    {getInputField(contentToText(ContentID.itemsPcs, config), instock, contentToText(ContentID.itemsInStock, config), '33%')}
                                    <tr>
                                        <td colSpan={2} width='1px'>
                                            <button type='button' onClick={submit} disabled={!(changesMade() && validateFields())}>
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
                                                config={config}
                                                initialCategories={initialCategories}
                                                selectedCategories={selectedCategories}
                                                setSelectedCategories={setSelectedCategories}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='adminItemEditLabel'>{contentToText(ContentID.adminPanelImages, config)}:</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <ItemEditImages
                                                currentImages={itemToEdit ? itemToEdit.images : []}
                                                imagesToRemove={imagesToRemove}
                                                imagesToUpload={imagesToUpload}
                                                setImagesToRemove={setImagesToRemove}
                                                setImagesToUpload={setImagesToUpload}
                                                config={config}
                                            />
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
