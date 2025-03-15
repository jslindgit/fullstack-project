import { Config } from '../../types/configTypes';
import { Settings } from '../../types/settingsTypes';
import { Response } from '../../types/types';

import { settingsFromResBody, settingsToReqBody } from '../../util/serviceProvider';
//import { isNotNull } from '../../types/typeFunctions';

import { apiSlice } from './apiSlice';
import { defaultSettings } from '../../constants';
import { ContentID } from '../../content';
import { contentToText } from '../../types/languageFunctions';

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
        settingsGet: builder.query<Settings, void>({
            query: () => url,
            providesTags: ['Settings'],
            transformResponse: (res: Settings[]) => {
                return res.length > 0 ? settingsFromResBody(res[0]) : defaultSettings;
                //return res.map((s) => settingsFromResBody(s)).filter(isNotNull);
            },
        }),
        settingsUpdate: builder.mutation<SettingsResponse, { currentSettingsId: number; newSettings: Settings; config: Config }>({
            query: ({ currentSettingsId, newSettings }) => {
                return {
                    url: `${url}/${currentSettingsId}`,
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

export const { useSettingsGetQuery } = settingsSlice;
export const { settingsAdd, settingsUpdate } = settingsSlice.endpoints;
