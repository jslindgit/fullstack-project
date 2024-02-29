import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { ContentID } from '../../content';
import { Item } from '../../types/types';
import { RootState } from '../../reducers/rootReducer';

import { contentToText } from '../../types/languageFunctions';
import { handleError } from '../../util/handleError';
import itemService from '../../services/itemService';
import { pageWidth } from '../../constants';

import ItemEditForm from './ItemEditForm';

const AdminItemEdit = () => {
    const config = useSelector((state: RootState) => state.config);

    const [item, setItem] = useState<Item | undefined>();
    const [loading, setLoading] = useState<string>('Loading...');

    const id = Number(useParams().id);

    // Title:
    useEffect(() => {
        document.title = contentToText(ContentID.adminPanelHeader, config) + ' - ' + contentToText(ContentID.adminEditItem, config);
    }, [config]);

    useEffect(() => {
        const setItemById = () => {
            try {
                itemService.getById(id).then((res) => {
                    setItem(res as Item);
                });
            } catch (err: unknown) {
                handleError(err);
                setLoading(contentToText(ContentID.errorSomethingWentWrong, config) + ' :(');
            }
        };

        setItemById();
    }, [config, id]);

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
        <div style={{ margin: 'auto', width: pageWidth }}>
            <div className='pageHeader'>
                {contentToText(ContentID.adminPanelHeader, config)} - {contentToText(ContentID.adminEditItem, config)}
            </div>
            <ItemEditForm itemToEdit={item} config={config} initialCategories={item.categories.map((c) => c.id)} />
            <br />
        </div>
    );
};

export default AdminItemEdit;
