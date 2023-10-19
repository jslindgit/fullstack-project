import { imageFilename, imageFullPath } from '../../util/misc';

interface Props {
    images: string[];
}

const AdminItemImageThumbsSmall = ({ images }: Props) => (
    <>
        {images.map((img) => (
            <img key={img} src={imageFullPath(img)} className='imgAdminItems' alt={imageFilename(img)} title={imageFilename(img)} />
        ))}
    </>
);

export default AdminItemImageThumbsSmall;
