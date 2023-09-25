import jwt from 'jsonwebtoken';

import { Credentials, UserForToken } from '../types/types';
import { handleError } from '../util/error_handler';
import { isNumber, isObject, isString } from '../types/type_functions';
import { SECRET } from '../util/config';
import { User } from '../models';

export enum LoginError {
    InvalidUsername,
    InvalidPassword,
    SomethingWentWrong,
}

export interface LoginResult {
    token: string;
    username: string;
}

export enum LogoutResult {
    Success,
    UserMatchingTokenNotFound,
    InvalidToken,
    TokenMismatch,
    SomethingWentWrong,
}

const login = async (credentials: Credentials): Promise<LoginResult | LoginError> => {
    try {
        if (!credentials) {
            throw new Error('Invalid credentials');
        }

        const user = await User.findOne({ where: { username: credentials.username } });
        if (!user) {
            return LoginError.InvalidUsername;
        }

        const passwordCorrect = credentials.password === 'salainen'; // temp
        if (!passwordCorrect) {
            return LoginError.InvalidPassword;
        }

        if (!('username' in user && isString(user.username) && 'id' in user && isNumber(user.id) && 'token' in user)) {
            return LoginError.SomethingWentWrong;
        }

        const userForToken: UserForToken = {
            username: user.username,
            id: user.id,
        };

        const token = jwt.sign(userForToken, SECRET);

        user.token = token;
        await user.save();

        return {
            token: token,
            username: user.username,
        };
    } catch (err) {
        handleError(err);
        return LoginError.SomethingWentWrong;
    }
};

const logout = async (token: string): Promise<LogoutResult> => {
    try {
        if (!token || !isString(token)) {
            return LogoutResult.InvalidToken;
        }

        const decodedToken: unknown = jwt.verify(token, SECRET);
        if (!(isObject(decodedToken) && 'id' in decodedToken && isNumber(decodedToken.id))) {
            return LogoutResult.InvalidToken;
        }

        const user = await User.findByPk(decodedToken.id);
        if (!user) {
            return LogoutResult.UserMatchingTokenNotFound;
        }

        if (!('token' in user)) {
            return LogoutResult.SomethingWentWrong;
        }

        if (user.token !== token) {
            user.token = '';
            await user.save();
            return LogoutResult.TokenMismatch;
        }

        user.token = '';
        await user.save();
        return LogoutResult.Success;
    } catch (err) {
        handleError(err);
        return LogoutResult.SomethingWentWrong;
    }
};

export default {
    login,
    logout,
};
