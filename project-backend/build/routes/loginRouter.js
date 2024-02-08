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
const express_1 = __importDefault(require("express"));
const errors_1 = require("../middlewares/errors");
const apiKeyExtractor_1 = require("../middlewares/apiKeyExtractor");
const tokenExtractor_1 = require("../middlewares/tokenExtractor");
const type_functions_1 = require("../types/type_functions");
const loginService_1 = __importStar(require("../services/loginService"));
const loginService_2 = __importDefault(require("../services/loginService"));
const router = express_1.default.Router();
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.delete('/', tokenExtractor_1.tokenExtractor, (async (_req, res, next) => {
    try {
        if (!res.locals.token || !(0, type_functions_1.isString)(res.locals.token)) {
            res.status(401).json({ error: 'Token missing' });
        }
        else {
            const response = await loginService_2.default.logout(res.locals.token);
            switch (response) {
                case loginService_1.LogoutResult.InvalidToken:
                    res.status(401).json({ error: 'Invalid token' });
                    console.log('invalid token');
                    break;
                case loginService_1.LogoutResult.SomethingWentWrong:
                    res.status(400).json({ error: 'Something went wrong' });
                    break;
                case loginService_1.LogoutResult.TokenMismatch:
                    res.status(400).json({ error: 'Token mismatch' });
                    break;
                case loginService_1.LogoutResult.UserMatchingTokenNotFound:
                    res.status(404).json({ error: 'User matching token not found' });
                    break;
                case loginService_1.LogoutResult.Success:
                    res.status(200).end();
            }
        }
    }
    catch (err) {
        next(err);
    }
}));
router.post('/', apiKeyExtractor_1.apiKeyExtractor, (async (req, res, next) => {
    try {
        if (res.locals.correct_api_key === true) {
            const credentials = (0, type_functions_1.toCredentials)(req.body);
            const response = await loginService_2.default.login(credentials);
            switch (response) {
                case loginService_1.LoginError.InvalidPassword:
                    res.status(401).send({ error: 'Invalid password' });
                    return;
                case loginService_1.LoginError.InvalidUsername:
                    res.status(401).send({ error: 'Invalid username' });
                    return;
                case loginService_1.LoginError.SomethingWentWrong:
                    res.status(400).send({ error: 'Something went wrong' });
                    return;
            }
            res.status(200).send({ response });
        }
        else {
            res.status(403).json({ error: 'Access denied' });
        }
    }
    catch (err) {
        next(err);
    }
}));
router.post('/checkpassword', apiKeyExtractor_1.apiKeyExtractor, (async (req, res, next) => {
    try {
        if (res.locals.correct_api_key === true) {
            const credentials = (0, type_functions_1.toCredentials)(req.body);
            const response = await loginService_2.default.checkPassword(credentials);
            switch (response) {
                case loginService_1.LoginError.InvalidPassword:
                    res.status(401).send({ error: 'Invalid password' });
                    return;
                case loginService_1.LoginError.InvalidUsername:
                    res.status(401).send({ error: 'Invalid username' });
                    return;
                case loginService_1.LoginError.SomethingWentWrong:
                    res.status(400).send({ error: 'Something went wrong' });
                    return;
            }
            res.status(200).send({ response });
        }
        else {
            res.status(403).json({ error: 'Access denied' });
        }
    }
    catch (err) {
        next(err);
    }
}));
router.post('/changepassword', apiKeyExtractor_1.apiKeyExtractor, (async (req, res, next) => {
    try {
        if (res.locals.correct_api_key === true) {
            const credentials = (0, type_functions_1.toCredentials)(req.body);
            if ((0, type_functions_1.isObject)(req.body) && 'newPassword' in req.body && (0, type_functions_1.isString)(req.body.newPassword)) {
                const result = await loginService_1.default.changePassword(credentials, req.body.newPassword);
                switch (result) {
                    case loginService_1.ChangePasswordResult.InvalidCurrentPassword:
                        res.status(401).send({ error: 'Invalid password' });
                        break;
                    case loginService_1.ChangePasswordResult.InvalidUserName:
                        res.status(401).send({ error: 'Invalid username' });
                        break;
                    case loginService_1.ChangePasswordResult.InvalidNewPassword:
                        res.status(400).send({ error: 'Invalid new password' });
                        break;
                    case loginService_1.ChangePasswordResult.SomethingWentWrong:
                        res.status(400).send({ error: 'Something went wrong' });
                        break;
                    case loginService_1.ChangePasswordResult.Success:
                        res.status(200).end();
                        break;
                }
            }
            else {
                res.status(400).json({ error: 'Credentials or new password missing.' });
            }
        }
        else {
            res.status(403).json({ error: 'Access denied' });
        }
    }
    catch (err) {
        next(err);
    }
}));
router.use(errors_1.errorHandler);
exports.default = router;
