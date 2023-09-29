import { useSelector } from 'react-redux';

import { RootState } from '../reducers/root_reducer';

const ShowNotification = () => {
    const miscState = useSelector((state: RootState) => state.misc);
    const notification = miscState.notification;

    const tone = () => {
        if (!notification || notification.tone === 'Neutral') {
            return '';
        } else {
            return notification.tone === 'Positive' ? ' :)' : ' :(';
        }
    };

    if (!notification || notification === null) {
        return <></>;
    } else {
        return (
            <>
                <table align='center'>
                    <tbody>
                        <tr>
                            <td>
                                <h2>
                                    {notification.message}
                                    {tone()}
                                </h2>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </>
        );
    }
};

export default ShowNotification;
