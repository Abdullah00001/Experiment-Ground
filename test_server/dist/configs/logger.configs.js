"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const { printf, timestamp, combine, json, colorize } = winston_1.format;
const loggerFormat = printf(({ timestamp, message, level }) => {
    return `${timestamp} ${level} ${message}`;
});
const logger = (0, winston_1.createLogger)({
    level: 'info',
    format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), colorize(), json(), loggerFormat),
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.File({
            filename: 'logs/combine.log',
            format: combine(json()),
        }),
        new winston_1.transports.File({
            level: 'info',
            filename: 'logs/info.log',
            format: combine(json()),
        }),
        new winston_1.transports.File({
            level: 'error',
            filename: 'logs/error.log',
            format: combine(json()),
        }),
    ],
});
exports.default = logger;
