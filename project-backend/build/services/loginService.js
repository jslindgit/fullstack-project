"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutResult = exports.LoginError = exports.ChangePasswordResult = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_handler_1 = require("../util/error_handler");
const type_functions_1 = require("../types/type_functions");
const userProvider_1 = require("../util/userProvider");
const config_1 = require("../util/config");
const user_1 = __importStar(require("../models/user"));
const userService_1 = __importDefault(require("./userService"));
var ChangePasswordResult;
(function (ChangePasswordResult) {
    ChangePasswordResult[ChangePasswordResult["InvalidCurrentPassword"] = 0] = "InvalidCurrentPassword";
    ChangePasswordResult[ChangePasswordResult["InvalidNewPassword"] = 1] = "InvalidNewPassword";
    ChangePasswordResult[ChangePasswordResult["InvalidUserName"] = 2] = "InvalidUserName";
    ChangePasswordResult[ChangePasswordResult["SomethingWentWrong"] = 3] = "SomethingWentWrong";
    ChangePasswordResult[ChangePasswordResult["Success"] = 4] = "Success";
})(ChangePasswordResult || (exports.ChangePasswordResult = ChangePasswordResult = {}));
var LoginError;
(function (LoginError) {
    LoginError[LoginError["InvalidUsername"] = 0] = "InvalidUsername";
    LoginError[LoginError["InvalidPassword"] = 1] = "InvalidPassword";
    LoginError[LoginError["SomethingWentWrong"] = 2] = "SomethingWentWrong";
})(LoginError || (exports.LoginError = LoginError = {}));
var LogoutResult;
(function (LogoutResult) {
    LogoutResult[LogoutResult["Success"] = 0] = "Success";
    LogoutResult[LogoutResult["UserMatchingTokenNotFound"] = 1] = "UserMatchingTokenNotFound";
    LogoutResult[LogoutResult["InvalidToken"] = 2] = "InvalidToken";
    LogoutResult[LogoutResult["TokenMismatch"] = 3] = "TokenMismatch";
    LogoutResult[LogoutResult["SomethingWentWrong"] = 4] = "SomethingWentWrong";
})(LogoutResult || (exports.LogoutResult = LogoutResult = {}));
const changePassword = async (credentials, newPassword) => {
    const user = await user_1.default.findOne({ where: { username: credentials.username } });
    if (!user) {
        return ChangePasswordResult.InvalidUserName;
    }
    let passwordCorrect = false;
    if ('passwordHash' in user && (0, type_functions_1.isString)(user.passwordHash)) {
        passwordCorrect = await bcrypt_1.default.compare(credentials.password, user.passwordHash);
    }
    else {
        return ChangePasswordResult.SomethingWentWrong;
    }
    if (!passwordCorrect) {
        return ChangePasswordResult.InvalidCurrentPassword;
    }
    if (!(0, userProvider_1.isValidPassword)(newPassword)) {
        return ChangePasswordResult.InvalidNewPassword;
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt_1.default.hash(newPassword, saltRounds);
    const updatedUser = await userService_1.default.update(user.id, { passwordHash: passwordHash });
    if (updatedUser) {
        return ChangePasswordResult.Success;
    }
    else {
        return ChangePasswordResult.SomethingWentWrong;
    }
};
const checkPassword = async (credentials) => {
    try {
        const user = await user_1.default.findOne({ where: { username: credentials.username } });
        if (!user) {
            return LoginError.InvalidUsername;
        }
        let passwordCorrect = false;
        if ('passwordHash' in user && (0, type_functions_1.isString)(user.passwordHash)) {
            passwordCorrect = await bcrypt_1.default.compare(credentials.password, user.passwordHash);
        }
        else {
            return LoginError.SomethingWentWrong;
        }
        if (!passwordCorrect) {
            return LoginError.InvalidPassword;
        }
        const userWithoutPasswordHash = (0, user_1.removePasswordHash)(user);
        if (userWithoutPasswordHash) {
            return userWithoutPasswordHash;
        }
        else {
            return LoginError.SomethingWentWrong;
        }
    }
    catch (err) {
        (0, error_handler_1.handleError)(err);
        return LoginError.SomethingWentWrong;
    }
};
const login = async (credentials) => {
    try {
        const user = await user_1.default.findOne({ where: { username: credentials.username } });
        if (!user) {
            return LoginError.InvalidUsername;
        }
        let passwordCorrect = false;
        if ('passwordHash' in user && (0, type_functions_1.isString)(user.passwordHash)) {
            passwordCorrect = await bcrypt_1.default.compare(credentials.password, user.passwordHash);
        }
        else {
            return LoginError.SomethingWentWrong;
        }
        if (!passwordCorrect) {
            return LoginError.InvalidPassword;
        }
        const userForToken = {
            username: user.username,
            id: user.id,
        };
        const token = jsonwebtoken_1.default.sign(userForToken, config_1.SECRET);
        user.token = token;
        await user.save();
        const userWithoutPasswordHash = (0, user_1.removePasswordHash)(user);
        if (userWithoutPasswordHash) {
            return userWithoutPasswordHash;
        }
        else {
            return LoginError.SomethingWentWrong;
        }
    }
    catch (err) {
        (0, error_handler_1.handleError)(err);
        return LoginError.SomethingWentWrong;
    }
};
const logout = async (token) => {
    try {
        if (!token || !(0, type_functions_1.isString)(token)) {
            return LogoutResult.InvalidToken;
        }
        const decodedToken = jsonwebtoken_1.default.verify(token, config_1.SECRET);
        if (!((0, type_functions_1.isObject)(decodedToken) && 'id' in decodedToken && (0, type_functions_1.isNumber)(decodedToken.id))) {
            return LogoutResult.InvalidToken;
        }
        const user = await user_1.default.findByPk(decodedToken.id);
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
    }
    catch (err) {
        (0, error_handler_1.handleError)(err);
        return LogoutResult.SomethingWentWrong;
    }
};
exports.default = {
    changePassword,
    checkPassword,
    login,
    logout,
};
