import { useSelector } from 'react-redux';

import { RootState } from '../reducers/rootReducer';

interface Props {
    fontSize?: number;
}

const ShowNotification = ({ fontSize = 20 }: Props) => {
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
        const style = { fontSize: fontSize + 'pt' };
        return (
            <>
                <table align='center'>
                    <tbody>
                        <tr>
                            <td style={style}>
                                {notification.message}
                                {tone()}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </>
        );
    }
};

export default ShowNotification;
