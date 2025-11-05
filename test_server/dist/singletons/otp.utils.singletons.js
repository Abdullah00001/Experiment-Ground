"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpUtilsSingleton = void 0;
const env_1 = require("../env");
const otp_utils_1 = require("../utils/otp.utils");
let otpUtilsInstance = null;
const OtpUtilsSingleton = () => {
    if (!otpUtilsInstance) {
        otpUtilsInstance = new otp_utils_1.OtpUtils(env_1.env.OTP_HASH_SECRET);
    }
    return otpUtilsInstance;
};
exports.OtpUtilsSingleton = OtpUtilsSingleton;
