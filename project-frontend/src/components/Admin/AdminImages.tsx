import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { Image, NewImage } from '../../types/types';
import { RootState } from '../../reducers/rootReducer';

import { handleError } from '../../util/handleError';
import imageService from '../../services/imageService';
import { pageWidth } from '../../constants';

const AdminImages = () => {
    const usersState = useSelector((state: RootState) => state.users);

    const [images, setImages] = useState<Image[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!imageFile || !usersState.loggedUser) return;

        const newImage: NewImage = { filename: imageFile.name, data: await readFileAsBuffer(imageFile) };

        console.log('newImage:', newImage);

        const res = await imageService.add(newImage, usersState.loggedUser.token);

        console.log('res:', res);
    };

    const readFileAsBuffer = (file: File): Promise<Uint8Array> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target && event.target.result instanceof ArrayBuffer) {
                    const arrayBuffer = event.target.result;
                    const uint8Array = new Uint8Array(arrayBuffer);
                    resolve(uint8Array);
                } else {
                    reject(new Error('Failed to read file as Uint8Array.'));
                }
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsArrayBuffer(file);
        });
    };

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
