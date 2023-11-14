import { useSelector } from 'react-redux';

import { RootState } from '../reducers/rootReducer';

const Info = () => {
    const configState = useSelector((state: RootState) => state.config);

    const businessId = (bid: string) => {
        if (bid.length > 0) {
            return (
                <tr>
                    <td className='widthByContent infoText'>Business ID:</td>
                    <td className='infoText'>{bid}</td>
                </tr>
            );
        }
    };

    const phone = (phoneNumber: string) => {
        if (phoneNumber.length > 0) {
            return (
                <tr>
                    <td className='infoText'>Phone:</td>
                    <td className='infoText'>{phoneNumber}</td>
                </tr>
            );
        } else {
            return <></>;
        }
    };

    return (
        <>
            <div>
                <br />
                <table align='center' className='valignTop'>
                    <tbody>
                        <tr>
                            <td className='noPadding'>
                                <table align='left'>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <h3 className='underlined'>{configState.store.contactName}</h3>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <table width='100%' className='noOuterPadding'>
                                                    <tbody>
                                                        <tr>
                                                            <td className='widthByContent infoText'>Email:</td>
                                                            <td className='infoText'>
                                                                <a href={'mailto:' + configState.store.contactEmail}>{configState.store.contactEmail}</a>
                                                            </td>
                                                        </tr>
                                                        {phone(configState.store.contactPhone)}
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                            <td width='150rem'></td>
                            <td className='noPadding' style={{ verticalAlign: 'top' }}>
                                <table align='right' className='paddingTopBottomOnly'>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <h3 className='underlined'>Store Owner</h3>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='semiBold infoText' style={{ paddingTop: 0 }}>
                                                {configState.owner.name}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='noPadding'>
                                                <table align='center' width='100%'>
                                                    <tbody>
                                                        {businessId(configState.owner.businessIdentifier)}
                                                        <tr>
                                                            <td className='widthByContent infoText'>Email:</td>
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
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Info;
