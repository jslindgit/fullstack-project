import { useSelector } from 'react-redux';

import { RootState } from '../../reducers/rootReducer';
import { ImageCategory } from '../../types/types';

import { langTextsToText } from '../../types/languageFunctions';
import { imageFilename, imageFullPath } from '../../util/misc';

import Image from '../Image';

interface Props {
    category: ImageCategory;
}
const AdminImageCategory = ({ category }: Props) => {
    const config = useSelector((state: RootState) => state.config);

    return (
        <>
            <div className='adminHeader semiBold sizeLarge' style={{ marginTop: 0 }}>
                {langTextsToText(category.name, config)}
            </div>
            <table className='noPadding'>
                <tbody>
                    <tr>
                        <td className='imgFlex'>
                            {category.imagePaths.map((path) => (
                                <div key={path} style={{ marginBottom: '2rem', marginRight: '2rem' }}>
                                    <Image src={imageFullPath(path)} className='imgAdminThumb' title={path} />
                                    <span className='adminImageCaption sizeSmallish' style={{ marginBottom: '5rem' }}>
                                        {imageFilename(path)}
                                    </span>
                                </div>
                            ))}
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    );
};

export default AdminImageCategory;
