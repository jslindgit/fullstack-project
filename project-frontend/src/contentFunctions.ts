import { Config } from './types/configTypes';
import { ContentID } from './content';

import { contentToText } from './types/languageFunctions';

export const printAdminPanelHeader = (page: string, config: Config) => {
    switch (page.toLowerCase()) {
        case 'categories':
            return contentToText(ContentID.adminPanelCategories, config);
        case 'images':
            return contentToText(ContentID.adminPanelImages, config);
        case 'items':
            return contentToText(ContentID.adminPanelItems, config);
        case 'orders':
            return contentToText(ContentID.adminPanelOrders, config);
        case 'settings':
            return contentToText(ContentID.adminPanelSettings, config);
        case 'users':
            return contentToText(ContentID.adminPanelUsers, config);
        default:
            'N/A';
    }
};
