import { ContentID } from '../content';
import { Config } from '../types/configTypes';
import { Category, DeleteResponse, NewCategory, Response } from '../types/types';

import { contentToText, langTextsToText } from '../types/languageFunctions';
import { categoryFromResBody, categoryToReqBody } from '../util/serviceProvider';
import { isNotNull } from '../types/typeFunctions';

import { apiSlice } from './apiSlice';

interface CategoryResponse extends Response {
    addedCategory: Category | null;
}

const transformResponse = (res: Category, successMessage: string, config: Config): CategoryResponse => {
    const category = categoryFromResBody(res);
    if (category) {
        return {
            success: true,
            message: successMessage,
            addedCategory: category,
        };
    } else {
        return { success: false, message: contentToText(ContentID.errorSomethingWentWrongTryAgainlater, config), addedCategory: null };
    }
};

const url = '/categories';

export const categoryApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        categoryAdd: builder.mutation<CategoryResponse, { toAdd: NewCategory; config: Config }>({
            query: ({ toAdd }) => {
                return {
                    url: url,
                    method: 'POST',
                    body: categoryToReqBody(toAdd),
                };
            },
            invalidatesTags: ['Category'],
            transformResponse: (categoryRes: Category, _meta, arg) => {
                return transformResponse(
                    categoryRes,
                    `${contentToText(ContentID.adminAddNewCategory, arg.config)}: ${langTextsToText(arg.toAdd.name, arg.config)}`,
                    arg.config
                );
            },
        }),
        categoryDelete: builder.mutation<Response, { toDelete: Category; config: Config }>({
            query: ({ toDelete }) => {
                return {
                    url: `${url}/${toDelete.id}`,
                    method: 'DELETE',
                };
            },
            invalidatesTags: ['Category'],
            transformResponse: (response: DeleteResponse, _meta, arg) => {
                if (response && response.success) {
                    return {
                        success: true,
                        message: `${contentToText(ContentID.itemsCategory, arg.config)} '${langTextsToText(arg.toDelete.name, arg.config)}' ${contentToText(
                            ContentID.miscDeleted,
                            arg.config
                        )}.`,
                    };
                } else {
                    return { success: false, message: contentToText(ContentID.errorSomethingWentWrongTryAgainlater, arg.config) };
                }
            },
        }),
        categoryGetAll: builder.query<Category[], void>({
            query: () => url,
            providesTags: ['Category'],
            transformResponse: (res: Category[]) => {
                return res.map((categoryData) => categoryFromResBody(categoryData)).filter(isNotNull);
            },
        }),
        categoryGetById: builder.query<Category | null, number>({
            query: (id) => `${url}/${id}`,
            providesTags: ['Category'],
            transformResponse: (res: Category) => {
                return categoryFromResBody(res);
            },
        }),
        categoryUpdate: builder.mutation<CategoryResponse, { categoryId: number; propsToUpdate: object; config: Config }>({
            query: ({ categoryId, propsToUpdate }) => {
                return {
                    url: `${url}/${categoryId}`,
                    method: 'PUT',
                    body: propsToUpdate,
                };
            },
            invalidatesTags: ['Category'],
            transformResponse: (orderRes: Category, _meta, arg) => {
                return transformResponse(
                    orderRes,
                    `${contentToText(ContentID.itemsCategory, arg.config)} ${contentToText(ContentID.miscUpdated, arg.config)}.`,
                    arg.config
                );
            },
        }),
    }),
});

export const { useCategoryAddMutation, useCategoryDeleteMutation, useCategoryGetAllQuery, useCategoryGetByIdQuery, useCategoryUpdateMutation } =
    categoryApiSlice;
