"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const mailOption_utils_1 = __importDefault(require("../../utils/mailOption.utils"));
const bullmq_1 = require("bullmq");
const handlebars_1 = __importDefault(require("handlebars"));
const label_models_1 = __importDefault(require("../../modules/label/label.models"));
const contacts_models_1 = __importDefault(require("../../modules/contacts/contacts.models"));
const profile_models_1 = __importDefault(require("../../modules/profile/profile.models"));
const user_models_1 = __importStar(require("../../modules/user/user.models"));
const accountDeletionConfirmationEmailTemplate_1 = __importDefault(require("../../templates/accountDeletionConfirmationEmailTemplate"));
const worker = new bullmq_1.Worker('account-deletion-queue', (job) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, data, id } = job;
    try {
        if (name === 'schedule-account-deletion') {
            const { deleteAt, scheduleAt, userId } = data;
            yield redis_configs_1.default.del(`user:${userId}:delete-meta`);
            const user = yield user_models_1.default.findById(userId);
            yield label_models_1.default.deleteMany({ createdBy: userId });
            yield contacts_models_1.default.deleteMany({ userId });
            yield user_models_1.Activity.deleteMany({ user: userId });
            yield profile_models_1.default.deleteOne({ user: userId });
            yield user_models_1.default.deleteOne({ _id: userId });
            const email = user === null || user === void 0 ? void 0 : user.email;
            const templateData = {
                name,
                deleteAt,
                scheduleAt,
                email,
                currentYear: 2025,
            };
            const template = handlebars_1.default.compile(accountDeletionConfirmationEmailTemplate_1.default);
            const personalizedTemplate = template(templateData);
            yield nodemailer_configs_1.default.sendMail((0, mailOption_utils_1.default)(email, 'Your Workly Contacts Account Has Been Permanently Deleted', personalizedTemplate));
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
