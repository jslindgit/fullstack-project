import jwt from 'jsonwebtoken';

import { SECRET } from '../util/config';
import { User } from '../models';
import { UserForToken } from '../types/types';
import { isNumber, isString } from '../types/type_functions';
import { handleError } from '../util/error_handler';

export enum LoginError {
    InvalidUsername,
    InvalidPassword,
    SomethingWentWrong,
}

export interface LoginResult {
    token: string;
    user: User;
}

export enum LogoutResult {
    Success,
    UserMatchingTokenNotFound,
    InvalidToken,
    TokenMismatch,
    SomethingWentWrong,
}

const login = async (username: unknown, password: unknown): Promise<LoginResult | LoginError> => {
    try {
        if (!isString(username) || !isString(password)) {
            throw new Error('"username" and "password" must be strings"');
        }

        const user = await User.findOne({ where: { username: username } });
        if (!user) {
            return LoginError.InvalidUsername;
        }

        const passwordCorrect = password === 'salainen'; // temp
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
            user: user,
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
        if (!(decodedToken instanceof Object && 'id' in decodedToken && isNumber(decodedToken.id))) {
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
