import { ContentID } from '../content';

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

export interface LangText {
    lang: LangCode;
    text: string;
}

export interface Language {
    code: LangCode;
    name: string;
    paytrailValue: 'FI' | 'SV' | 'EN';
}

export const availableLangs: Language[] = [
    {
        code: LangCode.FI,
        name: 'Suomi',
        paytrailValue: 'FI',
    },
    {
        code: LangCode.EN,
        name: 'English',
        paytrailValue: 'EN',
    },
];
