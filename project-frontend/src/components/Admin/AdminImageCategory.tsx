import { ImageCategory } from '../../types/types';

import { imageFilename } from '../../util/misc';

import Image from '../Image';

interface Props {
    category: ImageCategory;
}
const AdminImageCategory = ({ category }: Props) => {
    return (
        <>
            <h3 className='adminHeader'>{category.name}</h3>
            <table className='noPadding'>
                <tbody>
                    <tr>
                        {category.imagePaths.map((path) => (
                            <td key={path} width='1px'>
                                <Image path={path} className='imgAdminThumb' alt={path} title={path} />
                                <br />
                                <span className='adminImageCaption'>{imageFilename(path)}</span>
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </>
    );
};

export default AdminImageCategory;
