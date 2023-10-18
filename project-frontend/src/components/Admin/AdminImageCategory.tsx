import { ImageCategory } from '../../types/types';

import { imageFullPath } from '../../util/misc';

interface Props {
    category: ImageCategory;
}
const AdminImageCategory = ({ category }: Props) => {
    const filename = (path: string): string => {
        const parts = path.split('\\');
        return parts.length > 0 ? parts[parts.length - 1] : '';
    };

    return (
        <>
            <h3 className='adminHeader'>{category.name}</h3>
            <table>
                <tbody>
                    <tr>
                        {category.imagePaths.map((path) => (
                            <td key={path}>
                                <img key={path} src={imageFullPath(path)} className='imgAdminThumb' alt={path} />
                                <br />
                                {filename(path)}
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </>
    );
};

export default AdminImageCategory;
