import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ChangeEventHandler } from 'react';

import { Item } from '../../types/types';
import { RootState } from '../../reducers/rootReducer';

import format from '../../util/format';
import useField from '../../hooks/useField';

interface Props {
    item: Item;
    isEdited: boolean;
    deleteItem: (item: Item) => void;
    editItem: (item: Item) => void;
}

const AdminItem = ({ item, isEdited, deleteItem, editItem }: Props) => {
    const configState = useSelector((state: RootState) => state.config);

    const name = useField('text');
    const description = useField('text');
    const price = useField('number');
    const instock = useField('number');

    const inputField = (type: string, value: string | number, onChange: ChangeEventHandler<HTMLInputElement>) => (
        <>
            <input type={type} value={value} onChange={onChange} />
        </>
    );

    useEffect(() => {
        name.setNewValue(item.name);
        description.setNewValue(item.description);
        price.setNewValue(Number(item.price));
        instock.setNewValue(item.instock);
    }, []);

    if (isEdited) {
        return (
            <tr>
                <td>{inputField(name.type, name.value, name.onChange)}</td>
                <td>{inputField(description.type, description.value, description.onChange)}</td>
                <td>{inputField(price.type, price.value, price.onChange)}</td>
                <td>{inputField(instock.type, instock.value, instock.onChange)}</td>
                <td>{item.id}</td>
                <td>
                    <button>Save</button>
                </td>
                <td>
                    <button className='red' onClick={() => deleteItem(item)}>
                        Delete
                    </button>
                </td>
            </tr>
        );
    } else {
        return (
            <tr>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{format.currency(item.price, configState)}</td>
                <td>{item.instock}</td>
                <td>{item.id}</td>
                <td>
                    <button onClick={() => editItem(item)}>Edit</button>
                </td>
                <td>
                    <button className='red' onClick={() => deleteItem(item)}>
                        Delete
                    </button>
                </td>
            </tr>
        );
    }
};

export default AdminItem;
