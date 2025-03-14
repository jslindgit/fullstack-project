import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Config } from '../../types/configTypes';
import { ContentID } from '../../content';
import { RootState } from '../../redux/rootReducer';
import { Item, ItemSizeAndInstock, NewItem } from '../../types/types';

import { testItemId } from '../../constants';
import { handleError } from '../../util/handleError';
import { useLangFields, useLangTextAreas } from '../../hooks/useLang';
import { contentToText, langTextsToText } from '../../types/languageFunctions';
import localstorageHandler from '../../util/localstorageHandler';
import useField from '../../hooks/useField';

import { useItemAddMutation, useItemUpdateMutation } from '../../redux/slices/itemSlice';
import { setNotification } from '../../redux/miscReducer';

import { maxItemPriceEUR } from '../../constants';

import InputField from '../InputField';
import ItemEditCategories from './ItemEditCategories';
import ItemEditImages from './ItemEditImages';
import ItemSizes from './ItemSizes';

interface Props {
    config: Config;
    initialCategories: number[] | undefined;
    itemToEdit: Item | null;
    onCancel?: (() => void) | undefined;
    onSubmit?: (() => void) | undefined;
}
const ItemEditForm = ({ config, initialCategories, itemToEdit, onCancel = undefined, onSubmit = undefined }: Props) => {
    const [itemAdd] = useItemAddMutation();
    const [itemUpdate] = useItemUpdateMutation();

    const dispatch = useDispatch();
    const usersState = useSelector((state: RootState) => state.user);

    const [fieldsInitialized, setFieldsInitialized] = useState<boolean>(false);
    const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);
    const [imagesToAdd, setImagesToAdd] = useState<string[]>([]);
    const [oneSizeInstock, setOneSizeInstock] = useState<number>(0);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [sizes, setSizes] = useState<ItemSizeAndInstock[]>([]);

    const navigate = useNavigate();

    const descriptionFields = useLangTextAreas();
    const nameFields = useLangFields('text');
    const price = useField('decimal', ContentID.itemsPrice);
    const fitsInLetter = useField('integer', null, '0');

    // Set initial values for Name/Description/Instock/Price/Images (if editing an existing Item):
    useEffect(() => {
        if (itemToEdit) {
            if (!fieldsInitialized) {
                nameFields.forEach((nf) => {
                    const nameLangText = itemToEdit.name.find((langText) => langText.langCode === nf.langCode);
                    nf.field.setNewValue(nameLangText ? nameLangText.text : '');
                });
                descriptionFields.forEach((df) => {
                    const descriptionLangText = itemToEdit.description.find((langText) => langText.langCode === df.langCode);
                    df.textArea.setNewValue(descriptionLangText ? descriptionLangText.text : '');
                });
                price.setNewValue(itemToEdit.price.toString());
                fitsInLetter.setNewValue(itemToEdit.fitsInLetter.toString());

                if (itemToEdit.sizes.length > 0 && itemToEdit.sizes[0].size !== '-') {
                    setSizes(
                        itemToEdit.sizes.map((s) => {
                            return { size: s.size, instock: s.instock };
                        })
                    );
                } else if (itemToEdit.sizes.length > 0) {
                    setOneSizeInstock(itemToEdit.sizes[0].instock);
                }

                setFieldsInitialized(true);
            }
        }
    }, [descriptionFields, fieldsInitialized, fitsInLetter, itemToEdit, nameFields, price]);

    const cancel = async () => {
        if (onCancel) {
            onCancel();
        }

        if (itemToEdit) {
            navigate(localstorageHandler.getPreviousLocation());
        } else {
            reset();
        }
    };

    const canSubmit = () => usersState.loggedUser?.admin || !(itemToEdit && !(itemToEdit.addedBy && itemToEdit.addedBy === usersState.loggedUser?.id));

    const changesMade = (): boolean => {
        if (itemToEdit) {
            if (
                itemToEdit.price.toString() !== price.value.toString() ||
                itemToEdit.fitsInLetter.toString() !== fitsInLetter.stringValue() ||
                (initialCategories && JSON.stringify(selectedCategories.sort()) !== JSON.stringify(initialCategories.sort())) ||
                (!initialCategories && selectedCategories.length > 0)
            ) {
                return true;
            }
            if (imagesToRemove.length > 0 || imagesToAdd.length > 0) {
                return true;
            }
            if (nameFields.find((nf) => nf.field.value !== itemToEdit.name.find((langText) => langText.langCode === nf.langCode)?.text)) {
                return true;
            }
            if (descriptionFields.find((df) => df.textArea.value !== itemToEdit.description.find((langText) => langText.langCode === df.langCode)?.text)) {
                return true;
            }
            if (itemToEdit.sizes.length < 1) {
                return true;
            }
            if (itemToEdit.sizes.length !== sizes.length && !(sizes.length < 1 && itemToEdit.sizes.length === 1 && itemToEdit.sizes[0].size === '-')) {
                return true;
            }
            if (itemToEdit.sizes.length === 1 && itemToEdit.sizes[0].instock !== oneSizeInstock) {
                return true;
            }
            if (sizes.length > 0 && itemToEdit.sizes.length === sizes.length) {
                let change = false;
                sizes.forEach((s) => {
                    const itemSize = itemToEdit.sizes[sizes.indexOf(s)];
                    if (itemSize.instock !== s.instock || itemSize.size !== s.size) {
                        change = true;
                    }
                });
                if (change) {
                    return true;
                }
            }

            return false;
        }

        return true;
    };

    const reset = () => {
        setSelectedCategories([]);
        setImagesToAdd([]);

        descriptionFields.forEach((df) => {
            df.textArea.reset();
        });
        nameFields.forEach((nf) => {
            nf.field.clear();
        });

        price.clear();
    };

    const submit = async () => {
        if (usersState.loggedUser && (usersState.loggedUser.admin || usersState.loggedUser.operator) && usersState.loggedUser.token) {
            if (changesMade()) {
                if (itemToEdit) {
                    const finalItem: Item = {
                        ...itemToEdit,
                        description: descriptionFields.map((df) => ({ langCode: df.langCode, text: df.textArea.value.toString() })),
                        fitsInLetter: fitsInLetter.numValue(),
                        instock: 0,
                        images: [...itemToEdit.images.filter((img) => !imagesToRemove.includes(img)), ...imagesToAdd],
                        name: nameFields.map((nf) => ({ langCode: nf.langCode, text: nf.field.value.toString() })),
                        price: Number(price.value),
                        sizes: sizes.length > 0 ? sizes : [{ size: '-', instock: oneSizeInstock }],
                    };

                    const res = await itemUpdate({ toUpdate: finalItem, categoryIds: selectedCategories, config: config }).unwrap();

                    dispatch(setNotification({ tone: res.success ? 'Positive' : 'Negative', message: res.message }));
                } else {
                    const finalItem: NewItem = {
                        description: descriptionFields.map((df) => ({ langCode: df.langCode, text: df.textArea.value.toString() })),
                        fitsInLetter: fitsInLetter.numValue(),
                        instock: 0,
                        images: [...imagesToAdd],
                        name: nameFields.map((nf) => ({ langCode: nf.langCode, text: nf.field.value.toString() })),
                        price: Number(price.value),
                        sizes: sizes.length > 0 ? sizes : [{ size: '-', instock: oneSizeInstock }],
                    };

                    const res = await itemAdd({ toAdd: finalItem, categoryIds: selectedCategories, config: config }).unwrap();

                    dispatch(setNotification({ tone: res.success ? 'Positive' : 'Negative', message: res.message }));
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
            nameFields.every((nf) => nf.field.stringValue().length > 0) &&
            price.stringValue().length > 0 &&
            price.numValue() >= 0 &&
            price.numValue() <= maxItemPriceEUR
        );
    };

    return (
        <div className='adminFormDiv'>
            {itemToEdit ? (
                <div className='colorGraySemiDark divCenter divMinWidth grid-container left noWrap' data-cols='2' data-gap='0.25rem 1rem'>
                    <div className='semiBold'>{contentToText(ContentID.adminItemToEdit, config) + ':'}</div>
                    <div>{langTextsToText(itemToEdit.name, config)}</div>
                    <div />
                    <div className='sizeSmallish'>
                        {contentToText(ContentID.itemsId, config)}: {itemToEdit.id}
                    </div>
                </div>
            ) : (
                <div className='semiBold'>{contentToText(ContentID.adminItemNewItem, config)}</div>
            )}
            <div className='grid-container left marginTop2' data-cols='item-edit-form' data-gap='1rem 0'>
                <div className='grid-container' data-gap='1rem'>
                    <div className='adminItemEditLabel'>{contentToText(ContentID.miscName, config)}:</div>
                    <div className='grid-container marginLeft1' data-cols='auto 1fr' data-gap='1rem'>
                        {nameFields.map((nf) => (
                            <React.Fragment key={nf.langCode}>
                                <div className='valignMiddle'>{nf.langCode}</div>
                                <InputField
                                    useField={nf.field}
                                    width='100%'
                                    placeHolder={`${contentToText(ContentID.adminItemName, config)} (${nf.langCode})`}
                                />
                            </React.Fragment>
                        ))}
                    </div>
                    <div className='adminItemEditLabel'>{contentToText(ContentID.miscDescription, config)}:</div>
                    <div className='grid-container marginLeft1' data-cols='auto 1fr' data-gap='1rem'>
                        {descriptionFields.map((df) => (
                            <React.Fragment key={df.langCode}>
                                <div className='valignMiddle'>{df.langCode}</div>
                                <textarea
                                    className='height7rem widthFull'
                                    value={df.textArea.value}
                                    onChange={df.textArea.onChange}
                                    placeholder={`${contentToText(ContentID.adminItemDescription, config)} (${df.langCode})`}
                                />
                            </React.Fragment>
                        ))}
                    </div>
                    <div className='adminItemEditLabel'>{contentToText(ContentID.itemsPrice, config)}:</div>
                    <div className='grid-container marginLeft1' data-cols='auto 1fr' data-gap='1rem'>
                        <div className='valignMiddle'>{config.currency}</div>
                        <InputField useField={price} width='33%' placeHolder={'0–' + maxItemPriceEUR} />
                    </div>
                    <div className='adminItemEditLabel'>{contentToText(ContentID.adminItemSizes, config)}:</div>
                    <div className='marginLeft1'>
                        <ItemSizes config={config} oneSizeInstock={oneSizeInstock} setOneSizeInstock={setOneSizeInstock} setSizes={setSizes} sizes={sizes} />
                    </div>
                    <div className='adminItemEditLabel'>{contentToText(ContentID.itemsFitsInLetter, config)}:</div>
                    <div className='grid-container marginLeft1' data-cols='auto 1fr' data-gap='1rem'>
                        <div className='valignMiddle'>{contentToText(ContentID.itemsPcs, config).toUpperCase()}</div>
                        <InputField useField={fitsInLetter} width='33%' />
                    </div>
                </div>
                <div />
                <div className='divMinHeight grid-container' data-gap='1rem'>
                    <div className='adminItemEditLabel'>{contentToText(ContentID.adminPanelCategories, config)}:</div>
                    <div className='marginLeft1'>
                        <ItemEditCategories
                            config={config}
                            initialCategories={initialCategories}
                            selectedCategories={selectedCategories}
                            setSelectedCategories={setSelectedCategories}
                        />
                    </div>
                    <div className='adminItemEditLabel'>{contentToText(ContentID.adminPanelImages, config)}:</div>
                    <div className='marginLeft1'>
                        <ItemEditImages
                            currentImages={itemToEdit ? itemToEdit.images : []}
                            imagesToAdd={imagesToAdd}
                            imagesToRemove={imagesToRemove}
                            setImagesToAdd={setImagesToAdd}
                            setImagesToRemove={setImagesToRemove}
                            config={config}
                        />
                    </div>
                </div>
            </div>
            <div className='alignCenter marginTop2'>
                <button
                    type='button'
                    onClick={submit}
                    // Item with id 89 is needed for E2E tests, so it can't be modified:
                    disabled={!(changesMade() && validateFields()) || !canSubmit() || (itemToEdit !== null && itemToEdit.id === testItemId)}
                    // prettier-ignore
                    title={
                        !canSubmit()
                            ? contentToText(ContentID.adminYouCanOnlyEditItemsAddedByYou, config)
                            : itemToEdit && itemToEdit.id === testItemId
                                ? contentToText(ContentID.miscTestItemCannotBeModified, config)
                                : ''
                    }
                >
                    {contentToText(itemToEdit ? ContentID.buttonSave : ContentID.buttonAdd, config)}
                </button>
                &emsp;
                <button type='button' onClick={cancel}>
                    {contentToText(ContentID.buttonCancel, config)}
                </button>
            </div>
        </div>
    );
};

export default ItemEditForm;
