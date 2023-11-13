import { DeliveryMethod, DeliveryName } from '../types/orderTypes';

const getAll = (): DeliveryMethod[] => {
    return [
        { name: DeliveryName.POSTI_PIKKUPAKETTI, description: 'Toimitetaan suoraan postiluukkuun tai -laatikkoon kirjepostin mukana.', cost: 3, notes: '' },
        { name: DeliveryName.POSTI_PAKETTI, description: 'Toimitetaan Postin noutopisteeseen tai pakettiautomaattiin.', cost: 9, notes: '' },
        { name: DeliveryName.POSTI_EXPRESS, description: 'Toimitetaan suoraan vastaanottajalle arkisin klo 8-16 välillä.', cost: 15, notes: '' },
        {
            name: DeliveryName.POSTI_KOTIPAKETTI,
            description: 'Toimitetaan suoraan vastaanottajalle klo 9-21 välillä. Posti on yhteydessä vastaanottajaan tarkemman toimitusajankohdan sopimiseksi.',
            cost: 20,
            notes: '',
        },
        { name: DeliveryName.NOUTO, description: 'Noudetaan myymälästämme', cost: 0, notes: '' },
    ];
};

export default {
    getAll,
};
