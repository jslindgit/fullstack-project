import { ContentID } from '../content';

import { UseField } from '../hooks/useField';
import { UseTextArea } from '../hooks/useTextArea';

export enum LangCode {
    DE = 'DE',
    EN = 'EN',
    ES = 'ES',
    FI = 'FI',
    FR = 'FR',
    SV = 'SV',
}

export interface LangContent {
    id: ContentID;
    content: LangText[];
}

export interface LangField {
    langCode: LangCode;
    field: UseField;
}

export interface LangTextArea {
    langCode: LangCode;
    textArea: UseTextArea;
}

export interface LangText {
    langCode: LangCode;
    text: string;
}

export interface Language {
    code: LangCode;
    decimalPoint: string;
    name: string;
    paytrailValue: 'FI' | 'SV' | 'EN';
}
