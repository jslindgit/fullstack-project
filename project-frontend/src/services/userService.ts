import { StoreDispatch } from '../redux/store';

import { handleError } from '../util/handleError';

import { userNameIsAvailable } from '../redux/userSlice';

export const usernameIsAvailable = async (username: string, storeDispatch: StoreDispatch): Promise<boolean> => {
    try {
        return await storeDispatch(userNameIsAvailable.initiate({ username: username })).unwrap();
    } catch (err: unknown) {
        handleError(err);
        return false;
    }
};
