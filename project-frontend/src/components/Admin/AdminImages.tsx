import { useEffect, useState } from 'react';

import { LangCode } from '../../types/languageTypes';
import { ImageCategory } from '../../types/types';

import { handleError } from '../../util/handleError';
import imageService from '../../services/imageService';

import AdminImageCategory from './AdminImageCategory';

const AdminImages = () => {
    const [images, setImages] = useState<ImageCategory[]>([]);

    useEffect(() => {
        const imageCategories: ImageCategory[] = [
            {
                directory: 'misc',
                name: [
                    { langCode: LangCode.EN, text: 'Misc' },
                    { langCode: LangCode.FI, text: 'Sekalaiset' },
                ],
                imagePaths: [],
            },
            {
                directory: 'products',
                name: [
                    { langCode: LangCode.EN, text: 'Products' },
                    { langCode: LangCode.FI, text: 'Tuotekuvat' },
                ],
                imagePaths: [],
            },
        ];

        const fetchImages = async () => {
            await Promise.all(
                imageCategories.map(async (imgCat) => {
                    const res = await imageService.getBySubDir(imgCat.directory);
                    if (res.success) {
                        imgCat.imagePaths = [...res.images];
                    } else {
                        handleError(res.message);
                    }
                })
            );
            setImages(imageCategories);
        };

        fetchImages();
    }, []);

    return (
        <div>
            <table align='center' width='100%'>
                <tbody>
                    <tr>
                        <td style={{ paddingTop: 0 }}>
                            {images.map((imgCat) => (
                                <AdminImageCategory key={imgCat.directory} category={imgCat} />
                            ))}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default AdminImages;
