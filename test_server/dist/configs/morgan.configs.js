"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamConfig = exports.morganMessageFormat = void 0;
const logger_configs_1 = __importDefault(require("../configs/logger.configs"));
const morganMessageFormat = '":method :url HTTP/:http-version" :status :res[content-length] :response-time ms';
exports.morganMessageFormat = morganMessageFormat;
const streamConfig = (message) => {
    const parts = message.match(/"([^"]+)" (\d+) (\d+|-) ([\d.]+ ms)/);
    if (parts) {
        const logObject = {
            method: parts[1].split(' ')[0],
            url: parts[1].split(' ')[1],
            status: parts[2],
            res: parts[3] === '-' ? '0' : parts[3],
            responseTime: parts[4],
        };
        logger_configs_1.default.info(`Method: ${logObject.method}, URL: ${logObject.url}, Status: ${logObject.status}, Res: ${logObject.res}, Response Time: ${logObject.responseTime}`);
    }
};
exports.streamConfig = streamConfig;
