import { useState } from 'react';

import { imageFullPath } from '../util/misc';

interface ModalProps {
    onClose: () => void;
    path: string;
}

const Modal = ({ onClose, path }: ModalProps) => {
    return (
        <div className='modal-overlay' onClick={onClose}>
            <div className='modal-content'>
                <img src={imageFullPath(path)} />
            </div>
        </div>
    );
};

interface Props {
    alt?: string;
    className: 'imgAdminItems' | 'imgAdminThumb' | 'imgItemDetails' | 'imgShoppingCart';
    path: string;
    title?: string;
}
const Image = ({ alt = '', path, className, title = '' }: Props) => {
    const [showModal, setShowModal] = useState<boolean>(false);

    const handleThumbnailClick = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div>
            <img src={imageFullPath(path)} className={className + ' imgThumb'} onClick={handleThumbnailClick} alt={alt} title={title} />

            {showModal && <Modal onClose={closeModal} path={path} />}
        </div>
    );
};

export default Image;
