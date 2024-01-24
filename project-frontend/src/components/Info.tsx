import { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { ContentID } from '../content';
import { RootState } from '../reducers/rootReducer';

import { contentToText, langTextsToText } from '../types/languageFunctions';
import { pageWidth } from '../constants';

const Info = () => {
    const config = useSelector((state: RootState) => state.config);

    useEffect(() => {
        document.title = contentToText(ContentID.menuInfo, config) + ' | ' + config.store.contactName;
    }, [config]);

    return (
        <>
            <div style={{ margin: 'auto', maxWidth: pageWidth }}>
                <div className='pageHeader'>{contentToText(ContentID.menuInfo, config)}</div>
                <div className='grid-container' style={{ gridTemplateColumns: '47% 1fr 47%' }}>
                    <div className='alignLeft infoBox'>
                        <div className='infoHeader'>{config.store.contactName}</div>
                        <div className='grid-container' data-gap='0.9rem' style={{ gridTemplateColumns: 'min-content auto' }}>
                            <div>{contentToText(ContentID.contactEmail, config)}:</div>
                            <div>
                                <a href={'mailto:' + config.store.contactEmail}>{config.store.contactEmail}</a>
                            </div>
                            <div>{contentToText(ContentID.contactPhone, config)}:</div>
                            <div>
                                <a href={'tel:' + config.store.contactPhone.replace(/ /g, '')}>{config.store.contactPhone}</a>
                            </div>
                            <div>{contentToText(ContentID.miscAddress, config)}:</div>
                            <div>
                                {config.store.contactStreetAddress}
                                <br />
                                {config.store.contactZipcode} {config.store.contactCity}
                                <br />
                                {langTextsToText(config.store.contactCountry.names, config)}
                            </div>
                        </div>
                    </div>
                    <div />
                    <div className='alignLeft infoBox'>
                        <div className='infoHeader'>{contentToText(ContentID.miscMerchant, config)}</div>
                        <div className='semiBold' style={{ marginBottom: '0.9rem' }}>
                            {config.owner.name}
                        </div>
                        <div className='grid-container' data-gap='0.9rem' style={{ gridTemplateColumns: 'min-content auto' }}>
                            <div>{contentToText(ContentID.contactBusinessID, config)}:</div>
                            <div>{config.owner.businessIdentifier}</div>
                            <div>{contentToText(ContentID.contactEmail, config)}:</div>
                            <div>
                                <a href={'mailto:' + config.owner.email}>{config.owner.email}</a>
                            </div>
                            <div>{contentToText(ContentID.contactPhone, config)}:</div>
                            <div>
                                <a href={'tel:' + config.owner.phone.replace(/ /g, '')}>{config.owner.phone}</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Info;
