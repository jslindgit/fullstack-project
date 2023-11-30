import { Config } from '../types/configTypes';
import { ContentID } from '../content';
import { User } from '../types/types';

import { contentToText } from '../types/languageFunctions';

interface Props {
    config: Config;
    user: User;
    width: number;
}
const UserOrderHistory = ({ config, user, width }: Props) => {
    return (
        <table align='center' width={width} className='infoBox'>
            <tbody>
                <tr>
                    <td>
                        <div className='infoHeader underlined'>{contentToText(ContentID.accountOrderHistory, config)}</div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <table width='100%' className='headerRow striped'>
                            <tbody>
                                <tr>
                                    <td>{contentToText(ContentID.miscDate, config)}&emsp;&emsp;</td>
                                    <td>{contentToText(ContentID.orderId, config)}&emsp;&emsp;</td>
                                    <td>{contentToText(ContentID.orderItems, config)}&emsp;&emsp;</td>
                                    <td>{contentToText(ContentID.orderTotalAmount, config)}</td>
                                    <td className='widthByContent'>{contentToText(ContentID.orderStatus, config)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export default UserOrderHistory;
