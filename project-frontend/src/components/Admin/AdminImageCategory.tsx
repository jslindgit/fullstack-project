import { ImageCategory } from '../../types/types';

import { imageFilename, imageFullPath } from '../../util/misc';

interface Props {
    category: ImageCategory;
}
const AdminImageCategory = ({ category }: Props) => {
    return (
        <>
            <h3 className='adminHeader'>{category.name}</h3>
            <table>
                <tbody>
                    <tr>
                        {category.imagePaths.map((path) => (
                            <td key={path}>
                                <img key={path} src={imageFullPath(path)} className='imgAdminThumb' alt={path} title={path} />
                                <br />
                                {imageFilename(path)}
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </>
    );
};

export default AdminImageCategory;
