import { Delivery } from '../types/types';

const getAll = (): Delivery[] => {
    return [
        { id: 1, name: 'Postipaketti', description: 'Toimitetaan Postin noutopisteeseen.', cost: 9 },
        { id: 2, name: 'Posti Express', description: 'Toimitetaan suoraan toimitusosoitteeseen.', cost: 15 },
        { id: 3, name: 'Nouto myymälästä', description: 'Noudetaan myymälästämme.', cost: 0 },
    ];
};

export default {
    getAll,
};
