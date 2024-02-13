"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.guidv4 = exports.calculateHmac = exports.TEST_SECRET = exports.TEST_ACCOUNT = void 0;
exports.TEST_ACCOUNT = process.env.PAYTRAIL_TEST_ACCOUNT;
exports.TEST_SECRET = process.env.PAYTRAIL_TEST_SECRET;
const crypto_1 = __importDefault(require("crypto"));
const calculateHmac = (secret, params, body) => {
    const hmacPayload = Object.keys(params)
        .sort()
        .map((key) => [key, params[key]].join(':'))
        .concat(body ? JSON.stringify(body) : '')
        .join('\n');
    return crypto_1.default.createHmac('sha256', secret).update(hmacPayload).digest('hex');
};
exports.calculateHmac = calculateHmac;
const guidv4 = (data) => {
    // Generate 16 bytes (128 bits) of random data or use the data passed into the function.
    data = data || crypto_1.default.getRandomValues(new Uint8Array(16));
    // Set version to 0100
    data[6] = (data[6] & 0x0f) | 0x40;
    // Set bits 6-7 to 10
    data[8] = (data[8] & 0x3f) | 0x80;
    // Output the 36 character UUID.
    return `${toHex(data.subarray(0, 4))}-${toHex(data.subarray(4, 6))}-${toHex(data.subarray(6, 8))}-${toHex(data.subarray(8, 10))}-${toHex(data.subarray(10, 16))}`;
};
exports.guidv4 = guidv4;
const toHex = (buffer) => {
    return Array.from(buffer)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
};
