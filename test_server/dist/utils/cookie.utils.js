"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("../env");
const CookieUtils = {
    cookieOption: (expiresIn) => {
        const option = {
            httpOnly: true,
            secure: env_1.env.NODE_ENV === 'production',
            sameSite: env_1.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/',
        };
        const match = expiresIn.match(/^(\d+)(ms|s|m|h|d)$/);
        if (!match)
            throw new Error('Invalid expiresIn format');
        const value = Number(match[1]);
        const unit = match[2];
        switch (unit) {
            case 'ms':
                option.maxAge = value;
                break;
            case 's':
                option.maxAge = value * 1000;
                break;
            case 'm':
                option.maxAge = value * 60 * 1000;
                break;
            case 'h':
                option.maxAge = value * 60 * 60 * 1000;
                break;
            case 'd':
                option.maxAge = value * 24 * 60 * 60 * 1000;
                break;
            default:
                throw new Error('Unsupported time unit');
        }
        return option;
    },
    sharedCookieOption: () => {
        return {
            httpOnly: false,
            secure: env_1.env.NODE_ENV === 'production',
            sameSite: env_1.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/',
            maxAge: 1 * 24 * 60 * 60 * 1000,
        };
    },
};
exports.default = CookieUtils;
