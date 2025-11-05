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
const redis_configs_1 = __importDefault(require("../configs/redis.configs"));
const const_1 = require("../const");
const env_1 = require("../env");
const calculation_utils_1 = __importDefault(require("../utils/calculation.utils"));
const ua_parser_js_1 = require("ua-parser-js");
const { calculateMilliseconds } = calculation_utils_1.default;
const ExtractMetaData = {
    getRealIP: (req) => {
        const forwarded = req.headers['x-forwarded-for'];
        const realIp = req.headers['x-real-ip'];
        const socketIp = req.socket.remoteAddress;
        if (env_1.env.NODE_ENV === 'development') {
            return '203.0.113.42';
        }
        if (forwarded) {
            return forwarded.split(',')[0].trim();
        }
        if (realIp) {
            return realIp;
        }
        return socketIp || '';
    },
    getLocation: (ipAddress) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield (0, const_1.getLocationFromIP)(ipAddress);
        }
        catch (error) {
            if (error instanceof Error)
                throw error;
            else
                throw new Error('Unknown Error Occurred In Retrieve Location From Ip');
        }
    }),
    getClientMetaData: (req) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const ipAddress = ExtractMetaData.getRealIP(req);
            const location = (yield ExtractMetaData.getLocation(ipAddress));
            const { browser, device, os } = (0, ua_parser_js_1.UAParser)((_a = req.useragent) === null || _a === void 0 ? void 0 : _a.source);
            return { browser, device, os, location, ip: ipAddress };
        }
        catch (error) {
            if (error instanceof Error)
                throw error;
            else
                throw new Error('Unknown Error Occurred In Extract Meta Data');
        }
    }),
    setAccountDeletionMetaData: (_a) => __awaiter(void 0, [_a], void 0, function* ({ deleteAt, jobId, scheduleAt, userId, }) {
        yield redis_configs_1.default.set(`user:${userId}:delete-meta`, JSON.stringify({ deleteAt, jobId, scheduleAt }), 'PX', calculateMilliseconds(7, 'days'));
        return;
    }),
};
exports.default = ExtractMetaData;
