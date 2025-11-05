"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_configs_1 = __importDefault(require("../configs/logger.configs"));
const const_1 = require("../const");
const corsConfiguration = {
    origin: (origin, callback) => {
        if (!origin || const_1.corsWhiteList.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            logger_configs_1.default.warn(`Blocked CORS request from origin: ${origin}`);
            callback(new Error('CORS not allowed'), false);
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 200,
};
exports.default = corsConfiguration;
