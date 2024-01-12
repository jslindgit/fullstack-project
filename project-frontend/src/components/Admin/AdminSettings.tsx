import { useSelector } from 'react-redux';

import { ContentID } from '../../content';
import { RootState } from '../../reducers/rootReducer';

import { pageWidth } from '../../constants';
import { contentToText, langTextsToText } from '../../types/languageFunctions';

const AdminSettings = () => {
    const config = useSelector((state: RootState) => state.config);

    return (
        <div>
            <table align='center' width={pageWidth} className='infoBox'>
                <tbody>
                    <tr>
                        <td colSpan={3} className='bold sizeLarge'>
                            {contentToText(ContentID.miscWebstore, config)}
                        </td>
                    </tr>
                    <tr>
                        <td className='semiBold widthByContent'>{contentToText(ContentID.miscName, config)}:</td>
                        <td className='widthByContent'>{config.store.contactName}</td>
                        <td>
                            <button type='button'>{contentToText(ContentID.buttonEdit, config)}</button>
                        </td>
                    </tr>
                    <tr>
                        <td className='semiBold widthByContent'>{contentToText(ContentID.contactEmail, config)}:</td>
                        <td className='widthByContent'>{config.store.contactEmail}</td>
                        <td>
                            <button type='button'>{contentToText(ContentID.buttonEdit, config)}</button>
                        </td>
                    </tr>
                    <tr>
                        <td className='semiBold widthByContent'>{contentToText(ContentID.contactPhone, config)}:</td>
                        <td className='widthByContent'>{config.store.contactPhone}</td>
                        <td>
                            <button type='button'>{contentToText(ContentID.buttonEdit, config)}</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default AdminSettings;
