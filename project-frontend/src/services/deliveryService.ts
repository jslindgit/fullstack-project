import { LangCode } from '../types/languageTypes';
import { DeliveryCode, DeliveryMethod } from '../types/orderTypes';

const getAllDomestic = (): DeliveryMethod[] => {
    return [
        {
            code: DeliveryCode.POSTI_PIKKUPAKETTI,
            cost: 3,
            descriptions: [
                { langCode: LangCode.EN, text: 'Delivered to the recipient’s mail slot or mailbox together with other mail.' },
                { langCode: LangCode.FI, text: 'Toimitetaan suoraan postiluukkuun tai -laatikkoon kirjepostin mukana.' },
            ],
            isLetter: true,
            names: [
                { langCode: LangCode.EN, text: 'Posti Small Parcel' },
                { langCode: LangCode.FI, text: 'Posti Pikkupaketti (Kirje)' },
            ],
            notes: '',
        },
        {
            code: DeliveryCode.POSTI_PAKETTI,
            cost: 9,
            descriptions: [
                { langCode: LangCode.EN, text: 'Delivered to a Posti Parcel Locker or a Posti outlet.' },
                { langCode: LangCode.FI, text: 'Toimitetaan Postin noutopisteeseen tai pakettiautomaattiin.' },
            ],
            names: [
                { langCode: LangCode.EN, text: 'Posti Postal parcel' },
                { langCode: LangCode.FI, text: 'Postipaketti' },
            ],
            isLetter: false,
            notes: '',
        },
        {
            code: DeliveryCode.POSTI_EXPRESS,
            cost: 15,
            descriptions: [
                { langCode: LangCode.EN, text: 'Delivered directly to the recipient Mon-Fri between 8 a.m. and 4 p.m.' },
                { langCode: LangCode.FI, text: 'Toimitetaan suoraan vastaanottajalle arkisin klo 8-16 välillä.' },
            ],
            names: [
                { langCode: LangCode.EN, text: 'Posti Express Parcel' },
                { langCode: LangCode.FI, text: 'Posti Express-paketti' },
            ],
            isLetter: false,
            notes: '',
        },
        {
            code: DeliveryCode.POSTI_KOTIPAKETTI,
            cost: 20,
            descriptions: [
                {
                    langCode: LangCode.EN,
                    text: 'Delivered directly to the recipient between 9 a.m. and 9 p.m. Posti will contact the recipient in order to agree a suitable delivery time window.',
                },
                {
                    langCode: LangCode.FI,
                    text: 'Toimitetaan suoraan vastaanottajalle klo 9-21 välillä. Posti on yhteydessä vastaanottajaan tarkemman toimitusajankohdan sopimiseksi.',
                },
            ],
            names: [
                { langCode: LangCode.EN, text: 'Posti Home Parcel' },
                { langCode: LangCode.FI, text: 'Posti Kotipaketti' },
            ],
            isLetter: false,
            notes: '',
        },
        {
            code: DeliveryCode.PICKUP,
            cost: 0,
            descriptions: [
                { langCode: LangCode.EN, text: 'Picked up from our store.' },
                { langCode: LangCode.FI, text: 'Noudetaan myymälästämme.' },
            ],
            names: [
                { langCode: LangCode.EN, text: 'In-store Pickup' },
                { langCode: LangCode.FI, text: 'Nouto' },
            ],
            isLetter: false,
            notes: '',
        },
    ];
};

const getAllInternational = (): DeliveryMethod[] => {
    return [
        {
            code: DeliveryCode.INTERNATIONAL_POSTI_PRIORITY_PARCEL,
            cost: 25,
            descriptions: [
                {
                    langCode: LangCode.EN,
                    text: 'Deliveries to the Nordic countries within 3–5 days, elsewhere in Europe within 2–7 days and elsewhere in the world within 6–14 working days.',
                },
                { langCode: LangCode.FI, text: 'Kuljetukset Pohjoismaihin 3–5, muualle Eurooppaan 2–7 ja muualle maailmaan 6–14 arkipäivässä.' },
            ],
            names: [
                { langCode: LangCode.EN, text: 'Posti Priority parcel' },
                { langCode: LangCode.FI, text: 'Posti Priority-postipaketti' },
            ],
            isLetter: false,
            notes: '',
        },
        {
            code: DeliveryCode.INTERNATIONAL_POSTI_EXPRESS_BUSINESS_DAY,
            cost: 9,
            descriptions: [
                {
                    langCode: LangCode.EN,
                    text: 'This service is intended for dispatches between companies. The delivery time varies from two to eight working days, depending on the country.',
                },
                { langCode: LangCode.FI, text: 'Palvelu on tarkoitettu yritysten välisiin toimituksiin. Toimitusaika on maasta riippuen 2–8 arkipäivää.' },
            ],
            names: [
                { langCode: LangCode.EN, text: 'Posti Express Business Day' },
                { langCode: LangCode.FI, text: 'Posti Express Business Day' },
            ],
            isLetter: false,
            notes: '',
        },
    ];
};

export default {
    getAllDomestic,
    getAllInternational,
};
