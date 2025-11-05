"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const CalculationUtils = {
    calculateMilliseconds: (value, unit) => {
        const lowerCaseUnit = unit.toLowerCase();
        switch (lowerCaseUnit) {
            case 'millisecond':
            case 'milliseconds':
                return value;
            case 'second':
            case 'seconds':
                return value * 1000;
            case 'minute':
            case 'minutes':
                return value * 60 * 1000;
            case 'hour':
            case 'hours':
                return value * 60 * 60 * 1000;
            case 'day':
            case 'days':
                return value * 24 * 60 * 60 * 1000;
            default:
                return NaN;
        }
    },
    stringToNumber: (value) => {
        const result = value.slice(0, -1);
        return Number(result);
    },
    expiresInTimeUnitToMs: (expiresIn) => {
        const match = expiresIn.match(/^(\d+)(ms|s|m|h|d)$/);
        if (!match)
            throw new Error('Invalid expiresIn format');
        const value = Number(match[1]);
        const unit = match[2];
        switch (unit) {
            case 'ms':
                return value;
            case 's':
                return value * 1000;
            case 'm':
                return value * 60 * 1000;
            case 'h':
                return value * 60 * 60 * 1000;
            case 'd':
                return value * 24 * 60 * 60 * 1000;
            default:
                throw new Error('Unsupported time unit');
        }
    },
    generateEtag: (data) => {
        try {
            const dataString = JSON.stringify(data);
            const hashed = crypto_1.default.createHash('md5').update(dataString).digest('hex');
            return `${hashed}`;
        }
        catch (error) {
            if (error instanceof Error)
                throw error;
            else
                throw new Error('unknown error occurred in generateEtag utility');
        }
    },
};
exports.default = CalculationUtils;
