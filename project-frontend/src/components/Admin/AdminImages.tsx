import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../reducers/rootReducer';

import { handleError } from '../../util/handleError';
import { imageFullPath } from '../../util/misc';
import imageService from '../../services/imageService';
import { pageWidth } from '../../constants';

import { setNotification } from '../../reducers/miscReducer';

const AdminImages = () => {
    const dispatch = useDispatch();
    const usersState = useSelector((state: RootState) => state.users);

    const [images, setImages] = useState<string[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);

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

        const res = await imageService.add(imageFile, 'products', usersState.loggedUser.token);

        dispatch(setNotification({ tone: res.success ? 'Positive' : 'Negative', message: res.message }));
    };

    useEffect(() => {
        imageService
            .getAll()
            .then((data) => {
                console.log('data:', data);
                setImages(data.images);
            })
            .catch((error) => {
                handleError('Error fetching image list:', error);
            });
    }, []);

    return (
        <div>
            <table align='center' width={pageWidth}>
                <tbody>
                    <tr>
                        <td>Total images: {images.length}</td>
                    </tr>
                    <tr>
                        <td>
                            {images.map((filepath) => (
                                <img key={filepath} src={imageFullPath(filepath)} width='150px' height='150px' />
                            ))}
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <input type='file' onChange={handleImageChange} />
                            <button onClick={handleUpload}>Upload Image</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default AdminImages;
