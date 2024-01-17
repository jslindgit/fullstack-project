import { LangCode, Language } from './types/languageTypes';
import { Config } from './types/configTypes';
import { Country, Currency } from './types/types';

export const API_KEY = import.meta.env.VITE_API_KEY as string;
export const apiBaseUrl = 'http://localhost:3001/api';
export const pageWidth = 1024;
export const passwordMinLength = 10;

export const description = (config: Config): JSX.Element => {
    return config.language.code === LangCode.FI ? (
        <>
            Tämä on{' '}
            <a href='https://fullstackopen.com/' target='_blank' className='u'>
                Full Stack Open
            </a>{' '}
            -kurssin harjoitustyöksi tehty verkkokauppa-alusta.
        </>
    ) : (
        <>
            This is an e-commerce platform made as a project work for the{' '}
            <a href='https://fullstackopen.com/' target='_blank' className='u'>
                Full Stack Open
            </a>{' '}
            course.
        </>
    );
};

export const availableDeliveryCountries: Country[] = [
    {
        names: [
            { langCode: LangCode.EN, text: 'Denmark' },
            { langCode: LangCode.FI, text: 'Tanska' },
        ],
    },
    {
        names: [
            { langCode: LangCode.EN, text: 'Estonia' },
            { langCode: LangCode.FI, text: 'Viro' },
        ],
    },
    {
        names: [
            { langCode: LangCode.EN, text: 'Finland' },
            { langCode: LangCode.FI, text: 'Suomi' },
        ],
    },
    {
        names: [
            { langCode: LangCode.EN, text: 'Latvia' },
            { langCode: LangCode.FI, text: 'Latvia' },
        ],
    },
    {
        names: [
            { langCode: LangCode.EN, text: 'Lithuania' },
            { langCode: LangCode.FI, text: 'Liettua' },
        ],
    },
    {
        names: [
            { langCode: LangCode.EN, text: 'Norway' },
            { langCode: LangCode.FI, text: 'Norja' },
        ],
    },
    {
        names: [
            { langCode: LangCode.EN, text: 'Sweden' },
            { langCode: LangCode.FI, text: 'Ruotsi' },
        ],
    },
];

export const defaultLanguage: Language = {
    code: LangCode.FI,
    decimalPoint: ',',
    name: 'Suomi',
    paytrailValue: 'FI',
};

export const defaultConfig: Config = {
    currency: Currency.EUR,
    language: defaultLanguage,
    maxItemPriceEUR: 1000000,
    maxItemQuantity: 1000,
    owner: {
        businessIdentifier: '1234567-8',
        email: 'owner@unnamedwebstore123.com',
        name: 'Unnamed Owner Oy',
        phone: '+358 40 123 45678',
    },
    paytrail: {
        merchantId: '375917',
        secretKey: 'SAIPPUAKAUPPIAS',
    },
    store: {
        contactCity: 'Vantaa',
        contactCountry: {
            names: [
                { langCode: LangCode.EN, text: 'Finland' },
                { langCode: LangCode.FI, text: 'Suomi' },
            ],
        },
        contactEmail: 'info@unnamedwebstore123.com',
        contactName: 'Unnamed Webstore',
        contactPhone: '+358 9 123 45678',
        contactStreetAddress: 'Verkkokauppatie 1',
        contactZipcode: '01600',
        deliveryCountries: availableDeliveryCountries,
        deliveryTimeBusinessDays: 3,
        welcome: [
            { langCode: LangCode.EN, text: 'Welcome!' },
            { langCode: LangCode.FI, text: 'Tervetuloa!' },
        ],
    },
    vat: 24,
};
