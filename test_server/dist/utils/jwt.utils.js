"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../env");
const const_1 = require("../const");
const user_enums_1 = require("../modules/user/user.enums");
const JwtUtils = {
    generateAccessToken: (payload) => {
        if (!payload) {
            throw new Error('Generate AccessToken Payload Cant Be Null');
        }
        return jsonwebtoken_1.default.sign(payload, env_1.env.JWT_ACCESS_TOKEN_SECRET_KEY, {
            expiresIn: const_1.accessTokenExpiresIn,
        });
    },
    generateRefreshToken: (payload) => {
        if (!payload) {
            throw new Error('Generate RefreshToken Payload Cant Be Null');
        }
        const { rememberMe, sub, sid, provider } = payload;
        if (rememberMe ||
            provider === user_enums_1.AuthType.GOOGLE ||
            provider === user_enums_1.AuthType.LOCAL) {
            return jsonwebtoken_1.default.sign({ sub, sid }, env_1.env.JWT_REFRESH_TOKEN_SECRET_KEY, {
                expiresIn: const_1.refreshTokenExpiresIn,
            });
        }
        else {
            return jsonwebtoken_1.default.sign({ sub, sid }, env_1.env.JWT_REFRESH_TOKEN_SECRET_KEY, {
                expiresIn: const_1.refreshTokenExpiresInWithoutRememberMe,
            });
        }
    },
    generateRecoverToken: (payload) => {
        if (!payload) {
            throw new Error('Generate RecoverToken Payload Cant Be Null');
        }
        return jsonwebtoken_1.default.sign(payload, env_1.env.JWT_RECOVER_SESSION_TOKEN_SECRET_KEY, {
            expiresIn: const_1.recoverSessionExpiresIn,
        });
    },
    generateActivationToken: (payload) => {
        if (!payload) {
            throw new Error('Generate Activation Payload Cant Be Null');
        }
        return jsonwebtoken_1.default.sign(payload, env_1.env.JWT_ACTIVATION_TOKEN_SECRET_KEY, {
            expiresIn: const_1.activationTokenExpiresIn,
        });
    },
    generateChangePasswordPageToken: (payload) => {
        if (!payload) {
            throw new Error('Generate Change Password Page Token Payload Cant Be Null');
        }
        return jsonwebtoken_1.default.sign(payload, env_1.env.JWT_CHANGE_PASSWORD_PAGE_TOKEN_SECRET_KEY, {
            expiresIn: const_1.changePasswordPageTokenExpiresIn,
        });
    },
    generateClearDevicePageToken: (payload) => {
        if (!payload) {
            throw new Error('Generate Change Password Page Token Payload Cant Be Null');
        }
        return jsonwebtoken_1.default.sign(payload, env_1.env.JWT_CLEAR_DEVICE_TOKEN_SECRET_KEY, {
            expiresIn: const_1.clearDevicePageTokenExpireIn,
        });
    },
    generateAddPasswordPageToken: (payload) => {
        if (!payload) {
            throw new Error('Generate Add Password Page Token Payload Cant Be Null');
        }
        return jsonwebtoken_1.default.sign(payload, env_1.env.JWT_ADD_PASSWORD_PAGE_TOKEN_SECRET_KEY, {
            expiresIn: const_1.addPasswordPageTokenExpiresIn,
        });
    },
    verifyAddPasswordPageToken: (token) => {
        if (!token) {
            throw new Error('Add Password Page Token Is Missing');
        }
        return jsonwebtoken_1.default.verify(token, env_1.env.JWT_ADD_PASSWORD_PAGE_TOKEN_SECRET_KEY);
    },
    verifyClearDevicePageToken: (token) => {
        if (!token) {
            throw new Error('Clear Device Page Token Is Missing');
        }
        return jsonwebtoken_1.default.verify(token, env_1.env.JWT_CLEAR_DEVICE_TOKEN_SECRET_KEY);
    },
    verifyChangePasswordPageToken: (token) => {
        if (!token) {
            throw new Error('Change Password Page Token Is Missing');
        }
        return jsonwebtoken_1.default.verify(token, env_1.env.JWT_CHANGE_PASSWORD_PAGE_TOKEN_SECRET_KEY);
    },
    verifyAccessToken: (token) => {
        if (!token) {
            throw new Error('Access Token Is Missing');
        }
        return jsonwebtoken_1.default.verify(token, env_1.env.JWT_ACCESS_TOKEN_SECRET_KEY);
    },
    verifyRefreshToken: (token) => {
        if (!token) {
            throw new Error('Refresh Token Is Missing');
        }
        return jsonwebtoken_1.default.verify(token, env_1.env.JWT_REFRESH_TOKEN_SECRET_KEY);
    },
    verifyRecoverToken: (token) => {
        if (!token) {
            throw new Error('Recover Token Is Missing');
        }
        return jsonwebtoken_1.default.verify(token, env_1.env.JWT_RECOVER_SESSION_TOKEN_SECRET_KEY);
    },
    verifyActivationToken: (token) => {
        if (!token) {
            throw new Error('Activation Token Is Missing');
        }
        return jsonwebtoken_1.default.verify(token, env_1.env.JWT_ACTIVATION_TOKEN_SECRET_KEY);
    },
};
exports.default = JwtUtils;
