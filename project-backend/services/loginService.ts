import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { Credentials, UserForToken } from '../types/types';
import { handleError } from '../util/error_handler';
import { isNumber, isObject, isString } from '../types/type_functions';
import { isValidPassword } from '../util/userProvider';
import { SECRET } from '../util/config';
import User, { removePasswordHash, UserAttributes } from '../models/user';
import userService from './userService';

export enum ChangePasswordResult {
    InvalidCurrentPassword,
    InvalidNewPassword,
    InvalidUserName,
    SomethingWentWrong,
    Success,
}

export enum LoginError {
    InvalidUsername,
    InvalidPassword,
    SomethingWentWrong,
}

export enum LogoutResult {
    Success,
    UserMatchingTokenNotFound,
    InvalidToken,
    TokenMismatch,
    SomethingWentWrong,
}

const changePassword = async (credentials: Credentials, newPassword: string): Promise<ChangePasswordResult> => {
    const user = await User.findOne({ where: { username: credentials.username } });
    if (!user) {
        return ChangePasswordResult.InvalidUserName;
    }

    let passwordCorrect = false;
    if ('passwordHash' in user && isString(user.passwordHash)) {
        passwordCorrect = await bcrypt.compare(credentials.password, user.passwordHash);
    } else {
        return ChangePasswordResult.SomethingWentWrong;
    }

    if (!passwordCorrect) {
        return ChangePasswordResult.InvalidCurrentPassword;
    }

    if (!isValidPassword(newPassword)) {
        return ChangePasswordResult.InvalidNewPassword;
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    const updatedUser = await userService.update(user.id, { passwordHash: passwordHash });
    if (updatedUser) {
        return ChangePasswordResult.Success;
    } else {
        return ChangePasswordResult.SomethingWentWrong;
    }
};

const checkPassword = async (credentials: Credentials): Promise<boolean | LoginError> => {
    try {
        const user = await User.findOne({ where: { username: credentials.username } });
        if (!user) {
            return LoginError.InvalidUsername;
        }

        let passwordCorrect = false;
        if ('passwordHash' in user && isString(user.passwordHash)) {
            passwordCorrect = await bcrypt.compare(credentials.password, user.passwordHash);
        } else {
            return LoginError.SomethingWentWrong;
        }

        if (!passwordCorrect) {
            return LoginError.InvalidPassword;
        }

        return true;
    } catch (err) {
        handleError(err);
        return LoginError.SomethingWentWrong;
    }
};

const login = async (credentials: Credentials): Promise<UserAttributes | LoginError> => {
    try {
        const user = await User.findOne({ where: { username: credentials.username } });
        if (!user) {
            return LoginError.InvalidUsername;
        }

        let passwordCorrect = false;
        if ('passwordHash' in user && isString(user.passwordHash)) {
            passwordCorrect = await bcrypt.compare(credentials.password, user.passwordHash);
        } else {
            return LoginError.SomethingWentWrong;
        }

        if (!passwordCorrect) {
            return LoginError.InvalidPassword;
        }

        const userForToken: UserForToken = {
            username: user.username,
            id: user.id,
        };

        const token = jwt.sign(userForToken, SECRET);

        user.token = token;
        await user.save();

        const userWithoutPasswordHash = removePasswordHash(user);
        if (userWithoutPasswordHash) {
            return userWithoutPasswordHash;
        } else {
            return LoginError.SomethingWentWrong;
        }
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
    changePassword,
    checkPassword,
    login,
    logout,
};
