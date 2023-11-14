export interface LangText {
    lang: LangCode;
    text: string;
}

export enum LangCode {
    DE = 'DE',
    EN = 'EN',
    ES = 'ES',
    FI = 'FI',
    FR = 'FR',
    SV = 'SV',
}

export interface Language {
    code: LangCode;
    name: string;
    paytrailValue: 'FI' | 'SV' | 'EN';
}
