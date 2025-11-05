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
const node_cron_1 = __importDefault(require("node-cron"));
const logger_configs_1 = __importDefault(require("../configs/logger.configs"));
const user_models_1 = __importDefault(require("../modules/user/user.models"));
const profile_models_1 = __importDefault(require("../modules/profile/profile.models"));
const mongoose_1 = require("mongoose");
node_cron_1.default.schedule('0 0 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield (0, mongoose_1.startSession)();
    session.startTransaction();
    try {
        const now = new Date();
        const thresholdDate = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
        const users = yield user_models_1.default.find({
            isVerified: false,
            createdAt: { $lte: thresholdDate },
        }, '_id', { session });
        const userIds = users.map((user) => user._id);
        if (userIds.length > 0) {
            const { deletedCount } = yield user_models_1.default.deleteMany({
                _id: { $in: userIds },
            }, { session });
            yield profile_models_1.default.deleteMany({ user: { $in: userIds } }, { session });
            logger_configs_1.default.info(`[unverified user cleanup] Deleted ${deletedCount} users and their profiles`);
        }
        else {
            logger_configs_1.default.info(`[unverified user cleanup] No unverified users to delete.`);
        }
        yield session.commitTransaction();
    }
    catch (error) {
        yield session.abortTransaction();
        if (error instanceof Error) {
            logger_configs_1.default.error('[unverified user cleanup] Job failed:', error.message);
        }
        else {
            logger_configs_1.default.error('[unverified user cleanup] Job failed: Due to unknown error');
        }
    }
    finally {
        session.endSession();
    }
}));
