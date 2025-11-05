"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const getEnvVariables_utils_1 = require("./utils/getEnvVariables.utils");
exports.env = {
    MONGODB_URI: (0, getEnvVariables_utils_1.getEnvVariable)('MONGODB_URI'),
    NODE_ENV: (0, getEnvVariables_utils_1.getEnvVariable)('NODE_ENV'),
    JWT_ACCESS_TOKEN_SECRET_KEY: (0, getEnvVariables_utils_1.getEnvVariable)('JWT_ACCESS_TOKEN_SECRET_KEY'),
    JWT_REFRESH_TOKEN_SECRET_KEY: (0, getEnvVariables_utils_1.getEnvVariable)('JWT_REFRESH_TOKEN_SECRET_KEY'),
    SMTP_HOST: (0, getEnvVariables_utils_1.getEnvVariable)('SMTP_HOST'),
    SMTP_PORT: parseInt((0, getEnvVariables_utils_1.getEnvVariable)('SMTP_PORT')),
    SMTP_USER: (0, getEnvVariables_utils_1.getEnvVariable)('SMTP_USER'),
    SMTP_PASS: (0, getEnvVariables_utils_1.getEnvVariable)('SMTP_PASS'),
    CLOUDINARY_NAME: (0, getEnvVariables_utils_1.getEnvVariable)('CLOUDINARY_NAME'),
    CLOUDINARY_API_KEY: (0, getEnvVariables_utils_1.getEnvVariable)('CLOUDINARY_API_KEY'),
    CLOUDINARY_API_SECRET_KEY: (0, getEnvVariables_utils_1.getEnvVariable)('CLOUDINARY_API_SECRET_KEY'),
    JWT_RECOVER_SESSION_TOKEN_SECRET_KEY: (0, getEnvVariables_utils_1.getEnvVariable)('JWT_RECOVER_SESSION_TOKEN_SECRET_KEY'),
    GOOGLE_CLIENT_ID: (0, getEnvVariables_utils_1.getEnvVariable)('GOOGLE_CLIENT_ID'),
    GOOGLE_CLIENT_SECRET: (0, getEnvVariables_utils_1.getEnvVariable)('GOOGLE_CLIENT_SECRET'),
    CALLBACK_URL: (0, getEnvVariables_utils_1.getEnvVariable)('CALLBACK_URL'),
    CLIENT_BASE_URL: (0, getEnvVariables_utils_1.getEnvVariable)('CLIENT_BASE_URL'),
    OTP_HASH_SECRET: (0, getEnvVariables_utils_1.getEnvVariable)('OTP_HASH_SECRET'),
    JWT_ACTIVATION_TOKEN_SECRET_KEY: (0, getEnvVariables_utils_1.getEnvVariable)('JWT_ACTIVATION_TOKEN_SECRET_KEY'),
    RECAPTCHA_SECRET_KEY: (0, getEnvVariables_utils_1.getEnvVariable)('RECAPTCHA_SECRET_KEY'),
    SERVER_BASE_URL: (0, getEnvVariables_utils_1.getEnvVariable)('SERVER_BASE_URL'),
    JWT_CHANGE_PASSWORD_PAGE_TOKEN_SECRET_KEY: (0, getEnvVariables_utils_1.getEnvVariable)('JWT_CHANGE_PASSWORD_PAGE_TOKEN_SECRET_KEY'),
    JWT_CLEAR_DEVICE_TOKEN_SECRET_KEY: (0, getEnvVariables_utils_1.getEnvVariable)('JWT_CLEAR_DEVICE_TOKEN_SECRET_KEY'),
    JWT_ADD_PASSWORD_PAGE_TOKEN_SECRET_KEY: (0, getEnvVariables_utils_1.getEnvVariable)('JWT_ADD_PASSWORD_PAGE_TOKEN_SECRET_KEY'),
    REDIS_HOST: (0, getEnvVariables_utils_1.getEnvVariable)('REDIS_HOST'),
    REDIS_PASSWORD: (0, getEnvVariables_utils_1.getEnvVariable)('REDIS_PASSWORD'),
    REDIS_PORT: (0, getEnvVariables_utils_1.getEnvVariable)('REDIS_PORT'),
};
