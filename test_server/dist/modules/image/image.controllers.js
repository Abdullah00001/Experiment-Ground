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
const image_services_1 = __importDefault(require("../../modules/image/image.services"));
const { processImageUpload, processImageDelete } = image_services_1.default;
const ImageControllers = {
    handleImageUpload: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const image = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
        const { publicId } = req.body;
        try {
            const response = yield processImageUpload({ image, publicId });
            res.status(200).json({
                status: 'success',
                message: 'Image upload successful',
                data: { image: response },
            });
            return;
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
    handleImageDelete: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { folder, public_id } = req.params;
        if (!public_id && !folder) {
            res.status(400).json({
                status: 'error',
                message: 'public_id is required to delete an image',
            });
            return;
        }
        const publicId = `${folder}/${public_id}`;
        try {
            yield processImageDelete({ publicId });
            res.status(200).json({
                status: 'success',
                message: 'Image delete successful',
            });
            return;
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
};
exports.default = ImageControllers;
