import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ContentID } from '../../content';
import { NewCategory, User } from '../../types/types';
import { RootState } from '../../reducers/rootReducer';

import { contentToText, useLangFields, useLangTextAreas } from '../../types/languageFunctions';
import categoryService from '../../services/categoryService';

import { setNotification } from '../../reducers/miscReducer';

import InputField from '../InputField';

interface Props {
    user: User | null;
}
const AddCategoryForm = ({ user }: Props) => {
    const config = useSelector((state: RootState) => state.config);

    const nameFields = useLangFields('text');
    const descriptionFields = useLangTextAreas();

    const dispatch = useDispatch();

    if (!user?.admin && !user?.operator) {
        return <>Error: 403</>;
    }

    const submit = async () => {
        const newCategory: NewCategory = {
            description: descriptionFields.map((df) => ({ langCode: df.langCode, text: df.textArea.value.toString() })),
            name: nameFields.map((nf) => ({ langCode: nf.langCode, text: nf.field.value.toString() })),
        };

        const res = await categoryService.add(newCategory, user.token, dispatch);

        dispatch(setNotification({ tone: res.success ? 'Positive' : 'Negative', message: res.message }));

        nameFields.forEach((nf) => {
            nf.field.clear();
        });
        descriptionFields.forEach((df) => {
            df.textArea.reset();
        });
    };

    return (
        <div className='itemDetails'>
            <div className='pageHeader' style={{ marginTop: 0, textAlign: 'center' }}>
                {contentToText(ContentID.adminAddNewCategory, config)}
            </div>
            <div className='grid-container' data-cols='1' data-gap='1rem' style={{ padding: '0 1em' }}>
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
                </div>
                <div style={{ marginBottom: '0.5rem' }}>
                    <button type='button' onClick={submit}>
                        {contentToText(ContentID.buttonAdd, config)}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddCategoryForm;
