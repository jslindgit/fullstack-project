import { LangCode } from '../types/language';
import { DeliveryCode, DeliveryMethod } from '../types/orderTypes';

const getAll = (): DeliveryMethod[] => {
    return [
        {
            code: DeliveryCode.POSTI_PIKKUPAKETTI,
            names: [
                { lang: LangCode.EN, text: 'Posti Small Parcel' },
                { lang: LangCode.FI, text: 'Posti Pikkupaketti (Kirje)' },
            ],
            descriptions: [
                { lang: LangCode.EN, text: 'Delivered to the recipient’s mail slot or mailbox together with other mail.' },
                { lang: LangCode.FI, text: 'Toimitetaan suoraan postiluukkuun tai -laatikkoon kirjepostin mukana.' },
            ],
            cost: 3,
            notes: '',
        },
        {
            code: DeliveryCode.POSTI_PAKETTI,
            names: [
                { lang: LangCode.EN, text: 'Posti Postal parcel' },
                { lang: LangCode.FI, text: 'Postipaketti' },
            ],
            descriptions: [
                { lang: LangCode.EN, text: 'Delivered to a Posti Parcel Locker or a Posti outlet.' },
                { lang: LangCode.FI, text: 'Toimitetaan Postin noutopisteeseen tai pakettiautomaattiin.' },
            ],
            cost: 9,
            notes: '',
        },
        {
            code: DeliveryCode.POSTI_EXPRESS,
            names: [
                { lang: LangCode.EN, text: 'Posti Express Parcel' },
                { lang: LangCode.FI, text: 'Posti Express-paketti' },
            ],
            descriptions: [
                { lang: LangCode.EN, text: 'Delivered directly to the recipient Mon-Fri between 8 a.m. and 4 p.m.' },
                { lang: LangCode.FI, text: 'Toimitetaan suoraan vastaanottajalle arkisin klo 8-16 välillä.' },
            ],
            cost: 15,
            notes: '',
        },
        {
            code: DeliveryCode.POSTI_KOTIPAKETTI,
            names: [
                { lang: LangCode.EN, text: 'Posti Home Parcel' },
                { lang: LangCode.FI, text: 'Posti Kotipaketti' },
            ],
            descriptions: [
                { lang: LangCode.EN, text: 'Delivered directly to the recipient between 9 a.m. and 9 p.m. Posti will contact the recipient in order to agree a suitable delivery time window.' },
                { lang: LangCode.FI, text: 'Toimitetaan suoraan vastaanottajalle klo 9-21 välillä. Posti on yhteydessä vastaanottajaan tarkemman toimitusajankohdan sopimiseksi.' },
            ],
            cost: 20,
            notes: '',
        },
        {
            code: DeliveryCode.PICKUP,
            names: [
                { lang: LangCode.EN, text: 'In-store Pickup' },
                { lang: LangCode.FI, text: 'Nouto' },
            ],
            descriptions: [
                { lang: LangCode.EN, text: 'Picked up from our store.' },
                { lang: LangCode.FI, text: 'Noudetaan myymälästämme.' },
            ],
            cost: 0,
            notes: '',
        },
    ];
};

export default {
    getAll,
};
