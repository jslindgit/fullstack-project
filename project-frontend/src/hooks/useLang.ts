import { availableLangs, LangField, LangTextArea } from '../types/languageTypes';

import useField from './useField';
import useTextArea from './useTextArea';

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
