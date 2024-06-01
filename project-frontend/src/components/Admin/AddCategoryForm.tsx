import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ContentID } from '../../content';
import { Category, NewCategory, User } from '../../types/types';
import { RootState } from '../../redux/rootReducer';

import categoryService from '../../services/categoryService';
import { useLangFields, useLangTextAreas } from '../../hooks/useLang';
import { contentToText, langTextsToText } from '../../types/languageFunctions';

import { setNotification } from '../../redux/miscReducer';

import InputField from '../InputField';

interface Props {
    categories: Category[];
    setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
    user: User | null;
}
const AddCategoryForm = ({ categories, setCategories, user }: Props) => {
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

        const res = await categoryService.add(newCategory, user.token);

        if (res.addedCategory) {
            setCategories([...categories, res.addedCategory].sort((a, b) => langTextsToText(a.name, config).localeCompare(langTextsToText(b.name, config))));
        }

        dispatch(setNotification({ tone: res.success ? 'Positive' : 'Negative', message: res.message }));

        nameFields.forEach((nf) => {
            nf.field.clear();
        });
        descriptionFields.forEach((df) => {
            df.textArea.reset();
        });

        // Scroll to top of the page:
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className='adminFormDiv'>
            <div className='alignCenter marginTop0 pageHeader'>{contentToText(ContentID.adminAddNewCategory, config)}</div>
            <div className='grid-container paddingLeft1 paddingRight1' data-cols='1' data-gap='1rem'>
                <div className='alignLeft bold sizeLarge'>{contentToText(ContentID.miscName, config)}</div>
                <div className='grid-container' data-gap='1rem' data-cols='auto 1fr'>
                    {nameFields.map((nf) => (
                        <React.Fragment key={nf.langCode}>
                            <div className='alignLeft semiBold valignMiddle'>{nf.langCode}</div>
                            <div className='valignMiddle'>
                                <InputField useField={nf.field} width='100%' />
                            </div>
                        </React.Fragment>
                    ))}
                </div>
                <div className='alignLeft bold marginTop1 sizeLarge'>{contentToText(ContentID.miscDescription, config)}</div>
                <div className='grid-container' data-cols='auto 1fr' data-gap='1rem'>
                    {descriptionFields.map((df) => (
                        <React.Fragment key={df.langCode}>
                            <div className='alignLeft semiBold valignMiddle'>{df.langCode}</div>
                            <div className='valignMiddle'>
                                <textarea className='height10rem widthFull' value={df.textArea.value} onChange={df.textArea.onChange} />
                            </div>
                        </React.Fragment>
                    ))}
                </div>
                <div className='marginTop1'>
                    <button type='button' onClick={submit}>
                        {contentToText(ContentID.buttonAdd, config)}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddCategoryForm;
