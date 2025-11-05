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
const handlebars_1 = __importDefault(require("handlebars"));
const nodemailer_configs_1 = __importDefault(require("../configs/nodemailer.configs"));
const mailOption_utils_1 = __importDefault(require("../utils/mailOption.utils"));
const verificationEmailTemplate_1 = require("../templates/verificationEmailTemplate");
const const_1 = require("../const");
const accountRecoveryEmailTemplate_1 = require("../templates/accountRecoveryEmailTemplate");
const passwordResetNotificationTemplate_1 = require("../templates/passwordResetNotificationTemplate");
const date_utils_1 = __importDefault(require("../utils/date.utils"));
const { formatDateTime } = date_utils_1.default;
const SendEmail = {
    sendAccountVerificationOtpEmail: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const template = handlebars_1.default.compile(verificationEmailTemplate_1.verificationEmailTemplate);
            const personalizedTemplate = template(data);
            yield nodemailer_configs_1.default.sendMail((0, mailOption_utils_1.default)(data.email, 'Email Verification Required', personalizedTemplate));
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Send Account Verification Otp Email Utility');
            }
        }
    }),
    sendAccountRecoverOtpEmail: (_a) => __awaiter(void 0, [_a], void 0, function* ({ email, expirationTime, name, otp, }) {
        try {
            const data = {
                expirationTime,
                name,
                otp,
                companyName: 'Workly Contacts',
                supportEmail: const_1.supportEmail,
                year: new Date().getFullYear(),
            };
            const template = handlebars_1.default.compile(accountRecoveryEmailTemplate_1.accountRecoveryEmailTemplate);
            const personalizedTemplate = template(data);
            yield nodemailer_configs_1.default.sendMail((0, mailOption_utils_1.default)(email, 'Your Verification Code - Workly Contacts', personalizedTemplate));
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Send Account Recover Otp Email Utility');
            }
        }
    }),
    sendPasswordResetNotificationEmail: (_a) => __awaiter(void 0, [_a], void 0, function* ({ device, email, ipAddress, location, name, }) {
        try {
            const data = {
                dashboardUrl: const_1.dashboardUrl,
                device,
                ipAddress,
                location,
                name,
                profileUrl: const_1.profileUrl,
                resetDateTime: formatDateTime(new Date().toISOString()),
                supportEmail: const_1.supportEmail,
            };
            const template = handlebars_1.default.compile(passwordResetNotificationTemplate_1.passwordResetNotificationTemplate);
            const personalizedTemplate = template(data);
            yield nodemailer_configs_1.default.sendMail((0, mailOption_utils_1.default)(email, 'Security Alert: Your Password Was Reset', personalizedTemplate));
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Send Password Reset Notification Email Utility');
            }
        }
    }),
};
exports.default = SendEmail;
