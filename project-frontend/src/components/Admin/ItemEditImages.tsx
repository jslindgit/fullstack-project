import React from 'react';
import { useSelector } from 'react-redux';

import { Config } from '../../types/configTypes';
import { ContentID } from '../../content';
import { RootState } from '../../redux/rootReducer';

import { handleError } from '../../util/handleError';
import { contentToText } from '../../types/languageFunctions';
import { imageFilename, isValidUrl } from '../../util/misc';
import useField from '../../hooks/useField';

import Image from '../Image';
import InputField from '../InputField';

interface Props {
    config: Config;
    currentImages: string[];
    imagesToAdd: string[];
    imagesToRemove: string[];
    setImagesToAdd: React.Dispatch<React.SetStateAction<string[]>>;
    setImagesToRemove: React.Dispatch<React.SetStateAction<string[]>>;
}
const ItemEditImages = ({ config, currentImages, imagesToAdd, imagesToRemove, setImagesToAdd, setImagesToRemove }: Props) => {
    const userState = useSelector((state: RootState) => state.user);

    const newImageUrl = useField('text', null);

    const handleAddImage = async () => {
        if (!isValidUrl(newImageUrl.stringValue())) {
            return;
        } else if (!userState.loggedUser) {
            handleError('Log in to upload images');
            return;
        }

        if (currentImages.includes(newImageUrl.stringValue()) || imagesToAdd.includes(newImageUrl.stringValue())) {
            alert(contentToText(ContentID.adminItemImageAlreadyAdded, config));
            return;
        }

        setImagesToAdd([...imagesToAdd, newImageUrl.stringValue()]);

        newImageUrl.clear();
    };

    const imageName = (url: string): string => {
        const filename = imageFilename(url);
        return filename.length > 30 ? filename.substring(0, 13) + '...' + filename.substring(filename.length - 13) : filename;
    };

    return (
        <div className='grid-container' data-gap='2rem'>
            {currentImages.length + imagesToAdd.length > 0 ? (
                <div className='grid-container left' data-cols='auto 1fr' data-gap='2rem 1rem'>
                    {currentImages.map((url) => (
                        <React.Fragment key={url}>
                            <div>
                                <Image
                                    src={url}
                                    className={imagesToRemove.includes(url) ? 'imgAdminItems toRemove' : 'imgAdminItems'}
                                    title={url}
                                    alt={url.length > 10 ? url.substring(0, 10) + '...' : imageFilename(url)}
                                />
                            </div>
                            <div>
                                {imagesToRemove.includes(url) ? (
                                    <>
                                        <span className='strikeThrough' title={url}>
                                            {imageName(url)}
                                        </span>
                                        <br />
                                        <button type='button' className='small' onClick={() => setImagesToRemove(imagesToRemove.filter((img) => img !== url))}>
                                            {contentToText(ContentID.buttonRestore, config)}
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <span title={url}>{imageName(url)}</span>
                                        <br />
                                        <button type='button' className='red small' onClick={() => setImagesToRemove([...imagesToRemove, url])}>
                                            {contentToText(ContentID.buttonRemove, config)}
                                        </button>
                                    </>
                                )}
                            </div>
                        </React.Fragment>
                    ))}
                    {imagesToAdd.map((url) => (
                        <React.Fragment key={url}>
                            <div>
                                <Image src={url} className='imgAdminItems new' />
                            </div>
                            <div className='italic'>
                                {imageFilename(url)}
                                <br />
                                <button type='button' className='red small' onClick={() => setImagesToAdd(imagesToAdd.filter((img) => img !== url))}>
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
                <div className='semiBold'>{contentToText(ContentID.adminItemAddNewImage, config)}:</div>
                <InputField useField={newImageUrl} width='100%' placeHolder={contentToText(ContentID.adminItemUrlToImage, config)} />
                <button onClick={handleAddImage} disabled={!isValidUrl(newImageUrl.stringValue())}>
                    {contentToText(ContentID.buttonAdd, config)}
                </button>
            </div>
        </div>
    );
};

export default ItemEditImages;
