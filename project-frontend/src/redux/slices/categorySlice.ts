import { ContentID } from '../../content';
import { Config } from '../../types/configTypes';
import { Category, NewCategory, Response } from '../../types/types';

import { contentToText, langTextsToText } from '../../types/languageFunctions';
import { categoryFromResBody, categoryToReqBody } from '../../util/serviceProvider';
import { isNotNull } from '../../types/typeFunctions';

import { apiSlice, successfulResponse } from './apiSlice';

interface CategoryResponse extends Response {
    addedCategory: Category | null;
}

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
            transformResponse: (res: Category, _meta, arg) => {
                const category = categoryFromResBody(res);
                // prettier-ignore
                return category
                    ? {
                        success: true,
                        message: `${contentToText(ContentID.adminAddNewCategory, arg.config)}: ${langTextsToText(arg.toAdd.name, arg.config)}`,
                        addedCategory: category,
                    }
                    : { success: false, message: contentToText(ContentID.errorSomethingWentWrong, arg.config), addedCategory: null };
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
            transformResponse: (res: unknown, _meta, arg) => {
                // prettier-ignore
                return successfulResponse(res)
                    ? {
                        success: true,
                        message: `${contentToText(ContentID.itemsCategory, arg.config)} '${langTextsToText(arg.toDelete.name, arg.config)}' ${contentToText(
                            ContentID.miscDeleted,
                            arg.config
                        )}.`,
                    }
                    : { success: false, message: contentToText(ContentID.errorSomethingWentWrongTryAgainlater, arg.config) };
            },
        }),
        categoryGetAll: builder.query<Category[], void>({
            query: () => url,
            providesTags: ['Category', 'Item'],
            transformResponse: (res: Category[]) => {
                return res.map((categoryData) => categoryFromResBody(categoryData)).filter(isNotNull);
            },
        }),
        categoryGetById: builder.query<Category | null, number>({
            query: (id) => `${url}/${id}`,
            providesTags: ['Category', 'Item'],
            transformResponse: (res: Category) => {
                return categoryFromResBody(res);
            },
        }),
        categoryUpdate: builder.mutation<CategoryResponse, { category: Category; config: Config }>({
            query: ({ category }) => {
                return {
                    url: `${url}/${category.id}`,
                    method: 'PUT',
                    body: categoryToReqBody(category),
                };
            },
            invalidatesTags: ['Category'],
            transformResponse: (res: Category, _meta, arg) => {
                const category = categoryFromResBody(res);
                // prettier-ignore
                return category
                    ? {
                        success: true,
                        message: `${contentToText(ContentID.itemsCategory, arg.config)} ${contentToText(ContentID.miscUpdated, arg.config)}.`,
                        addedCategory: category,
                    }
                    : {
                        success: false,
                        message: contentToText(ContentID.errorSomethingWentWrongTryAgainlater, arg.config),
                        addedCategory: null,
                    };
            },
        }),
    }),
});

export const { useCategoryAddMutation, useCategoryDeleteMutation, useCategoryGetAllQuery, useCategoryGetByIdQuery, useCategoryUpdateMutation } =
    categoryApiSlice;
