import localstorageHandler from '../util/localstorageHandler';

import { Link } from './CustomLink';

interface Props {
    type: 'button' | 'text';
}

const BackButton = ({ type }: Props) => (
    <Link to={localstorageHandler.getPreviousLocation()}>
        {type === 'button' ? (
            <>
                <button type='button'>Go back</button>
            </>
        ) : (
            <>Go back</>
        )}
    </Link>
);

export default BackButton;
