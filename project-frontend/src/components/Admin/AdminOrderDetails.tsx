import { Order } from '../../types/orderTypes';

interface Props {
    order: Order;
}

const AdminOrderDetails = ({ order }: Props) => {
    return (
        <tr>
            <td colSpan={6}>
                <table align='center' width='100%'>
                    <tbody>
                        <tr>
                            <td>
                                Print order
                                <br />
                                Mark as delivered
                            </td>
                        </tr>
                        <tr>
                            <td>Webstore order {order.id}</td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    );
};

export default AdminOrderDetails;
