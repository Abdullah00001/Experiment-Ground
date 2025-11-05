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
const logger_configs_1 = __importDefault(require("../../configs/logger.configs"));
const label_services_1 = __importDefault(require("../../modules/label/label.services"));
const mongoose_1 = __importDefault(require("mongoose"));
const { processCreateLabel, processUpdateLabel, processDeleteLabel, processRetrieveLabels, processRetrieveSingleLabel, } = label_services_1.default;
const LabelControllers = {
    handleCreateLabel: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { sub } = req.decoded;
            const { labelName } = req.body;
            const data = yield processCreateLabel({
                labelName,
                userId: new mongoose_1.default.Types.ObjectId(sub),
            });
            res
                .status(201)
                .json({ success: true, message: 'new label created', data });
            return;
        }
        catch (error) {
            logger_configs_1.default.error(error);
            next(error);
        }
    }),
    handleRetrieveLabels: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { sub } = req.decoded;
            const data = yield processRetrieveLabels(new mongoose_1.default.Types.ObjectId(sub));
            res
                .status(200)
                .json({ success: true, message: 'all label retrieved', data });
            return;
        }
        catch (error) {
            logger_configs_1.default.error(error);
            next(error);
        }
    }),
    handleUpdateLabel: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { sub } = req.decoded;
            const { labelName } = req.body;
            const data = yield processUpdateLabel({
                labelName,
                userId: new mongoose_1.default.Types.ObjectId(sub),
                labelId: new mongoose_1.default.Types.ObjectId(id),
            });
            res.status(200).json({ success: true, message: 'label updated', data });
            return;
        }
        catch (error) {
            logger_configs_1.default.error(error);
            next(error);
        }
    }),
    handleDeleteLabel: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { sub } = req.decoded;
            const { withContacts } = req.query;
            console.log(withContacts);
            yield processDeleteLabel({
                withContacts: withContacts === 'true',
                userId: new mongoose_1.default.Types.ObjectId(sub),
                labelId: new mongoose_1.default.Types.ObjectId(id),
            });
            res.status(200).json({ success: true, message: 'label deleted' });
            return;
        }
        catch (error) {
            logger_configs_1.default.error(error);
            next(error);
        }
    }),
    handleRetrieveSingleLabel: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { sub } = req.decoded;
            const data = yield processRetrieveSingleLabel({
                createdBy: new mongoose_1.default.Types.ObjectId(sub),
                labelId: new mongoose_1.default.Types.ObjectId(id),
            });
            res.status(200).json({ success: true, message: 'label retrieved', data });
            return;
        }
        catch (error) {
            logger_configs_1.default.error(error);
            next(error);
        }
    }),
};
exports.default = LabelControllers;
