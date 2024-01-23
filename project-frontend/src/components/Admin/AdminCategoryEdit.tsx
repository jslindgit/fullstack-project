import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { ContentID } from '../../content';
import { Category } from '../../types/types';
import { RootState } from '../../reducers/rootReducer';

import { setNotification } from '../../reducers/miscReducer';

import categoryService from '../../services/categoryService';
import { contentToText, langTextsToText } from '../../types/languageFunctions';
import { handleError } from '../../util/handleError';
import { pageWidth } from '../../constants';
import { useLangFields, useLangTextAreas } from '../../types/languageFunctions';

import BackButton from '../BackButton';
import InputField from '../InputField';

const AdminCategoryEdit = () => {
    const dispatch = useDispatch();
    const config = useSelector((state: RootState) => state.config);
    const usersState = useSelector((state: RootState) => state.user);

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

                const res = await categoryService.update(updatedCategory, usersState.loggedUser.token, dispatch);

                dispatch(setNotification({ tone: res.success ? 'Positive' : 'Negative', message: res.message }));

                setCategoryById();
            } else {
                handleError(new Error('Missing token'));
            }
        }
    };

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
            <div style={{ margin: 'auto', width: pageWidth }}>
                <div className='pageHeader'>{contentToText(ContentID.adminEditCategory, config)}</div>
                <div className='grid-container itemDetails' data-gap='1rem'>
                    <div className='alignCenter colorGraySemiDark sizeLarge'>{langTextsToText(category.name, config)}</div>
                    <div className='alignLeft bold sizeLarge'>{contentToText(ContentID.miscName, config)}</div>
                    <div className='grid-container' data-gap='1rem' style={{ gridTemplateColumns: 'auto 1fr', padding: '1em' }}>
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
                    <div className='grid-container' data-gap='1rem' style={{ gridTemplateColumns: 'auto 1fr', padding: '1em' }}>
                        {descriptionFields.map((df) => (
                            <React.Fragment key={df.langCode}>
                                <div className='alignLeft semiBold valignMiddle'>{df.langCode}</div>
                                <div className='valignMiddle'>
                                    <textarea value={df.textArea.value} onChange={df.textArea.onChange} style={{ width: '100%', height: '10rem' }} />
                                </div>
                            </React.Fragment>
                        ))}
                        <div />
                        <div className='alignLeft' style={{ marginTop: '1.5rem' }}>
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
