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
Object.defineProperty(exports, "__esModule", { value: true });
const queues_1 = require("../../queue/queues");
const EmailQueueJobs = {
    addSendAccountVerificationOtpEmailToQueue: (data) => __awaiter(void 0, void 0, void 0, function* () {
        yield queues_1.EmailQueue.add('send-account-verification-otp-email', data, {
            attempts: 3,
            removeOnComplete: true,
            backoff: { type: 'exponential', delay: 3000 },
        });
    }),
    addSendAccountRecoverOtpEmailToQueue: (data) => __awaiter(void 0, void 0, void 0, function* () {
        yield queues_1.EmailQueue.add('send-account-recover-otp-email', data, {
            attempts: 3,
            removeOnComplete: true,
            backoff: { type: 'exponential', delay: 3000 },
        });
    }),
    addSendPasswordResetNotificationEmailToQueue: (data) => __awaiter(void 0, void 0, void 0, function* () {
        yield queues_1.EmailQueue.add('send-password-reset-notification-email', data, {
            attempts: 3,
            removeOnComplete: true,
            backoff: { type: 'exponential', delay: 3000 },
        });
    }),
    loginFailedNotificationEmailToQueue: (data) => __awaiter(void 0, void 0, void 0, function* () {
        yield queues_1.EmailQueue.add('send-login-failed-notification-email', data, {
            attempts: 3,
            removeOnComplete: true,
            backoff: { type: 'exponential', delay: 3000 },
        });
    }),
    addSendSignupSuccessNotificationEmailToQueue: (data) => __awaiter(void 0, void 0, void 0, function* () {
        yield queues_1.EmailQueue.add('send-signup-success-notification-email', data, {
            attempts: 3,
            removeOnComplete: true,
            backoff: { type: 'exponential', delay: 3000 },
        });
    }),
    addLoginSuccessNotificationEmailToQueue: (data) => __awaiter(void 0, void 0, void 0, function* () {
        yield queues_1.EmailQueue.add('send-login-success-notification-email', data, {
            attempts: 3,
            removeOnComplete: true,
            backoff: { type: 'exponential', delay: 3000 },
        });
    }),
    addAccountLockNotificationToQueue: (data) => __awaiter(void 0, void 0, void 0, function* () {
        yield queues_1.EmailQueue.add('send-account-lock-notification-email', data, {
            attempts: 3,
            removeOnComplete: true,
            backoff: { type: 'exponential', delay: 3000 },
        });
    }),
    addAccountUnlockNotificationToQueue: (data) => __awaiter(void 0, void 0, void 0, function* () {
        yield queues_1.EmailQueue.add('send-account-unlock-notification-email', data, {
            attempts: 3,
            removeOnComplete: true,
            backoff: { type: 'exponential', delay: 3000 },
        });
    }),
    addAccountScheduleDeletionNotificationToQueue: (data) => __awaiter(void 0, void 0, void 0, function* () {
        yield queues_1.EmailQueue.add('send-account-schedule-deletion-notification-email', data, {
            attempts: 3,
            removeOnComplete: true,
            backoff: { type: 'exponential', delay: 3000 },
        });
    }),
    addAccountScheduleDeletionCancelAndLoginNotificationToQueue: (data) => __awaiter(void 0, void 0, void 0, function* () {
        yield queues_1.EmailQueue.add('send-account-schedule-deletion-cancel-and-login-notification-email', data, {
            attempts: 3,
            removeOnComplete: true,
            backoff: { type: 'exponential', delay: 3000 },
        });
    }),
};
exports.default = EmailQueueJobs;
