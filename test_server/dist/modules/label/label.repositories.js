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
const contacts_models_1 = __importDefault(require("../../modules/contacts/contacts.models"));
const label_models_1 = __importDefault(require("../../modules/label/label.models"));
const mongoose_1 = __importDefault(require("mongoose"));
const LabelRepositories = {
    createLabel: (_a) => __awaiter(void 0, [_a], void 0, function* ({ labelName, userId }) {
        try {
            const newLabel = new label_models_1.default({ labelName, createdBy: userId });
            return yield newLabel.save();
        }
        catch (error) {
            if (error instanceof Error)
                throw error;
            throw new Error('Unknown error occurred in label creation query');
        }
    }),
    updateLabel: (_a) => __awaiter(void 0, [_a], void 0, function* ({ labelId, labelName, userId }) {
        try {
            return yield label_models_1.default.findByIdAndUpdate({ _id: labelId, createdBy: userId }, { $set: { labelName } }, { new: true });
        }
        catch (error) {
            if (error instanceof Error)
                throw error;
            throw new Error('Unknown error occurred in label update query');
        }
    }),
    getLabels: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const labels = yield label_models_1.default.aggregate([
                { $match: { createdBy: userId } },
                {
                    $lookup: {
                        from: 'contacts',
                        let: { labelId: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $in: ['$$labelId', '$labels'] },
                                            { $eq: ['$isTrashed', false] },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: 'contacts',
                    },
                },
                {
                    $project: {
                        labelName: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        contactCount: { $size: '$contacts' },
                    },
                },
            ]);
            return labels;
        }
        catch (error) {
            if (error instanceof Error)
                throw error;
            throw new Error('Unknown error occurred in label get query');
        }
    }),
    deleteLabel: (_a) => __awaiter(void 0, [_a], void 0, function* ({ labelId, userId, withContacts }) {
        const session = yield mongoose_1.default.startSession();
        session.startTransaction();
        try {
            if (withContacts) {
                yield contacts_models_1.default.deleteMany({
                    labels: labelId,
                    userId,
                }).session(session);
            }
            else {
                yield contacts_models_1.default.updateMany({ labels: labelId, createdBy: userId }, { $pull: { labels: labelId } }).session(session);
            }
            yield label_models_1.default.deleteOne({ _id: labelId, createdBy: userId }).session(session);
            yield session.commitTransaction();
            session.endSession();
        }
        catch (error) {
            yield session.abortTransaction();
            session.endSession();
            if (error instanceof Error)
                throw error;
            throw new Error('Unknown error occurred in label delete query');
        }
    }),
    findSingleLabel: (_a) => __awaiter(void 0, [_a], void 0, function* ({ createdBy, labelId, }) {
        try {
            const label = yield label_models_1.default.findOne({ createdBy, _id: labelId });
            return label;
        }
        catch (error) {
            if (error instanceof Error)
                throw error;
            throw new Error('Unknown error occurred in find single label query');
        }
    }),
};
exports.default = LabelRepositories;
