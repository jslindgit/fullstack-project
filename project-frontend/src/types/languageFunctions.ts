import { Config } from './types';
import { LangCode, LangText } from './language';
import { ContentID } from '../content';

import { isObject, isString } from './typeFunctions';

export const contentToText = (contentId: ContentID, config: Config) => {
    const langContent = config.langContent.find((lc) => lc.id === contentId);
    if (langContent) {
        return langTextsToText(langContent.content, config);
    } else {
        return `Error: ContentID ${contentId} undefined.`;
    }
};

export const isLangCode = (variable: unknown) => {
    return isString(variable) && (Object.values(LangCode) as string[]).includes(variable);
};

export const isLangText = (obj: unknown): obj is LangText => {
    return isObject(obj) && obj !== null && 'text' in obj && isString(obj.text) && 'lang' in obj && isLangCode(obj.lang);
};

export const langTextsToText = (langTexts: LangText[], config: Config): string => {
    if (langTexts.length < 1) {
        return '';
    }

    const matching = langTexts.find((langText) => langText.lang === config.language.code);
    if (matching) {
        return matching.text;
    } else {
        const english = langTexts.find((langText) => langText.lang === LangCode.EN);
        if (english) {
            return english.text;
        } else {
            return langTexts[0].text;
        }
    }
};
