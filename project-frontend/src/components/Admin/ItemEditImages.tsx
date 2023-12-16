import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Config } from '../../types/configTypes';
import { ContentID } from '../../content';
import { RootState } from '../../reducers/rootReducer';

import { handleError } from '../../util/handleError';
import imageService from '../../services/imageService';
import { contentToText } from '../../types/languageFunctions';
import { imageFilename } from '../../util/misc';

import { setNotification } from '../../reducers/miscReducer';

import Image from '../Image';

interface Props {
    config: Config;
    selectedImages: string[];
    setSelectedImages: React.Dispatch<React.SetStateAction<string[]>>;
}
const ItemEditImages = ({ config, selectedImages, setSelectedImages }: Props) => {
    const dispatch = useDispatch();
    const userState = useSelector((state: RootState) => state.user);

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [newUploads, setNewUploads] = useState<number>(0);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleImageUpload = async () => {
        if (!imageFile) {
            return;
        } else if (!userState.loggedUser) {
            handleError('Log in to upload images');
            return;
        }

        const imageCategory = 'products';

        const dupecheck = await imageService.getBySubdirAndFilename(imageCategory, imageFile.name);
        const matchFound = dupecheck.success && dupecheck.images.length > 0;

        if (!matchFound || confirm(`Image "${imageFile.name}" already exist in "${imageCategory}" - Do you want to overwrite it?`)) {
            const res = await imageService.add(imageFile, imageCategory, userState.loggedUser.token);

            setSelectedImages([...selectedImages, imageCategory + '\\' + imageFile.name]);
            setNewUploads(newUploads + 1);

            dispatch(setNotification({ tone: res.success ? 'Positive' : 'Negative', message: res.message }));

            setImageFile(null);
        }
    };

    return (
        <>
            <table>
                <tbody>
                    {selectedImages.length > 0 ? (
                        selectedImages.map((path) => (
                            <tr key={path}>
                                <td className='widthByContent'>
                                    <Image path={path} className='imgAdminItems' />
                                </td>
                                <td className='valignMiddleImportant'>{imageFilename(path)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td>{contentToText(ContentID.adminItemNoImages, config)}</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <table>
                <tbody>
                    <tr>
                        <td className='semiBold'>{contentToText(ContentID.adminItemUploadNewImage, config)}</td>
                    </tr>
                    <tr>
                        <td>
                            <input type='file' onChange={handleImageChange} className='fileUpload' />
                            <br />
                            <button onClick={handleImageUpload} disabled={!imageFile} style={{ marginTop: '0.75em' }}>
                                {contentToText(ContentID.buttonUpload, config)}
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    );
};

export default ItemEditImages;
