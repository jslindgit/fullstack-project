import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { ContentID } from '../../content';
import { Item } from '../../types/types';
import { RootState } from '../../reducers/rootReducer';

import { contentToText } from '../../types/languageFunctions';
/*import itemService from '../../services/itemService';*/

import { useItemGetByIdQuery } from '../../services/apiSlice';

import ItemEditForm from './ItemEditForm';

const AdminItemEdit = () => {
    const id = Number(useParams().id);

    const itemGetById = useItemGetByIdQuery(id);

    const config = useSelector((state: RootState) => state.config);

    const [item, setItem] = useState<Item | undefined>();
    const [loading, setLoading] = useState<string>('Loading...');

    // Title:
    useEffect(() => {
        document.title = contentToText(ContentID.adminPanelHeader, config) + ' - ' + contentToText(ContentID.adminEditItem, config);
    }, [config]);

    // Fetch Item:
    useEffect(() => {
        if (itemGetById.data) {
            setItem(itemGetById.data);
        } else {
            setLoading(contentToText(ContentID.errorSomethingWentWrong, config));
        }
    }, [config, itemGetById.data]);

    if (!item) {
        return (
            <div className='sizeLarge'>
                <br />
                {loading}
            </div>
        );
    }

    // prettier-ignore
    return (
        <div className='pageWidth'>
            <div className='pageHeader'>
                {contentToText(ContentID.adminPanelHeader, config)} - {contentToText(ContentID.adminEditItem, config)}
            </div>
            <ItemEditForm itemToEdit={item} config={config} initialCategories={item.categories.map((c) => c.id)} />
            <br />
        </div>
    );
};

export default AdminItemEdit;
