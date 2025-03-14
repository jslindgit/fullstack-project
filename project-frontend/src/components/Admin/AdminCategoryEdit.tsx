import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { ContentID } from '../../content';
import { Category } from '../../types/types';
import { RootState } from '../../redux/rootReducer';

import { contentToText, langTextsToText } from '../../types/languageFunctions';
import { handleError } from '../../util/handleError';
import { useLangFields, useLangTextAreas } from '../../hooks/useLang';

import { useCategoryGetByIdQuery, useCategoryUpdateMutation } from '../../redux/slices/categorySlice';
import { setNotification } from '../../redux/miscReducer';

import BackButton from '../BackButton';
import InputField from '../InputField';
import LoadingQuery from '../LoadingQuery';

const AdminCategoryEdit = () => {
    const dispatch = useDispatch();
    const config = useSelector((state: RootState) => state.config);
    const usersState = useSelector((state: RootState) => state.user);

    const [fieldsInitialized, setFieldsInitialized] = useState<boolean>(false);

    const nameFields = useLangFields('text');
    const descriptionFields = useLangTextAreas();

    const id = Number(useParams().id);

    const categoryGetById = useCategoryGetByIdQuery(id);
    const [categoryUpdate] = useCategoryUpdateMutation();

    const category = categoryGetById.data;

    // Set initial values for name and description fields:
    useEffect(() => {
        if (category) {
            if (!fieldsInitialized) {
                nameFields.forEach((nf) => {
                    const nameLangText = category.name.find((langText) => langText.langCode === nf.langCode);
                    nf.field.setNewValue(nameLangText ? nameLangText.text : '');
                });
                descriptionFields.forEach((df) => {
                    const descriptionLangText = category.description.find((langText) => langText.langCode === df.langCode);
                    df.textArea.setNewValue(descriptionLangText ? descriptionLangText.text : '');
                });

                setFieldsInitialized(true);
            }
        }
    }, [category, descriptionFields, fieldsInitialized, nameFields]);

    const canSaveChanges = () => usersState.loggedUser?.admin || category?.addedBy === usersState.loggedUser?.id;

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
                    result = true;
                }
            });
        }

        return result;
    };

    const submit = async () => {
        if (category && changesMade()) {
            if (usersState.loggedUser && (usersState.loggedUser.admin || usersState.loggedUser.operator) && usersState.loggedUser.token) {
                const updatedCategory: Category = {
                    ...category,
                    description: descriptionFields.map((df) => ({ langCode: df.langCode, text: df.textArea.value.toString() })),
                    name: nameFields.map((nf) => ({ langCode: nf.langCode, text: nf.field.value.toString() })),
                };

                const res = await categoryUpdate({ category: updatedCategory, config: config }).unwrap();

                dispatch(setNotification({ tone: res.success ? 'Positive' : 'Negative', message: res.message }));
            } else {
                handleError(new Error('Missing token'));
            }
        }
    };

    if (!category || !categoryGetById.data) {
        return <LoadingQuery query={categoryGetById} config={config} />;
    }

    return (
        <div>
            <div className='pageWidth'>
                <div className='pageHeader'>{contentToText(ContentID.adminEditCategory, config)}</div>
                <div className='adminFormDiv grid-container' data-gap='1rem'>
                    <div className='alignCenter colorGraySemiDark sizeLarge'>{langTextsToText(category.name, config)}</div>
                    <div className='alignLeft bold sizeLarge'>{contentToText(ContentID.miscName, config)}</div>
                    <div className='grid-container padding1' data-cols='auto 1fr' data-gap='1rem'>
                        {nameFields.map((nf) => (
                            <React.Fragment key={nf.langCode}>
                                <div className='alignLeft semiBold valignMiddle'>{nf.langCode}</div>
                                <div className='valignMiddle'>
                                    <InputField useField={nf.field} width='100%' />
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                    <div className='alignLeft bold sizeLarge'>{contentToText(ContentID.miscDescription, config)}</div>
                    <div className='grid-container padding1' data-cols='auto 1fr' data-gap='1rem'>
                        {descriptionFields.map((df) => (
                            <React.Fragment key={df.langCode}>
                                <div className='alignLeft semiBold valignMiddle'>{df.langCode}</div>
                                <div className='valignMiddle'>
                                    <textarea className='height10rem widthFull' value={df.textArea.value} onChange={df.textArea.onChange} />
                                </div>
                            </React.Fragment>
                        ))}
                        <div />
                        <div className='alignLeft marginTop1_5'>
                            <button
                                type='button'
                                onClick={submit}
                                disabled={!changesMade() || !canSaveChanges()}
                                title={canSaveChanges() ? '' : contentToText(ContentID.adminYouCanOnlyEditCategoriesAddedByYou, config)}
                            >
                                {contentToText(ContentID.buttonSave, config)}
                            </button>
                            &emsp;
                            <BackButton type='button' />
                        </div>
                    </div>
                </div>
            </div>
            <br />
        </div>
    );
};

export default AdminCategoryEdit;
