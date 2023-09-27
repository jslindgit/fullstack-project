import '../App.css';

import { ChangeEventHandler, useState } from 'react';

import useField from '../hooks/useField';
import itemService from '../services/itemService';

const AddItemForm = () => {
    const name = useField('text');
    const description = useField('text');
    const price = useField('number');
    const instock = useField('number');
    const [message, setMessage] = useState<string>('');

    const inputField = (label: string, type: string, value: string | number, onChange: ChangeEventHandler<HTMLInputElement>) => (
        <>
            <tr>
                <td width='10'>{label}:</td>
                <td>
                    <input type={type} value={value} onChange={onChange} />
                </td>
            </tr>
        </>
    );

    const showMessage = () => {
        if (message && message.length > 0) {
            return (
                <div>
                    <h1>{message}</h1>
                </div>
            );
        }
    };

    const submit = async (event: React.FormEvent) => {
        event.preventDefault();
        const response = await itemService.add({ name: name.value, description: description.value, price: price.value, instock: instock.value });
        setMessage(response);

        name.reset();
        description.reset();
        price.reset();
        instock.reset();
    };

    return (
        <>
            {showMessage()}
            <h2>Add item</h2>
            <form onSubmit={submit}>
                <table>
                    <tbody>
                        <tr>
                            <td width='10'>Name:</td>
                            <td>
                                <input type={name.type} value={name.value} onChange={name.onChange} />
                            </td>
                        </tr>
                        {inputField('Description', description.type, description.value, description.onChange)}
                        {inputField('Price', price.type, price.value, price.onChange)}
                        {inputField('In stock', instock.type, instock.value, instock.onChange)}
                        <tr>
                            <td></td>
                            <td>
                                <button type='submit'>Add</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </>
    );
};

export default AddItemForm;
