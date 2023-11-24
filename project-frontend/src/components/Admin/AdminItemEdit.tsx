import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { ContentID } from '../../content';
import { Item } from '../../types/types';
import { RootState } from '../../reducers/rootReducer';
import { UseField } from '../../hooks/useField';
import { UseTextArea } from '../../hooks/useTextArea';

import { setNotification } from '../../reducers/miscReducer';

import { contentToText, langTextsToText, useLangFields, useLangTextAreas } from '../../types/languageFunctions';
import { handleError } from '../../util/handleError';
import { imageFilename, imageFullPath } from '../../util/misc';
import item_categoryService from '../../services/item_categoryService';
import imageService from '../../services/imageService';
import itemService from '../../services/itemService';
import { pageWidth } from '../../constants';
import useField from '../../hooks/useField';

import BackButton from '../BackButton';

const AdminItemEdit = () => {
    const dispatch = useDispatch();
    const categoriesState = useSelector((state: RootState) => state.categories);
    const config = useSelector((state: RootState) => state.config);
    const usersState = useSelector((state: RootState) => state.users);

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [images, setImages] = useState<string[]>([]);
    const [item, setItem] = useState<Item | undefined>();
    const [loading, setLoading] = useState<string>('Loading...');
    const [newUploads, setNewUploads] = useState<number>(0);
    const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);

    const [categoriesChanged, setCategoriesChanged] = useState<boolean>(false);

    const descriptionFields = useLangTextAreas();
    const instock = useField('integer');
    const nameFields = useLangFields('text');
    const price = useField('decimal');

    const id = Number(useParams().id);

    const fetchImages = async () => {
        const res = await imageService.getBySubDir('products');
        if (res.success) {
            setImages(res.images);
        } else {
            handleError(res.message);
        }
    };

    const setItemById = () => {
        try {
            itemService.getById(id).then((res) => {
                setItem(res as Item);
            });
        } catch (err: unknown) {
            handleError(err);
            setLoading('Something went wrong :(');
        }
    };

    useEffect(() => {
        fetchImages();
    }, [newUploads]);

    useEffect(() => {
        setItemById();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {
        if (item) {
            setSelectedImages(item.images);
        }
    }, [item]);

    useEffect(() => {
        if (item) {
            nameFields.forEach((nf) => {
                const nameLangText = item.name.find((langText) => langText.langCode === nf.langCode);
                nf.field.setNewValue(nameLangText ? nameLangText.text : '');
            });
            descriptionFields.forEach((df) => {
                const descriptionLangText = item.description.find((langText) => langText.langCode === df.langCode);
                df.textArea.setNewValue(descriptionLangText ? descriptionLangText.text : '');
            });
            instock.setNewValue(item.instock.toString());
            price.setNewValue(item.price.toString());

            setSelectedCategories(
                item.categories.map((i) => {
                    return i.id;
                })
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item]);

    const changesMade = () => {
        let result = false;

        if (item) {
            if (
                item.price.toString() !== price.value.toString() ||
                item.instock.toString() !== instock.value.toString() ||
                categoriesChanged ||
                selectedImages !== item.images
            ) {
                result = true;
            }
            nameFields.forEach((nf) => {
                if (nf.field.value !== item.name.find((langText) => langText.langCode === nf.langCode)?.text) {
                    result = true;
                }
            });
            descriptionFields.forEach((df) => {
                if (df.textArea.value !== item.description.find((langText) => langText.langCode === df.langCode)?.text) {
                    result = true;
                }
            });
        }

        return result;
    };

    const getInputField = (label: string, field: UseField, width: string = '100%') => (
        <tr key={label}>
            <td width='1px' className='adminEditLangCode' style={{ paddingLeft: '1rem', paddingRight: 0 }}>
                {label}
            </td>
            <td>
                <input type={field.type} value={field.value} onChange={field.onChange} style={{ width: width }} />
            </td>
        </tr>
    );

    const getTextArea = (label: string, textArea: UseTextArea) => (
        <tr key={label}>
            <td width='1px' className='adminEditLangCode' style={{ paddingLeft: '1rem', paddingRight: 0 }}>
                {label}
            </td>
            <td>
                <textarea value={textArea.value} onChange={textArea.onChange} style={{ width: '100%', height: '7rem' }} />
            </td>
        </tr>
    );

    const handleCategoryChange = (categoryId: number) => {
        setCategoriesChanged(true);

        const updatedCategories = [...selectedCategories];

        if (updatedCategories.includes(categoryId)) {
            const index = updatedCategories.indexOf(categoryId);
            updatedCategories.splice(index, 1);
        } else {
            updatedCategories.push(categoryId);
        }
        setSelectedCategories(updatedCategories);
    };

    const handleImageSelect = (image: string) => (_event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {
        if (selectedImages.includes(image)) {
            setSelectedImages(selectedImages.filter((img) => img !== image));
        } else {
            setSelectedImages(selectedImages.concat(image));
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleImageUpload = async () => {
        if (!imageFile) {
            handleError('Provide image file');
            return;
        } else if (!usersState.loggedUser) {
            handleError('Log in');
            return;
        }

        const imageCategory = 'products';

        const dupecheck = await imageService.getBySubdirAndFilename(imageCategory, imageFile.name);
        const matchFound = dupecheck.success && dupecheck.images.length > 0;

        if (!matchFound || confirm(`Image "${imageFile.name}" already exist in "${imageCategory}" - Do you want to overwrite it?`)) {
            const res = await imageService.add(imageFile, imageCategory, usersState.loggedUser.token);

            setImageFile(null);
            setNewUploads(newUploads + 1);

            dispatch(setNotification({ tone: res.success ? 'Positive' : 'Negative', message: res.message }));
        }
    };

    const sortImages = (a: string, b: string): number => {
        if (selectedImages.includes(a) && selectedImages.includes(b)) {
            return 0;
        } else if (selectedImages.includes(a)) {
            return -1;
        } else if (selectedImages.includes(b)) {
            return 1;
        } else {
            return 0;
        }
    };

    const submit = async () => {
        if (item && changesMade()) {
            if (usersState.loggedUser && usersState.loggedUser.admin && usersState.loggedUser.token) {
                const token = usersState.loggedUser.token;

                const updatedItem: Item = {
                    ...item,
                    description: descriptionFields.map((df) => ({ langCode: df.langCode, text: df.textArea.value.toString() })),
                    instock: Number(instock.value),
                    images: selectedImages,
                    name: nameFields.map((nf) => ({ langCode: nf.langCode, text: nf.field.value.toString() })),
                    price: Number(price.value),
                };

                // Add connections between the edited Item and the selected Categories that are not yet connected to the Item:
                selectedCategories.forEach(async (selected) => {
                    const category = categoriesState.find((c) => {
                        return c.id === selected;
                    });
                    if (category && item.categories.includes(category) === false) {
                        const res = await item_categoryService.addConnection(item, category, token);
                        if (!res.success) {
                            handleError(new Error(res.message));
                        }
                    }
                });

                // Remove connections between the edited Item and Categories that are not selected and currently connected to the Item:
                const toRemove = item.categories.filter((c) => {
                    if (selectedCategories.includes(c.id) === false) {
                        return c;
                    }
                });
                toRemove.forEach(async (c) => {
                    const res = await item_categoryService.deleteConnection(item.id, c.id, token);
                    if (!res.success) {
                        handleError(new Error(res.message));
                    } else {
                        console.log(res);
                    }
                });

                // Update the other info (name, description, etc):
                const res = await itemService.update(updatedItem, usersState.loggedUser.token, config, dispatch);

                dispatch(setNotification({ tone: res.success ? 'Positive' : 'Negative', message: res.message }));

                setItemById();
                setSelectedImages([]);
            } else {
                handleError(new Error('Missing token'));
            }
        }
    };

    if (!usersState.loggedUser?.admin) {
        return (
            <div>
                <br />
                Error: 403
            </div>
        );
    }

    if (!item) {
        return (
            <>
                <br />
                <h4>{loading}</h4>
            </>
        );
    }

    // prettier-ignore
    return (
        <div>
            <table align='center' width={pageWidth}>
                <tbody>
                    <tr>
                        <td className='pageHeader'>
                            {contentToText(ContentID.adminPanelHeader, config)} - {contentToText(ContentID.adminEditItem, config)}
                        </td>
                        <td className='alignRight'>
                            <button type='button' onClick={submit} disabled={!changesMade()}>
                                {contentToText(ContentID.buttonSave, config)}
                            </button>
                            &emsp;
                            <BackButton type='button' />
                        </td>
                    </tr>
                </tbody>
            </table>
            <table align='center' width={pageWidth} className='itemDetails'>
                <tbody>
                    <tr>
                        <td colSpan={3} className='alignCenter colorGray sizeLarge'>
                            {langTextsToText(item.name, config)}
                        </td>
                    </tr>
                    <tr>
                        <td style={{ padding: 0 }}>
                            <table width='100%'>
                                <tbody>
                                    <tr>
                                        <td colSpan={2} className='adminItemEditLabel'>
                                            {contentToText(ContentID.miscName, config)}:
                                        </td>
                                    </tr>
                                    {nameFields.map((nf) => getInputField(nf.langCode.toString(), nf.field))}
                                    <tr>
                                        <td colSpan={2} className='adminItemEditLabel'>
                                            {contentToText(ContentID.miscDescription, config)}:
                                        </td>
                                    </tr>
                                    {descriptionFields.map((nf) => getTextArea(nf.langCode.toString(), nf.textArea))}
                                    <tr>
                                        <td colSpan={2} className='adminItemEditLabel'>
                                            {contentToText(ContentID.itemsPrice, config)}:
                                        </td>
                                    </tr>
                                    {getInputField(config.currency, price, '33%')}
                                    <tr>
                                        <td colSpan={2} className='adminItemEditLabel'>
                                            {contentToText(ContentID.itemsInStock, config)}:
                                        </td>
                                    </tr>
                                    {getInputField(contentToText(ContentID.itemsPcs, config), instock, '33%')}
                                    <tr>
                                        <td colSpan={2} width='1px'>
                                            <button type='button' onClick={submit} disabled={!changesMade()}>
                                                {contentToText(ContentID.buttonSave, config)}
                                            </button>
                                            &emsp;
                                            <BackButton type='button' />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                        <td width='10%'></td>
                        <td width='40%' className='valignTop' style={{ maxWidth: '40%', padding: 0 }}>
                            <table width='100%'>
                                <tbody>
                                    <tr>
                                        <td className='adminItemEditLabel'>{contentToText(ContentID.adminPanelCategories, config)}:</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            {categoriesState.map((c) => (
                                                <button
                                                    key={c.id}
                                                    type='button'
                                                    className={'selectButton ' + (selectedCategories.includes(c.id) ? 'selectButtonTrue' : 'selectButtonFalse')}
                                                    onClick={() => handleCategoryChange(c.id)}
                                                >
                                                    {langTextsToText(c.name, config)}
                                                </button>
                                            ))}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='adminItemEditLabel'>{contentToText(ContentID.adminPanelImages, config)}:</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input type='file' onChange={handleImageChange} className='fileUpload' />
                                            <br />
                                            <button onClick={handleImageUpload} disabled={!imageFile} style={{ marginTop: '0.75em'}}>
                                                {contentToText(ContentID.buttonUpload, config)}
                                            </button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='imgFlex'>
                                            {images
                                                .sort()
                                                .sort(sortImages)
                                                .map((imgPath) => (
                                                    <img
                                                        key={imgPath}
                                                        src={imageFullPath(imgPath)}
                                                        onClick={handleImageSelect(imgPath)}
                                                        className={'imgAdminItems' + (selectedImages.includes(imgPath) ? ' imgSelected' : '')}
                                                        alt={imageFilename(imgPath)}
                                                        title={imageFilename(imgPath)}
                                                    />
                                                ))}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='semiBold' style={{ paddingBottom: 0 }}>
                                            {contentToText(ContentID.adminItemSelectedImages, config)}:
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ paddingTop: '0.5rem' }}>
                                            {selectedImages.map((img) => (
                                                <span key={img}>
                                                    {imageFilename(img)}
                                                    <br />
                                                </span>
                                            ))}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default AdminItemEdit;
