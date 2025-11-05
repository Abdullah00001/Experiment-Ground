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
const logger_configs_1 = __importDefault(require("../../configs/logger.configs"));
const nodemailer_configs_1 = __importDefault(require("../../configs/nodemailer.configs"));
const redis_configs_1 = __importDefault(require("../../configs/redis.configs"));
const verificationEmailTemplate_1 = require("../../templates/verificationEmailTemplate");
const date_utils_1 = __importDefault(require("../../utils/date.utils"));
const mailOption_utils_1 = __importDefault(require("../../utils/mailOption.utils"));
const bullmq_1 = require("bullmq");
const handlebars_1 = __importDefault(require("handlebars"));
const const_1 = require("../../const");
const accountRecoveryEmailTemplate_1 = require("../../templates/accountRecoveryEmailTemplate");
const passwordResetNotificationTemplate_1 = require("../../templates/passwordResetNotificationTemplate");
const failedLoginAttemptEmailTemplate_1 = __importDefault(require("../../templates/failedLoginAttemptEmailTemplate"));
const signupSuccessEmailTemplate_1 = __importDefault(require("../../templates/signupSuccessEmailTemplate"));
const loginSuccessEmailTemplate_1 = __importDefault(require("../../templates/loginSuccessEmailTemplate"));
const accountLockedEmailTemplate_1 = require("../../templates/accountLockedEmailTemplate");
const accountUnLockedEmailTemplate_1 = require("../../templates/accountUnLockedEmailTemplate");
const accountDeletationScheduleEmailTemplate_1 = __importDefault(require("../../templates/accountDeletationScheduleEmailTemplate"));
const accountDeletationScheduleCancelAndLoginEmailTemplate_1 = __importDefault(require("../../templates/accountDeletationScheduleCancelAndLoginEmailTemplate"));
const { formatDateTime } = date_utils_1.default;
const worker = new bullmq_1.Worker('email-queue', (job) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, data, id } = job;
    try {
        if (name === 'send-account-verification-otp-email') {
            const template = handlebars_1.default.compile(verificationEmailTemplate_1.verificationEmailTemplate);
            const personalizedTemplate = template(data);
            yield nodemailer_configs_1.default.sendMail((0, mailOption_utils_1.default)(data.email, 'Email Verification Required', personalizedTemplate));
            return;
        }
        if (name === 'send-account-recover-otp-email') {
            const { email, expirationTime, name, otp } = data;
            const templateData = {
                expirationTime,
                name,
                otp,
                companyName: 'Workly Contacts',
                supportEmail: const_1.supportEmail,
                year: new Date().getFullYear(),
            };
            const template = handlebars_1.default.compile(accountRecoveryEmailTemplate_1.accountRecoveryEmailTemplate);
            const personalizedTemplate = template(templateData);
            yield nodemailer_configs_1.default.sendMail((0, mailOption_utils_1.default)(email, 'Your Verification Code - Workly Contacts', personalizedTemplate));
            return;
        }
        if (name === 'send-password-reset-notification-email') {
            const { device, email, ipAddress, location, name } = data;
            const templateData = {
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
            const personalizedTemplate = template(templateData);
            yield nodemailer_configs_1.default.sendMail((0, mailOption_utils_1.default)(email, 'Security Alert: Your Password Was Reset', personalizedTemplate));
            return;
        }
        if (name === 'send-login-failed-notification-email') {
            const { browser, device, email, ip, location, name, os, time } = data;
            const templateData = { browser, device, ip, location, name, os, time };
            const template = handlebars_1.default.compile(failedLoginAttemptEmailTemplate_1.default);
            const personalizedTemplate = template(templateData);
            yield nodemailer_configs_1.default.sendMail((0, mailOption_utils_1.default)(email, 'Security Alert: Some One Try to Access Your Account', personalizedTemplate));
            return;
        }
        if (name === 'send-signup-success-notification-email') {
            const { email, name } = data;
            const templateData = { email, name };
            const template = handlebars_1.default.compile(signupSuccessEmailTemplate_1.default);
            const personalizedTemplate = template(templateData);
            yield nodemailer_configs_1.default.sendMail((0, mailOption_utils_1.default)(email, 'Welcome To Workly Contacts', personalizedTemplate));
            return;
        }
        if (name === 'send-login-success-notification-email') {
            const { email, name, browser, device, ip, location, os, time } = data;
            const templateData = { name, browser, device, ip, location, os, time };
            const template = handlebars_1.default.compile(loginSuccessEmailTemplate_1.default);
            const personalizedTemplate = template(templateData);
            yield nodemailer_configs_1.default.sendMail((0, mailOption_utils_1.default)(email, 'New sign-in detected on your workly account', personalizedTemplate));
            return;
        }
        if (name === 'send-account-lock-notification-email') {
            const { activeLink, name, time, email } = data;
            const templateData = { activeLink, name, time };
            const template = handlebars_1.default.compile(accountLockedEmailTemplate_1.accountLockedEmailTemplate);
            const personalizedTemplate = template(templateData);
            yield nodemailer_configs_1.default.sendMail((0, mailOption_utils_1.default)(email, 'Action Required: Your workly-contact account has been locked', personalizedTemplate));
            return;
        }
        if (name === 'send-account-unlock-notification-email') {
            const { name, time, email } = data;
            const templateData = { name, time };
            const template = handlebars_1.default.compile(accountUnLockedEmailTemplate_1.accountUnlockedEmailTemplate);
            const personalizedTemplate = template(templateData);
            yield nodemailer_configs_1.default.sendMail((0, mailOption_utils_1.default)(email, 'Your workly-contact account is now active', personalizedTemplate));
            return;
        }
        if (name === 'send-account-schedule-deletion-notification-email') {
            const { name, deleteAt, scheduleAt, email } = data;
            const templateData = { name, deleteAt, scheduleAt, email };
            const template = handlebars_1.default.compile(accountDeletationScheduleEmailTemplate_1.default);
            const personalizedTemplate = template(templateData);
            yield nodemailer_configs_1.default.sendMail((0, mailOption_utils_1.default)(email, 'Your Workly Contacts account is scheduled for deletion', personalizedTemplate));
            return;
        }
        if (name ===
            'send-account-schedule-deletion-cancel-and-login-notification-email') {
            const { name, deleteAt, browser, device, ip, location, os, time, email, } = data;
            const templateData = {
                name,
                deleteAt,
                browser,
                device,
                ip,
                location,
                os,
                time,
                email,
            };
            const template = handlebars_1.default.compile(accountDeletationScheduleCancelAndLoginEmailTemplate_1.default);
            const personalizedTemplate = template(templateData);
            yield nodemailer_configs_1.default.sendMail((0, mailOption_utils_1.default)(email, 'Welcome Back to Workly Contacts', personalizedTemplate));
            return;
        }
    }
    catch (error) {
        logger_configs_1.default.error('Worker job failed', { jobName: name, jobId: id, error });
        throw error;
    }
}), { connection: redis_configs_1.default });
worker.on('completed', (job) => {
    logger_configs_1.default.info(`Job Name : ${job.name} Job Id : ${job.id} Completed`);
});
worker.on('failed', (job, error) => {
    if (!job) {
        logger_configs_1.default.error(`A job failed but the job data is undefined.\nError:\n${error}`);
        return;
    }
    logger_configs_1.default.error(`Job Name : ${job.name} Job Id : ${job.id} Failed\nError:\n${error}`);
});
