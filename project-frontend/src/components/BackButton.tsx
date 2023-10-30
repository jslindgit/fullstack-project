import localstorageHandler from '../util/localstorageHandler';

import { Link } from './CustomLink';

interface Props {
    to?: string;
    type: 'button' | 'text';
}

const BackButton = ({ to = localstorageHandler.getPreviousLocation(), type }: Props) => (
    <Link to={to}>
        {type === 'button' ? (
            <>
                <button type='button'>Go back</button>
            </>
        ) : (
            <span className='sizeLarge'>← Go back</span>
        )}
    </Link>
);

export default BackButton;
