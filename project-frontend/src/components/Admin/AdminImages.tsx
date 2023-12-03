import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ContentID } from '../../content';
import { RootState } from '../../reducers/rootReducer';
import { ImageCategory } from '../../types/types';

import { handleError } from '../../util/handleError';
import imageService from '../../services/imageService';
import { contentToText } from '../../types/languageFunctions';
import { imageCategories } from '../../util/misc';

import { setNotification } from '../../reducers/miscReducer';

import AdminImageCategory from './AdminImageCategory';

const AdminImages = () => {
    const dispatch = useDispatch();
    const config = useSelector((state: RootState) => state.config);
    const usersState = useSelector((state: RootState) => state.user);

    const [imageCategory, setImageCategory] = useState<string>(imageCategories[0]);
    const [images, setImages] = useState<ImageCategory[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [newUploads, setNewUploads] = useState<number>(0);

    const fetchImages = async () => {
        const categories: ImageCategory[] = [];

        await Promise.all(
            imageCategories.map(async (imgCat) => {
                const res = await imageService.getBySubDir(imgCat);
                if (res.success) {
                    categories.push({ name: imgCat, imagePaths: res.images });
                } else {
                    handleError(res.message);
                }
            })
        );
        setImages(categories);
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setImageCategory(e.target.value);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!imageFile) {
            handleError('Provide image file');
            return;
        } else if (!usersState.loggedUser) {
            handleError('Log in');
            return;
        }

        const dupecheck = await imageService.getBySubdirAndFilename(imageCategory, imageFile.name);
        const matchFound = dupecheck.success && dupecheck.images.length > 0;

        if (
            !matchFound ||
            confirm(
                `"${imageCategory}" ${contentToText(ContentID.adminImagesAlreadyContainsFile, config)} "${imageFile.name}" - ${contentToText(
                    ContentID.adminImagesDoYouWantToOverwrite,
                    config
                )}`
            )
        ) {
            const res = await imageService.add(imageFile, imageCategory, usersState.loggedUser.token);

            setImageFile(null);
            setNewUploads(newUploads + 1);

            dispatch(setNotification({ tone: res.success ? 'Positive' : 'Negative', message: res.message }));
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    useEffect(() => {
        fetchImages();
    }, [newUploads]);

    return (
        <div>
            <table align='center' width='100%'>
                <tbody>
                    <tr>
                        <td className='itemDetails' style={{ paddingLeft: '2rem', paddingRight: '2rem', paddingTop: 0 }}>
                            <table width='100%'>
                                <tbody>
                                    <tr>
                                        <td width='1px' className='noWrap semiBold sizeLarge' style={{ paddingLeft: 0 }}>
                                            {contentToText(ContentID.adminImagesUploadNewImageToCategory, config)}:
                                        </td>
                                        <td>
                                            <select value={imageCategory} onChange={handleCategoryChange} className='capitalize'>
                                                {imageCategories.map((cat) => (
                                                    <option key={cat} value={cat}>
                                                        {cat}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <input type='file' onChange={handleImageChange} className='fileUpload' />
                            <br />
                            <br />
                            <button onClick={handleUpload} disabled={!imageFile}>
                                {contentToText(ContentID.buttonUpload, config)}
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {images.map((imgCat) => (
                                <AdminImageCategory key={imgCat.name} category={imgCat} />
                            ))}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default AdminImages;
