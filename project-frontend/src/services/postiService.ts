import axios from 'axios';

import { PostiLocation } from '../types/orderTypes';
import { Response } from '../types/types';

import { handleError } from '../util/handleError';
import { isObject } from '../types/typeFunctions';

export interface PostiResponse extends Response {
    locations: PostiLocation[];
}

const getPickupPoints = async (zipCode: string, numberOfPoints: number, language: 'fi' | 'sv' | 'en'): Promise<PostiResponse> => {
    try {
        const url = `https://locationservice.posti.com/location?locationZipCode=${zipCode}&types=SMARTPOST&types=POSTOFFICE&types=PICKUPPOINT&top=${numberOfPoints}`;

        const res = await axios.get(url);

        if (res.status === 200 && isObject(res.data) && 'locations' in res.data && Array.isArray(res.data.locations)) {
            const locations: PostiLocation[] = [];

            res.data.locations.forEach((loc) => {
                if (
                    'id' in loc &&
                    'publicName' in loc &&
                    language in loc.publicName &&
                    'address' in loc &&
                    language in loc.address &&
                    'address' in loc.address[language] &&
                    'postalCode' in loc.address[language] &&
                    'postalCodeName' in loc.address[language]
                ) {
                    locations.push({
                        id: loc.id.toString(),
                        name: loc.publicName[language].toString(),
                        address: loc.address[language].address + ', ' + loc.address[language].postalCode + ' ' + loc.address[language].postalCodeName,
                    });
                }
            });

            return { success: true, message: 'Ok', locations: locations };
        } else {
            return { success: false, message: 'Something went wrong', locations: [] };
        }
    } catch (err: unknown) {
        handleError(err);
        return { success: false, message: 'Error occurred', locations: [] };
    }
};

export default {
    getPickupPoints,
};
