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
const logger_configs_1 = __importDefault(require("../configs/logger.configs"));
const contacts_models_1 = __importDefault(require("../modules/contacts/contacts.models"));
const node_cron_1 = __importDefault(require("node-cron"));
node_cron_1.default.schedule('0 0 * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const now = new Date();
        const thresholdDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const { deletedCount } = yield contacts_models_1.default.deleteMany({
            isTrashed: true,
            trashedAt: { $lte: thresholdDate },
        });
        logger_configs_1.default.info(`[trashCleanup] Deleted ${deletedCount} old trashed contacts.`);
    }
    catch (error) {
        if (error instanceof Error) {
            logger_configs_1.default.error('[trashCleanup] Job failed:', error.message);
        }
        logger_configs_1.default.error('[trashCleanup] Job failed: Due to unknown error');
    }
}));
