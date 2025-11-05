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
const queues_1 = require("../../queue/queues");
const metaData_utils_1 = __importDefault(require("../../utils/metaData.utils"));
const { setAccountDeletionMetaData } = metaData_utils_1.default;
const AccountDeleteQueueJobs = {
    scheduleAccountDeletion: (_a) => __awaiter(void 0, [_a], void 0, function* ({ scheduleAt, userId, deleteAt, }) {
        const delay = new Date(deleteAt).getTime() - Date.now();
        const job = yield queues_1.AccountDeleteQueue.add('schedule-account-deletion', { scheduleAt, userId, deleteAt }, {
            attempts: 3,
            removeOnComplete: true,
            backoff: { type: 'exponential', delay: 3000 },
            delay,
        });
        yield setAccountDeletionMetaData({
            deleteAt,
            jobId: job === null || job === void 0 ? void 0 : job.id,
            scheduleAt,
            userId,
        });
    }),
};
exports.default = AccountDeleteQueueJobs;
