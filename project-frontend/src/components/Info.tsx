import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { ContentID } from '../content';
import { RootState } from '../reducers/rootReducer';

import { contentToText } from '../types/languageFunctions';
import { pageWidth } from '../constants';

const Info = () => {
    const config = useSelector((state: RootState) => state.config);

    useEffect(() => {
        document.title = contentToText(ContentID.menuInfo, config) + ' | ' + config.store.contactName;
    }, [config]);

    const businessId = (bid: string) => {
        if (bid.length > 0) {
            return (
                <tr>
                    <td className='widthByContent'>{contentToText(ContentID.contactBusinessID, config)}:&emsp;</td>
                    <td>{bid}</td>
                </tr>
            );
        }
    };

    const phone = (phoneNumber: string) => {
        if (phoneNumber.length > 0) {
            return (
                <tr>
                    <td className='widthByContent'>{contentToText(ContentID.contactPhone, config)}:&emsp;</td>
                    <td>
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
                                {contentToText(ContentID.menuInfo, config)}
                            </td>
                        </tr>
                        <tr>
                            <td width='47%' className='infoBox'>
                                <table width='100%'>
                                    <tbody>
                                        <tr>
                                            <td colSpan={2}>
                                                <div className='infoHeader underlined'>{config.store.contactName}</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='widthByContent'>{contentToText(ContentID.contactEmail, config)}:&emsp;</td>
                                            <td>
                                                <a href={'mailto:' + config.store.contactEmail}>{config.store.contactEmail}</a>
                                            </td>
                                        </tr>
                                        {phone(config.store.contactPhone)}
                                    </tbody>
                                </table>
                            </td>
                            <td></td>
                            <td width='47%' className='infoBox' style={{ verticalAlign: 'top' }}>
                                <table width='100%'>
                                    <tbody>
                                        <tr>
                                            <td colSpan={2}>
                                                <div className='infoHeader underlined'>{contentToText(ContentID.miscMerchant, config)}</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan={2} className='semiBold' style={{ paddingTop: 0 }}>
                                                {config.owner.name}
                                            </td>
                                        </tr>
                                        {businessId(config.owner.businessIdentifier)}
                                        <tr>
                                            <td className='widthByContent'>{contentToText(ContentID.contactEmail, config)}:&emsp;</td>
                                            <td>
                                                <a href={'mailto:' + config.owner.email}>{config.owner.email}</a>
                                            </td>
                                        </tr>
                                        {phone(config.owner.phone)}
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
