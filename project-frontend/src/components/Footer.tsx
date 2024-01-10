import { useSelector } from 'react-redux';

import { RootState } from '../reducers/rootReducer';

import { pageWidth } from '../constants';

const Footer = () => {
    const config = useSelector((state: RootState) => state.config);

    return (
        <div className='footer'>
            <table align='center' width={pageWidth} className='colorWhite'>
                <tbody>
                    <tr>
                        <td>{config.store.contactName}</td>
                        <td>
                            {config.store.contactStreetAddress}&emsp;{config.store.contactZipcode} {config.store.contactCity}
                        </td>
                        <td>{config.owner.name}</td>
                    </tr>
                    <tr>
                        <td>
                            <a className='footer' href={`mailto:${config.store.contactEmail}`}>
                                {config.store.contactEmail}
                            </a>
                        </td>
                        <td>
                            <a className='footer' href={`tel:${config.store.contactPhone.replace(/ /g, '')}`}>
                                {config.store.contactPhone}
                            </a>
                        </td>
                        <td>{config.owner.businessIdentifier}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Footer;
