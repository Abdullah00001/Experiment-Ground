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
const bullmq_1 = require("bullmq");
const logger_configs_1 = __importDefault(require("../../configs/logger.configs"));
const user_models_1 = require("../../modules/user/user.models");
const redis_configs_1 = __importDefault(require("../../configs/redis.configs"));
const worker = new bullmq_1.Worker('activity-queue', (job) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, data, id } = job;
    try {
        if (name === 'save-login-failed-activity-to-db') {
            const newActivity = new user_models_1.Activity(data);
            yield newActivity.save();
            return;
        }
        if (name === 'save-signup-activity-to-db') {
            const newActivity = new user_models_1.Activity(data);
            yield newActivity.save();
            return;
        }
        if (name === 'save-login-activity-to-db') {
            const newActivity = new user_models_1.Activity(data);
            yield newActivity.save();
            return;
        }
        if (name === 'save-account-lock-activity-to-db') {
            const newActivity = new user_models_1.Activity(data);
            yield newActivity.save();
            return;
        }
        if (name === 'save-account-unlock-activity-to-db') {
            const newActivity = new user_models_1.Activity(data);
            yield newActivity.save();
            return;
        }
        if (name === 'save-account-password-reset-activity-to-db') {
            const newActivity = new user_models_1.Activity(data);
            yield newActivity.save();
            return;
        }
        if (name === 'save-schedule-account-deletion-activity-to-db') {
            const newActivity = new user_models_1.Activity(data);
            yield newActivity.save();
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
