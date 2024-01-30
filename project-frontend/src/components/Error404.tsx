import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { ContentID } from '../content';
import { RootState } from '../reducers/rootReducer';

import { contentToText } from '../types/languageFunctions';

const Error404 = () => {
    const config = useSelector((state: RootState) => state.config);

    const navigate = useNavigate();

    useEffect(() => {
        navigate('/');
    }, [navigate]);

    return <div className='semiBold sizeVeryLarge'>{contentToText(ContentID.misc404, config)}</div>;
};

export default Error404;
