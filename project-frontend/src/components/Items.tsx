import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { RootState } from '../reducers/rootReducer';

import format from '../util/format';
import { isNumber } from '../types/type_functions';
import { pageWidth } from '../constants';

import ItemsMenu from './ItemsMenu';

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
                <table align='center' width={pageWidth} className='paddingTopBottomOnly'>
                    <tbody>
                        <tr>
                            <td style={{ padding: 0 }}>
                                <ItemsMenu categories={categoryState} />
                            </td>
                        </tr>
                        <tr>
                            <td className='pageHeader' style={{ paddingTop: 'calc(var(--default-padding) * 0.5)', paddingBottom: 0 }}>
                                {category.name}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ paddingTop: 'calc(var(--default-padding) * 2)', paddingBottom: 'calc(var(--default-padding) * 2 + 3px)' }}>{category.description}</td>
                        </tr>
                    </tbody>
                </table>
                <table align='center' className='striped' width={pageWidth}>
                    <tbody>
                        <tr className='bold'>
                            <td>Product</td>
                            <td>Description</td>
                            <td>Price</td>
                            <td className='widthByContent'>In stock</td>
                        </tr>
                        {category.items.map((item) => (
                            <tr key={item.id}>
                                <td>{item.name}</td>
                                <td>{item.description}</td>
                                <td>{format.currency(item.price, configState)}</td>
                                <td className='widthByContent'>{item.instock}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Items;
