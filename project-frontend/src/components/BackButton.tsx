import localstorageHandler from '../util/localstorageHandler';

import { Link } from './CustomLink';

interface Props {
    label?: string;
    to?: string;
    type: 'button' | 'text';
}

const BackButton = ({ label = 'Go back', to = localstorageHandler.getPreviousLocation(), type }: Props) => (
    <Link to={to}>
        {type === 'button' ? (
            <>
                <button type='button'>{label}</button>
            </>
        ) : (
            <span className='sizeLarge'>← {label}</span>
        )}
    </Link>
);

export default BackButton;
