import { useSelector } from 'react-redux';

import { ContentID } from '../content';
import { RootState } from '../reducers/rootReducer';

import { contentToText } from '../types/languageFunctions';
import localstorageHandler from '../util/localstorageHandler';

import { Link } from './CustomLink';

interface Props {
    labelContentID?: ContentID;
    to?: string;
    type: 'button' | 'text';
}

const BackButton = ({ labelContentID = ContentID.backButtonDefault, to = localstorageHandler.getPreviousLocation(), type }: Props) => {
    const configState = useSelector((state: RootState) => state.config);

    return (
        <Link to={to}>
            {type === 'button' ? (
                <>
                    <button type='button'>{contentToText(labelContentID, configState)}</button>
                </>
            ) : (
                <span className='sizeLarge e'>← {contentToText(labelContentID, configState)}</span>
            )}
        </Link>
    );
};

export default BackButton;
