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
const feedback_services_1 = __importDefault(require("../../modules/feedback/feedback.services"));
const logger_configs_1 = __importDefault(require("../../configs/logger.configs"));
const { processCreateFeedBack } = feedback_services_1.default;
const FeedbackControllers = {
    handleCreateFeedBack: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { sub } = req.decoded;
        const { message } = req.body;
        try {
            yield processCreateFeedBack({ userId: sub, message });
            res
                .status(201)
                .json({ status: 'success', message: 'Feedback Submitted' });
            return;
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
};
exports.default = FeedbackControllers;
