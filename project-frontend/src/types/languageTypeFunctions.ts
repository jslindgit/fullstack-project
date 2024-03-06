import { LangCode, LangText } from './languageTypes';

import { isObject, isString } from './typeFunctions';

const isLangCode = (variable: unknown) => {
    return isString(variable) && (Object.values(LangCode) as string[]).includes(variable);
};

export const isLangText = (obj: unknown): obj is LangText => {
    return isObject(obj) && obj !== null && 'text' in obj && isString(obj.text) && 'langCode' in obj && isLangCode(obj.langCode);
};
