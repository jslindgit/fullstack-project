import { imageFilename, imageFullPath } from '../../util/misc';

interface Props {
    images: string[];
    centralized: boolean;
}

const AdminItemImageThumbs = ({ images, centralized }: Props) => {
    return (
        <table align={centralized ? 'center' : 'left'} className='noPadding'>
            <tbody>
                <tr>
                    <td className='noPadding' style={{ padding: 0 }}>
                        {images.map((imgPath) => (
                            <img key={imgPath} src={imageFullPath(imgPath)} className='imgAdminItems' alt={imageFilename(imgPath)} title={imageFilename(imgPath)} />
                        ))}
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export default AdminItemImageThumbs;
