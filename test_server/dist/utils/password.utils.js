"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const const_1 = require("../const");
const logger_configs_1 = __importDefault(require("../configs/logger.configs"));
const PasswordUtils = {
    hashPassword: (passwordString) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield bcrypt_1.default.hash(passwordString, const_1.saltRound);
        }
        catch (error) {
            if (error instanceof Error) {
                logger_configs_1.default.warn(`Error Occurred In Hash Password Utils: ${error.message}`);
                return null;
            }
            else {
                logger_configs_1.default.warn('Unexpected Error Occurred In Hash Password Utils');
                return null;
            }
        }
    }),
    comparePassword: (requestedPassword, hashPassword) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield bcrypt_1.default.compare(requestedPassword, hashPassword);
        }
        catch (error) {
            if (error instanceof Error) {
                logger_configs_1.default.warn(`Error Occurred In Compare Password Utils: ${error.message}`);
                return null;
            }
            else {
                logger_configs_1.default.warn('Unexpected Error Occurred In Compare Password Utils');
                return null;
            }
        }
    }),
};
exports.default = PasswordUtils;
