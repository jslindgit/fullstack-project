import { useSelector } from 'react-redux';

import { RootState } from '../redux/rootReducer';

const Footer = () => {
    const config = useSelector((state: RootState) => state.config);

    return (
        <div className='footer'>
            <div className='grid-container padding1 pageWidth' data-cols='footer' data-gap='1rem'>
                <div>{config.store.contactName}</div>
                <div>
                    {config.store.contactStreetAddress}&emsp;{config.store.contactZipcode} {config.store.contactCity}
                </div>
                <div>{config.owner.name}</div>
                <div>
                    <a className='footer' href={`mailto:${config.store.contactEmail}`}>
                        {config.store.contactEmail}
                    </a>
                </div>
                <div>
                    <a className='footer' href={`tel:${config.store.contactPhone.replace(/ /g, '')}`}>
                        {config.store.contactPhone}
                    </a>
                </div>
                <div>{config.owner.businessIdentifier}</div>
            </div>{' '}
        </div>
    );
};

export default Footer;
