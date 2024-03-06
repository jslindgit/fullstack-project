import { Config } from './configTypes';
import { LangCode, LangText } from './languageTypes';
import { ContentID } from '../content';

import { defaultLangContent } from '../content';

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
