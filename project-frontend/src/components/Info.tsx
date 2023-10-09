import { useSelector } from 'react-redux';

import { RootState } from '../reducers/rootReducer';

import { pageWidth } from '../constants';

const Info = () => {
    const configState = useSelector((state: RootState) => state.config);

    const businessId = (bid: string) => {
        if (bid.length > 0) {
            return (
                <tr>
                    <td className='widthByContent'>Business ID:</td>
                    <td>{bid}</td>
                </tr>
            );
        }
    };

    const phone = (phoneNumber: string) => {
        if (phoneNumber.length > 0) {
            return (
                <tr>
                    <td>Phone:</td>
                    <td>{phoneNumber}</td>
                </tr>
            );
        } else {
            return <></>;
        }
    };

    return (
        <>
            <div>
                <table align='center' width={pageWidth}>
                    <tbody>
                        <tr>
                            <td width='50%' className='noPadding' style={{ verticalAlign: 'top' }}>
                                <table align='left' className='paddingTopBottomOnly'>
                                    <tbody>
                                        <tr>
                                            <td className='currentPage'>
                                                <h3>{configState.store.name}</h3>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='noPadding'>
                                                <table align='center' width='100%' className='noOuterPadding'>
                                                    <tbody>
                                                        <tr>
                                                            <td className='widthByContent'>Email:</td>
                                                            <td>
                                                                <a href={'mailto:' + configState.store.email}>{configState.store.email}</a>
                                                            </td>
                                                        </tr>
                                                        {phone(configState.store.phone)}
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                            <td width='50%' className='noPadding' style={{ verticalAlign: 'top' }}>
                                <table align='right' className='paddingTopBottomOnly'>
                                    <tbody>
                                        <tr>
                                            <td className='currentPage'>
                                                <h3>Store Owner</h3>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='bold' style={{ paddingTop: 0 }}>
                                                {configState.owner.name}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className='noPadding'>
                                                <table align='center' width='100%' className='paddingTopBottomOnly'>
                                                    <tbody>
                                                        {businessId(configState.owner.businessIdentifier)}
                                                        <tr>
                                                            <td className='widthByContent'>Email:</td>
                                                            <td>
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
