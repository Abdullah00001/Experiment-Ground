"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountDeleteQueue = exports.ActivityQueue = exports.EmailQueue = void 0;
const redis_configs_1 = __importDefault(require("../configs/redis.configs"));
const bullmq_1 = require("bullmq");
exports.EmailQueue = new bullmq_1.Queue('email-queue', { connection: redis_configs_1.default });
exports.ActivityQueue = new bullmq_1.Queue('activity-queue', {
    connection: redis_configs_1.default,
});
exports.AccountDeleteQueue = new bullmq_1.Queue('account-deletion-queue', {
    connection: redis_configs_1.default,
});
