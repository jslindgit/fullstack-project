import React, { useState } from 'react';
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
        <div className='grid-container' data-gap='2rem'>
            {currentImages.length + imagesToUpload.length > 0 ? (
                <div className='grid-container left' data-cols='auto 1fr' data-gap='2rem 1rem'>
                    {currentImages.map((path) => (
                        <React.Fragment key={path}>
                            <div>
                                <Image
                                    src={imageFullPath(path)}
                                    className={imagesToRemove.includes(path) ? 'imgAdminItems toRemove' : 'imgAdminItems'}
                                    title={imageFilename(path)}
                                />
                            </div>
                            <div>
                                {imagesToRemove.includes(path) ? (
                                    <>
                                        <span className='strikeThrough'>{imageFilename(path)}</span>
                                        <br />
                                        <button type='button' className='small' onClick={() => setImagesToRemove(imagesToRemove.filter((img) => img !== path))}>
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
                            </div>
                        </React.Fragment>
                    ))}
                    {imagesToUpload.map((imageToUpload) => (
                        <React.Fragment key={imageToUpload.file.name}>
                            <div>
                                <Image src={imageToUpload.dataUrl} className='imgAdminItems new' />
                            </div>
                            <div className='italic'>
                                {imageToUpload.file.name.toString()}
                                <br />
                                <button
                                    type='button'
                                    className='red small'
                                    onClick={() => setImagesToUpload(imagesToUpload.filter((img) => img !== imageToUpload))}
                                >
                                    {contentToText(ContentID.buttonRemove, config)}
                                </button>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            ) : (
                <div>{contentToText(ContentID.adminItemNoImages, config)}.</div>
            )}
            <div className='grid-container' data-gap='1rem'>
                <div className='semiBold'>{contentToText(ContentID.adminItemUploadNewImage, config)}:</div>
                <input type='file' onChange={handleImageChange} className='fileUpload' />
                <button onClick={handleImageUpload} disabled={!imageFile}>
                    {contentToText(ContentID.buttonUpload, config)}
                </button>
            </div>
        </div>
    );
};

export default ItemEditImages;
