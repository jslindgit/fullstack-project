import { useSelector } from 'react-redux';
import { Link } from './CustomLink';

import { RootState } from '../reducers/rootReducer';

import { isString } from '../types/type_functions';
import { pageWidth } from '../constants';

const Info = () => {
    const configState = useSelector((state: RootState) => state.config);

    const phone = (phoneNumber: unknown) => {
        if (isString(phoneNumber)) {
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
                    <tr>
                        <td width='50%' className='noPadding' style={{ verticalAlign: 'top' }}>
                            <table align='left' className='paddingTopBottomOnly'>
                                <tbody>
                                    <tr>
                                        <td>
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
                                        <td>
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
                                                    <tr>
                                                        <td className='widthByContent'>Email:</td>
                                                        <td>
                                                            <a href={'mailto:' + configState.store.email}>{configState.store.email}</a>
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
                </table>
            </div>
        </>
    );
};

export default Info;
