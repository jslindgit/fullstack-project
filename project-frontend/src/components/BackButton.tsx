import { useSelector } from 'react-redux';

import { ContentID } from '../content';
import { RootState } from '../redux/rootReducer';

import { contentToText } from '../types/languageFunctions';
import localstorageHandler from '../util/localstorageHandler';

import { Link } from './CustomLink';

interface Props {
    labelContentID?: ContentID;
    to?: string;
    type: 'button' | 'text';
    size?: 'sizeNormal' | 'sizeLarge' | 'sizeSmall';
}

const BackButton = ({ labelContentID = ContentID.backButtonDefault, to = localstorageHandler.getPreviousLocation(), type, size = 'sizeLarge' }: Props) => {
    const configState = useSelector((state: RootState) => state.config);

    return (
        <Link to={to}>
            {type === 'button' ? (
                <>
                    <button type='button'>{contentToText(labelContentID, configState)}</button>
                </>
            ) : (
                <span className={size}>← {contentToText(labelContentID, configState)}</span>
            )}
        </Link>
    );
};

export default BackButton;
