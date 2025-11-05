"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpUtils = void 0;
const crypto_1 = __importDefault(require("crypto"));
/**
 * OtpUtils provides methods for hashing and comparing OTPs securely.
 * Uses HMAC-SHA256 with a secret key and timing-safe comparison.
 *
 * Example:
 * const otpUtils = new OtpUtils(process.env.OTP_SECRET!);
 * const hash = otpUtils.hashOtp({ otp: '123456' });
 * const isValid = otpUtils.compareOtp({ hashedOtp: hash, otp: '123456' });
 */
class OtpUtils {
    constructor(secret) {
        this.secret = secret;
        this.secret = secret;
    }
    /**
     * Hashes a plain OTP using HMAC-SHA256.
     * @param otp - The OTP string to hash
     * @returns The hashed OTP in hexadecimal format
     */
    hashOtp({ otp }) {
        const hashedOtp = crypto_1.default
            .createHmac('sha256', this.secret)
            .update(otp)
            .digest('hex');
        return hashedOtp;
    }
    /**
     * Compares a user-provided OTP with a stored hash in a timing-safe way.
     * @param hashedOtp - The stored hashed OTP
     * @param otp - The OTP provided by the user
     * @returns True if OTP matches, false otherwise
     */
    compareOtp({ hashedOtp, otp }) {
        const inputHashedOtp = this.hashOtp({ otp });
        const hashOtpBuffer = Buffer.from(hashedOtp, 'hex');
        const inputHashedOtpBuffer = Buffer.from(inputHashedOtp, 'hex');
        if (inputHashedOtpBuffer.length !== hashOtpBuffer.length)
            return false;
        return crypto_1.default.timingSafeEqual(hashOtpBuffer, inputHashedOtpBuffer);
    }
}
exports.OtpUtils = OtpUtils;
