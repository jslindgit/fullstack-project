import { useSelector } from 'react-redux';

import { ContentID } from '../content';
import { RootState } from '../reducers/rootReducer';

import { contentToText } from '../types/languageFunctions';
import { pageWidth } from '../constants';

const Info = () => {
    const configState = useSelector((state: RootState) => state.config);

    const businessId = (bid: string) => {
        if (bid.length > 0) {
            return (
                <tr>
                    <td className='widthByContent infoText'>{contentToText(ContentID.contactBusinessID, configState)}:&emsp;</td>
                    <td className='infoText'>{bid}</td>
                </tr>
            );
        }
    };

    const phone = (phoneNumber: string) => {
        if (phoneNumber.length > 0) {
            return (
                <tr>
                    <td className='infoText'>{contentToText(ContentID.contactPhone, configState)}:&emsp;</td>
                    <td className='infoText'>
                        <a href={'tel:' + phoneNumber}>{phoneNumber}</a>
                    </td>
                </tr>
            );
        } else {
            return <></>;
        }
    };

    return (
        <>
            <div>
                <table align='center' width={pageWidth} className='valignTop'>
                    <tbody>
                        <tr>
                            <td colSpan={3} className='pageHeader'>
                                {contentToText(ContentID.menuInfo, configState)}
                            </td>
                        </tr>
                        <tr>
                            <td width='47%' className='infoBox'>
                                <table width='100%' className='noPadding'>
                                    <tbody>
                                        <tr>
                                            <td colSpan={2}>
                                                <div className='infoHeader underlined'>{configState.store.contactName}</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='widthByContent infoText'>{contentToText(ContentID.contactEmail, configState)}:&emsp;</td>
                                            <td className='infoText'>
                                                <a href={'mailto:' + configState.store.contactEmail}>{configState.store.contactEmail}</a>
                                            </td>
                                        </tr>
                                        {phone(configState.store.contactPhone)}
                                    </tbody>
                                </table>
                            </td>
                            <td></td>
                            <td width='47%' className='infoBox' style={{ verticalAlign: 'top' }}>
                                <table width='100%' className='noPadding'>
                                    <tbody>
                                        <tr>
                                            <td colSpan={2}>
                                                <div className='infoHeader underlined'>{contentToText(ContentID.miscMerchant, configState)}</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan={2} className='semiBold infoText' style={{ paddingTop: 0 }}>
                                                {configState.owner.name}
                                            </td>
                                        </tr>
                                        {businessId(configState.owner.businessIdentifier)}
                                        <tr>
                                            <td className='widthByContent infoText'>{contentToText(ContentID.contactEmail, configState)}:&emsp;</td>
                                            <td className='infoText'>
                                                <a href={'mailto:' + configState.owner.email}>{configState.owner.email}</a>
                                            </td>
                                        </tr>
                                        {phone(configState.owner.phone)}
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Info;
