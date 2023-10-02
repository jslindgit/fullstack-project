import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { RootState } from '../reducers/rootReducer';

import format from '../util/format';
import { isNumber } from '../types/type_functions';

const Items = () => {
    const categoryState = useSelector((state: RootState) => state.categories);
    const configState = useSelector((state: RootState) => state.config);
    const miscState = useSelector((state: RootState) => state.misc);

    const navigate = useNavigate();

    const id = Number(useParams().id);
    const category = id && isNumber(id) ? categoryState.find((c) => c.id === id) : undefined;

    useEffect(() => {
        if (miscState.loaded && category === undefined) {
            navigate('/shop');
        }
    }, [category, miscState.loaded, navigate]);

    if (!category) {
        return <></>;
    }
    return (
        <>
            <div>
                <h2>{category.name}</h2>
                <p>{category.description}</p>
                <table align='center'>
                    <tbody>
                        <tr className='bold'>
                            <td>Product</td>
                            <td>Description</td>
                            <td>Price</td>
                            <td>In stock</td>
                        </tr>
                        {category.items.map((item) => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.description}</td>
                                <td>{format.currency(item.price, configState)}</td>
                                <td>{item.instock}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Items;
