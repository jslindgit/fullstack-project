"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const axios_1 = __importDefault(require("axios"));
const sequelize_1 = require("sequelize");
const handleError = (error) => {
    console.trace();
    if (axios_1.default.isAxiosError(error)) {
        console.error('Axios error.');
        if (error.response) {
            console.error('error.response.data:', error.response.data);
            console.error('error.response.status:', error.response.status);
            console.error('error.response.headers:', error.response.headers);
        }
        else if (error.request) {
            console.error('error.request:', error.request);
        }
        else {
            console.error('error.message:', error.message);
        }
    }
    else {
        console.error('Non-Axios Error:', error);
    }
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
        errorMessage = error.name + ': ' + error.message;
        if (error instanceof sequelize_1.ValidationError) {
            errorMessage += ' (';
            error.errors.forEach((e) => {
                errorMessage += e.message + ', ';
            });
            errorMessage = errorMessage.substring(0, errorMessage.length - 2) + ')';
        }
    }
    console.error(`error_handler.handleError: ${errorMessage}`);
    throw new Error(errorMessage);
};
exports.handleError = handleError;
