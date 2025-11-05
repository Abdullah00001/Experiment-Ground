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
const nodemailer_configs_1 = __importDefault(require("../../configs/nodemailer.configs"));
const env_1 = require("../../env");
const feedback_repositories_1 = __importDefault(require("../../modules/feedback/feedback.repositories"));
const user_repositories_1 = __importDefault(require("../../modules/user/user.repositories"));
const { createFeedBack } = feedback_repositories_1.default;
const { findUserById } = user_repositories_1.default;
const { SMTP_USER } = env_1.env;
const FeedbackServices = {
    processCreateFeedBack: (_a) => __awaiter(void 0, [_a], void 0, function* ({ message, userId, }) {
        try {
            const { email } = yield findUserById(userId);
            const payload = { userEmail: email, message };
            yield createFeedBack(payload);
            yield nodemailer_configs_1.default.sendMail({
                from: SMTP_USER,
                to: SMTP_USER,
                replyTo: payload.userEmail,
                subject: 'New Feed Back',
                text: payload.message,
            });
            return;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In createFeedBack Service');
            }
        }
    }),
};
exports.default = FeedbackServices;
