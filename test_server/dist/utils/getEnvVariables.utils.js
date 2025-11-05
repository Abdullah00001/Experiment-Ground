"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvVariable = void 0;
const dotenv_1 = require("dotenv");
const path_1 = __importDefault(require("path"));
(0, dotenv_1.config)({ path: path_1.default.resolve(__dirname, '../../.env.local') });
const load = process.env;
const getEnvVariable = (key) => {
    const value = load[key];
    if (!value) {
        throw new Error(`Missing Environment Variable: ${key}`);
    }
    return value;
};
exports.getEnvVariable = getEnvVariable;
