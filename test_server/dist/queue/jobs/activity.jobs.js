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
const ActivityQueueJobs = {
    loginFailedActivitySavedInDb: (data) => __awaiter(void 0, void 0, void 0, function* () {
        yield queues_1.ActivityQueue.add('save-login-failed-activity-to-db', data, {
            attempts: 3,
            removeOnComplete: true,
            backoff: { type: 'exponential', delay: 3000 },
        });
    }),
    loginSuccessActivitySavedInDb: (data) => __awaiter(void 0, void 0, void 0, function* () {
        yield queues_1.ActivityQueue.add('save-login-activity-to-db', data, {
            attempts: 3,
            removeOnComplete: true,
            backoff: { type: 'exponential', delay: 3000 },
        });
    }),
    signupSuccessActivitySavedInDb: (data) => __awaiter(void 0, void 0, void 0, function* () {
        yield queues_1.ActivityQueue.add('save-signup-activity-to-db', data, {
            attempts: 3,
            removeOnComplete: true,
            backoff: { type: 'exponential', delay: 3000 },
        });
    }),
    accountLockActivitySavedInDb: (data) => __awaiter(void 0, void 0, void 0, function* () {
        yield queues_1.ActivityQueue.add('save-account-lock-activity-to-db', data, {
            attempts: 3,
            removeOnComplete: true,
            backoff: { type: 'exponential', delay: 3000 },
        });
    }),
    accountUnlockActivitySavedInDb: (data) => __awaiter(void 0, void 0, void 0, function* () {
        yield queues_1.ActivityQueue.add('save-account-unlock-activity-to-db', data, {
            attempts: 3,
            removeOnComplete: true,
            backoff: { type: 'exponential', delay: 3000 },
        });
    }),
    passwordResetActivitySavedInDb: (data) => __awaiter(void 0, void 0, void 0, function* () {
        yield queues_1.ActivityQueue.add('save-account-password-reset-activity-to-db', data, {
            attempts: 3,
            removeOnComplete: true,
            backoff: { type: 'exponential', delay: 3000 },
        });
    }),
    scheduleAccountDeletionActivitySavedInDb: (data) => __awaiter(void 0, void 0, void 0, function* () {
        yield queues_1.ActivityQueue.add('save-schedule-account-deletion-activity-to-db', data, {
            attempts: 3,
            removeOnComplete: true,
            backoff: { type: 'exponential', delay: 3000 },
        });
    }),
};
exports.default = ActivityQueueJobs;
