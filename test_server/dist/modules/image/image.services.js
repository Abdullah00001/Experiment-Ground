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
const path_1 = require("path");
const cloudinary_configs_1 = __importDefault(require("../../configs/cloudinary.configs"));
const { upload, destroy } = cloudinary_configs_1.default;
const ImageServices = {
    processImageUpload: (_a) => __awaiter(void 0, [_a], void 0, function* ({ image, publicId }) {
        const filePath = (0, path_1.join)(__dirname, '../../../public/temp', image);
        try {
            const response = yield upload(filePath);
            if (publicId)
                yield destroy(publicId);
            return response;
        }
        catch (error) {
            if (error instanceof Error)
                throw error;
            throw new Error('Unknown error occurred in process upload image');
        }
    }),
    processImageDelete: (_a) => __awaiter(void 0, [_a], void 0, function* ({ publicId }) {
        try {
            yield destroy(publicId);
        }
        catch (error) {
            if (error instanceof Error)
                throw error;
            throw new Error('Unknown error occurred in process delete image');
        }
    }),
};
exports.default = ImageServices;
