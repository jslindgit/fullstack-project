import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../reducers/rootReducer';

interface Props {
    fontSize?: 'Big' | 'Small';
}

const ShowNotification = ({ fontSize = 'Big' }: Props) => {
    const miscState = useSelector((state: RootState) => state.misc);
    const notification = miscState.notification;

    const [isActive, setIsActive] = useState<boolean>(false);

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
        classNames += fontSize === 'Big' ? ' notificationBig' : ' notificationSmall';
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

        return (
            <div className={classNames}>
                <table align='center'>
                    <tbody>
                        <tr>
                            <td>
                                <span>{notification.message}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
};

export default ShowNotification;
