import { Config, Settings } from '../../types/configTypes';
import { Response } from '../../types/types';

import { settingsFromResBody, settingsToReqBody } from '../../util/serviceProvider';
import { isNotNull } from '../../types/typeFunctions';

import { apiSlice } from './apiSlice';
import { contentToText } from '../../types/languageFunctions';
import { ContentID } from '../../content';

interface SettingsResponse extends Response {
    settings: Settings | null;
}

const url = '/settings';

const settingsSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        settingsAdd: builder.mutation<SettingsResponse, { toAdd: Settings; config: Config }>({
            query: ({ toAdd }) => {
                return {
                    url: url,
                    method: 'POST',
                    body: settingsToReqBody(toAdd),
                };
            },
            invalidatesTags: ['Settings'],
            transformResponse: (res: unknown, _meta, arg) => {
                const settings = settingsFromResBody(res);
                return settings
                    ? { success: true, message: 'Ok', settings: settings }
                    : { success: false, message: contentToText(ContentID.errorSomethingWentWrong, arg.config), settings: null };
            },
        }),
        settingsGetAll: builder.query<Settings[], void>({
            query: () => url,
            providesTags: ['Settings'],
            transformResponse: (res: Settings[]) => {
                return res.map((s) => settingsFromResBody(s)).filter(isNotNull);
            },
        }),
        settingsUpdate: builder.mutation<SettingsResponse, { currentSettings: Settings; newSettings: Settings; config: Config }>({
            query: ({ currentSettings, newSettings }) => {
                return {
                    url: `${url}/${currentSettings.id}`,
                    method: 'PUT',
                    body: settingsToReqBody(newSettings),
                };
            },
            invalidatesTags: ['Settings'],
            transformResponse: (res: unknown, _meta, arg) => {
                const settings = settingsFromResBody(res);

                if (settings) {
                    return {
                        success: true,
                        message: `${contentToText(ContentID.adminPanelSettings, arg.config)} ${contentToText(ContentID.miscUpdated, arg.config)}.`,
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

export const { settingsAdd, settingsGetAll, settingsUpdate } = settingsSlice.endpoints;
