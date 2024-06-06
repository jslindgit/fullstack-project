import { Config, Settings } from '../types/configTypes';
import { Response } from '../types/types';

import { settingsFromResBody, settingsToReqBody } from '../util/serviceProvider';
import { isNotNull } from '../types/typeFunctions';

import { apiSlice } from './apiSlice';
import { contentToText } from '../types/languageFunctions';
import { ContentID } from '../content';

interface SettingsResponse extends Response {
    settings: Settings | null;
}

const url = '/settings';

const settingsSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        settingsGetAll: builder.query<Settings[], void>({
            query: () => url,
            providesTags: ['Settings'],
            transformResponse: (res: Settings[]) => {
                return res.map((s) => settingsFromResBody(s)).filter(isNotNull);
            },
        }),
        settingsUpdate: builder.mutation<SettingsResponse, { settings: Settings; propName: string; config: Config }>({
            query: ({ settings }) => {
                return {
                    url: `${url}/${settings.id}`,
                    method: 'PUT',
                    body: settingsToReqBody(settings),
                };
            },
            invalidatesTags: ['Settings'],
            transformResponse: (res: unknown, _meta, arg) => {
                const settings = settingsFromResBody(res);

                if (settings) {
                    return {
                        success: true,
                        message: `${arg.propName} ${contentToText(ContentID.miscUpdated, arg.config)}.`,
                        settings: settings,
                    };
                } else {
                    return {
                        success: false,
                        message: contentToText(ContentID.errorSomethingWentWrong, arg.config),
                        settings: null,
                    };
                }
            },
        }),
    }),
});

export const { useSettingsGetAllQuery } = settingsSlice;
