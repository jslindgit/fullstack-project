import { useSelector } from 'react-redux';

import { RootState } from '../reducers/rootReducer';

interface Props {
    fontSize?: 'Big' | 'Small';
}

const ShowNotification = ({ fontSize = 'Big' }: Props) => {
    const miscState = useSelector((state: RootState) => state.misc);
    const notification = miscState.notification;

    if (!notification || notification === null) {
        return <></>;
    } else {
        const classFont = fontSize === 'Big' ? 'notificationBig' : 'notificationSmall';
        let classColor;
        switch (notification.tone) {
            case 'Positive':
                classColor = 'notificationPositive';
                break;
            case 'Negative':
                classColor = 'notificationNegative';
                break;
            default:
                classColor = 'notificationNeutral';
        }
        return (
            <>
                <table align='center'>
                    <tbody>
                        <tr>
                            <td className={classColor}>
                                <span className={classFont}>{notification.message}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </>
        );
    }
};

export default ShowNotification;
