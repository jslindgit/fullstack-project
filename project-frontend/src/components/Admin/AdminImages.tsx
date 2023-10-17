import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Image, NewImage } from '../../types/types';
import { RootState } from '../../reducers/rootReducer';

import { handleError } from '../../util/handleError';
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
        if (!imageFile || !usersState.loggedUser) return;

        const newImage: NewImage = { filename: imageFile.name, data: await readFileAsBase64(imageFile) };

        const res = await imageService.add(imageFile, usersState.loggedUser.token);

        dispatch(setNotification({ tone: res.success ? 'Positive' : 'Negative', message: res.message }));
    };

    const readFileAsBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target && event.target.result) {
                    resolve(event.target.result.toString().split(',')[1]); // Extract Base64 data
                } else {
                    reject(new Error('Failed to read file as Base64.'));
                }
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsDataURL(file);
        });
    };

    const renderImage = (image: Image): JSX.Element => {
        if ('data' in image) {
            return (
                <>
                    <img src={`data:image/png;base64,${image.data}`} width='150px' height='150px' />
                </>
            );
        } else {
            return <></>;
        }
    };

    useEffect(() => {
        imageService
            .getAll()
            .then((data) => {
                setImages(data);
                console.log(images);
            })
            .catch((error) => {
                console.error('Error fetching image list:', error);
            });
    }, []);

    useEffect(() => {
        imageService
            .getAll()
            .then((imgs) => {
                setImages(imgs);
            })
            .catch((err: unknown) => {
                handleError(err);
            });
    }, []);

    return (
        <div>
            <table align='center' width={pageWidth}>
                <tbody>
                    <tr>
                        <td>Total images: {images.length}</td>
                    </tr>
                    {/*<tr>
                        <td>{images.length > 0 ? renderImage(images[0]) : <></>}</td>
    </tr>*/}
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
