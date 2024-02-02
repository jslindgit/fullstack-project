import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../reducers/rootReducer';

import { setNotification } from '../reducers/miscReducer';

import { Link } from './CustomLink';

const ShowNotification = () => {
    const miscState = useSelector((state: RootState) => state.misc);
    const notification = miscState.notification;

    const [isActive, setIsActive] = useState<boolean>(false);

    const dispatch = useDispatch();

    const close = () => {
        dispatch(setNotification(null));
    };

    useEffect(() => {
        if (notification && notification !== null) {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [notification]);

    if (!notification || notification === null) {
        return <></>;
    } else {
        let classNames = 'notification' + (isActive ? '' : ' hidden');
        switch (notification.tone) {
            case 'Positive':
                classNames += ' notificationPositive';
                break;
            case 'Negative':
                classNames += ' notificationNegative';
                break;
            default:
                classNames += ' notificationNeutral';
        }

        let finalMessage: JSX.Element;
        if (notification.linkText && notification.linkTo) {
            const parts = notification.message.split(notification.linkText);
            finalMessage = (
                <span>
                    {parts[0]}
                    <Link to={notification.linkTo}>{notification.linkText}</Link>
                    {parts[1]}
                </span>
            );
        } else {
            finalMessage = <span>{notification.message}</span>;
        }

        return (
            <div data-testid={notification.testId ? notification.testId : ''} className={classNames} style={{ position: 'sticky', top: 0 }}>
                <div className='pageWidth' style={{ height: '100%' }}>
                    <div className='grid-container' style={{ gridTemplateColumns: '40px 1fr 40px', height: '100%' }}>
                        <div />
                        <div className='valignMiddle' style={{ display: 'grid' }}>
                            {finalMessage}
                        </div>
                        <a className='alignCenter valignMiddle' onClick={() => close()} style={{ textDecorationLine: 'none' }}>
                            <div className='bold sizeNormal' style={{ width: '100%' }}>
                                ✖
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        );
    }
};

export default ShowNotification;
