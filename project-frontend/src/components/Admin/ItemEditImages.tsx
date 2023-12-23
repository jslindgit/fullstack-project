import { useState } from 'react';
import { useSelector } from 'react-redux';

import { Config } from '../../types/configTypes';
import { ContentID } from '../../content';
import { ImageToUpload } from './ItemEditForm';
import { RootState } from '../../reducers/rootReducer';

import { handleError } from '../../util/handleError';
import imageService from '../../services/imageService';
import { contentToText } from '../../types/languageFunctions';
import { imageFilename, imageFullPath } from '../../util/misc';

import Image from '../Image';

interface Props {
    config: Config;
    currentImages: string[];
    imagesToRemove: string[];
    imagesToUpload: ImageToUpload[];
    setImagesToRemove: React.Dispatch<React.SetStateAction<string[]>>;
    setImagesToUpload: React.Dispatch<React.SetStateAction<ImageToUpload[]>>;
}
const ItemEditImages = ({ config, currentImages, imagesToRemove, imagesToUpload, setImagesToRemove, setImagesToUpload }: Props) => {
    const userState = useSelector((state: RootState) => state.user);

    const [imageFile, setImageFile] = useState<File | null>(null);

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

        if (!matchFound || confirm(`Image "${imageFile.name}" already exists - Do you want to overwrite it?`)) {
            if (!imagesToUpload.find((i) => i.file === imageFile)) {
                const reader = new FileReader();

                reader.onloadend = () => {
                    setImagesToUpload([...imagesToUpload, { file: imageFile, dataUrl: reader.result as string }]);
                };

                reader.readAsDataURL(imageFile);
            }

            setImageFile(null);
        }
    };

    return (
        <>
            <table>
                <tbody>
                    {currentImages.length + imagesToUpload.length > 0 ? (
                        <>
                            {currentImages.map((path) => (
                                <tr key={path}>
                                    <td className='widthByContent'>
                                        <Image
                                            src={imageFullPath(path)}
                                            className={imagesToRemove.includes(path) ? 'imgAdminItems toRemove' : 'imgAdminItems'}
                                            title={imageFilename(path)}
                                        />
                                    </td>
                                    <td className='valignMiddleImportant'>
                                        {imagesToRemove.includes(path) ? (
                                            <>
                                                <span className='strikeThrough'>{imageFilename(path)}</span>
                                                <br />
                                                <button
                                                    type='button'
                                                    className='small'
                                                    onClick={() => setImagesToRemove(imagesToRemove.filter((img) => img !== path))}
                                                >
                                                    {contentToText(ContentID.buttonRestore, config)}
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                {imageFilename(path)}
                                                <br />
                                                <button type='button' className='red small' onClick={() => setImagesToRemove([...imagesToRemove, path])}>
                                                    {contentToText(ContentID.buttonRemove, config)}
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {imagesToUpload.map((imageToUpload) => (
                                <tr key={imageToUpload.file.name}>
                                    <td className='widthByContent'>
                                        <Image src={imageToUpload.dataUrl} className='imgAdminItems new' />
                                    </td>
                                    <td className='italic valignMiddleImportant'>
                                        {imageToUpload.file.name.toString()}
                                        <br />
                                        <span className='semiBold sizeSmall'>UUSI &nbsp;</span>
                                        <button
                                            type='button'
                                            className='red small'
                                            onClick={() => setImagesToUpload(imagesToUpload.filter((img) => img !== imageToUpload))}
                                        >
                                            {contentToText(ContentID.buttonRemove, config)}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </>
                    ) : (
                        <tr>
                            <td>{contentToText(ContentID.adminItemNoImages, config)}.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <table>
                <tbody>
                    <tr>
                        <td className='semiBold'>{contentToText(ContentID.adminItemUploadNewImage, config)}:</td>
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
