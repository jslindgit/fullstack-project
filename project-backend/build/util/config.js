"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECRET = exports.PORT = exports.DATABASE_URL = exports.API_KEY = void 0;
require("dotenv/config");
exports.API_KEY = process.env.API_KEY;
exports.DATABASE_URL = process.env.DATABASE_URL;
exports.PORT = process.env.PORT || 3001;
exports.SECRET = process.env.SECRET;
