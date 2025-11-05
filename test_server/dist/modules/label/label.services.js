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
const label_repositories_1 = __importDefault(require("../../modules/label/label.repositories"));
const { createLabel, deleteLabel, getLabels, updateLabel, findSingleLabel } = label_repositories_1.default;
const LabelServices = {
    processCreateLabel: (payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield createLabel(payload);
        }
        catch (error) {
            if (error instanceof Error)
                throw error;
            throw new Error('Unknown error occurred in create label service');
        }
    }),
    processUpdateLabel: (payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield updateLabel(payload);
        }
        catch (error) {
            if (error instanceof Error)
                throw error;
            throw new Error('Unknown error occurred in update label service');
        }
    }),
    processDeleteLabel: (payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield deleteLabel(payload);
            return;
        }
        catch (error) {
            if (error instanceof Error)
                throw error;
            throw new Error('Unknown error occurred in delete label service');
        }
    }),
    processRetrieveLabels: (payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield getLabels(payload);
        }
        catch (error) {
            if (error instanceof Error)
                throw error;
            throw new Error('Unknown error occurred in delete label service');
        }
    }),
    processRetrieveSingleLabel: (_a) => __awaiter(void 0, [_a], void 0, function* ({ createdBy, labelId, }) {
        try {
            return yield findSingleLabel({
                createdBy,
                labelId,
            });
        }
        catch (error) {
            if (error instanceof Error)
                throw error;
            throw new Error('Unknown error occurred in retrieve single label service');
        }
    }),
};
exports.default = LabelServices;
