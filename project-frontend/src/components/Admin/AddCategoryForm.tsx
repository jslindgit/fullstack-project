import { useDispatch, useSelector } from 'react-redux';

import { ContentID } from '../../content';
import { NewCategory, User } from '../../types/types';
import { RootState } from '../../reducers/rootReducer';

import { contentToText, useLangFields, useLangTextAreas } from '../../types/languageFunctions';
import categoryService from '../../services/categoryService';
import { UseField } from '../../hooks/useField';
import { UseTextArea } from '../../hooks/useTextArea';

import { setNotification } from '../../reducers/miscReducer';

interface Props {
    user: User | null;
}
const AddCategoryForm = ({ user }: Props) => {
    const config = useSelector((state: RootState) => state.config);

    const nameFields = useLangFields();
    const descriptionFields = useLangTextAreas();

    const dispatch = useDispatch();

    if (!user || !user.admin) {
        return <>Error: Invalid User</>;
    }

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

    const submit = async () => {
        const newCategory: NewCategory = {
            name: nameFields.map((nf) => ({ langCode: nf.langCode, text: nf.field.value.toString() })),
            description: descriptionFields.map((df) => ({ langCode: df.langCode, text: df.textArea.value.toString() })),
        };

        const res = await categoryService.add(newCategory, user.token, dispatch);

        dispatch(setNotification({ tone: res.success ? 'Positive' : 'Negative', message: res.message }));

        nameFields.forEach((nf) => {
            nf.field.reset();
        });
        descriptionFields.forEach((df) => {
            df.textArea.reset();
        });
    };

    return (
        <>
            <div className='pageHeader'>{contentToText(ContentID.adminAddNewCategory, config)}</div>
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

export default AddCategoryForm;
