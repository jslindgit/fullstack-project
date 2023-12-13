import { Config } from './configTypes';
import { LangCode, LangField, LangText, LangTextArea } from './languageTypes';
import { ContentID } from '../content';

import { defaultLangContent } from '../content';
import { availableLangs } from './languageTypes';
import { isObject, isString } from './typeFunctions';
import useField from '../hooks/useField';
import useTextArea from '../hooks/useTextArea';

export const contentToText = (contentId: ContentID, config: Config, debug: boolean = false) => {
    const langContent = defaultLangContent.find((lc) => lc.id === contentId);

    if (debug) {
        console.log('langC:', langContent);
    }

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

export const langTextsToText = (langTexts: LangText[] | undefined, config: Config, debug: boolean = false): string => {
    if (debug) {
        console.log('langTexts:', langTexts);
        console.log('langTexts.length:', langTexts?.length);
    }
    if (!langTexts || langTexts.length < 1) {
        return '';
    }

    const matching = langTexts.find((langText) => langText.langCode === config.language.code);
    if (matching) {
        return matching.text;
    } else {
        const english = langTexts.find((langText) => langText.langCode === LangCode.EN);
        if (english) {
            return english.text;
        } else {
            return langTexts[0].text;
        }
    }
};

export const useLangFields = (type: 'text' | 'integer' | 'decimal'): LangField[] => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const langFields: LangField[] = availableLangs.map((lang) => ({ langCode: lang.code, field: useField(type, null) }));
    return langFields;
};

export const useLangTextAreas = (): LangTextArea[] => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const langTextAreas: LangTextArea[] = availableLangs.map((lang) => ({ langCode: lang.code, textArea: useTextArea() }));
    return langTextAreas;
};
