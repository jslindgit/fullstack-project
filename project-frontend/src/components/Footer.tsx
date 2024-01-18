import { useSelector } from 'react-redux';

import { RootState } from '../reducers/rootReducer';

import { pageWidth } from '../constants';

const Footer = () => {
    const config = useSelector((state: RootState) => state.config);

    return (
        <div className='footer'>
            <div
                className='grid-container'
                data-gap='1rem'
                style={{ gridTemplateColumns: '1fr 1fr auto', margin: 'auto', padding: '1rem', maxWidth: pageWidth }}
            >
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
