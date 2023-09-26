import '../App.css';

import { useState } from 'react';

import itemService from '../services/itemService';

const AddItemForm = () => {
    const [name, setName] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [price, setPrice] = useState<number>(0);
    const [instock, setInstock] = useState<number>(0);
    const [message, setMessage] = useState<string>('');

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
        const response = await itemService.add(); // TODO: <- new item as props
        setMessage(response);

        setName('');
        setDescription('');
        setPrice(0);
        setInstock(0);
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
                                <input value={name} onChange={({ target }) => setName(target.value)} />
                            </td>
                        </tr>
                        <tr>
                            <td width='10'>Description:</td>
                            <td>
                                <input value={description} onChange={({ target }) => setDescription(target.value)} />
                            </td>
                        </tr>
                        <tr>
                            <td width='10'>Price:</td>
                            <td>
                                <input type='number' value={price} onChange={({ target }) => setPrice(Number(target.value))} />
                            </td>
                        </tr>
                        <tr>
                            <td width='10'>Name:</td>
                            <td>
                                <input type='number' value={instock} onChange={({ target }) => setInstock(Number(target.value))} />
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>
                                <button type='submit'>Login</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </>
    );
};

export default AddItemForm;
