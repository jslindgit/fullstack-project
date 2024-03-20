import { useState } from 'react';

interface ModalProps {
    onClose: () => void;
    src: string;
}

const Modal = ({ onClose, src }: ModalProps) => {
    return (
        <div className='modal-overlay' onClick={onClose}>
            <div className='modal-content'>
                <img src={src} />
            </div>
        </div>
    );
};

interface Props {
    alt?: string | null;
    className: 'imgAdminItems' | 'imgAdminItems new' | 'imgAdminItems toRemove' | 'imgAdminThumb' | 'imgItemDetails' | 'imgShoppingCart';
    src: string;
    title?: string;
}
const Image = ({ alt = null, className, src, title = '' }: Props) => {
    const [showModal, setShowModal] = useState<boolean>(false);

    const handleThumbnailClick = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div>
            <img src={src} className={className + ' imgThumb'} onClick={handleThumbnailClick} alt={alt ? alt : title} title={title} />

            {showModal && <Modal onClose={closeModal} src={src} />}
        </div>
    );
};

export default Image;
