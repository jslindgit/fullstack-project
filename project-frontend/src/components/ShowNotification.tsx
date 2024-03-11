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
            <div data-testid={notification.testId ? notification.testId : ''} className={classNames}>
                <div className='grid-container heightFull pageWidth' data-cols='notification'>
                    <div />
                    <div className='grid-container valignMiddle'>{finalMessage}</div>
                    <a className='alignCenter textDecorationNone valignMiddle' onClick={() => close()}>
                        <div className='bold sizeNormal'>✖</div>
                    </a>
                </div>
            </div>
        );
    }
};

export default ShowNotification;
