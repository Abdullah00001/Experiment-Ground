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
const cloudinary_1 = require("cloudinary");
const env_1 = require("../env");
const fs_1 = __importDefault(require("fs"));
const logger_configs_1 = __importDefault(require("../configs/logger.configs"));
const axios_1 = __importDefault(require("axios"));
const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET_KEY, CLOUDINARY_NAME } = env_1.env;
const CloudinaryConfigs = {
    initializedCloudinary: () => {
        const configuration = {
            cloud_name: CLOUDINARY_NAME,
            api_key: CLOUDINARY_API_KEY,
            api_secret: CLOUDINARY_API_SECRET_KEY,
        };
        cloudinary_1.v2.config(configuration);
    },
    upload: (imagePath) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!imagePath) {
                return null;
            }
            const cloudinaryResponse = yield cloudinary_1.v2.uploader.upload(imagePath, {
                resource_type: 'auto',
                folder: 'amarcontacts',
            });
            fs_1.default.unlinkSync(imagePath);
            return {
                url: cloudinaryResponse.secure_url,
                publicId: cloudinaryResponse.public_id,
            };
        }
        catch (error) {
            fs_1.default.unlinkSync(imagePath);
            if (error instanceof Error) {
                console.error(`Image Upload Failed\nMessage: ${error.message}`);
            }
            else {
                console.error('An unexpected error occurred during the image upload process.');
            }
            fs_1.default.unlinkSync(imagePath);
            return null;
        }
    }),
    uploadAvatar: (url) => __awaiter(void 0, void 0, void 0, function* () {
        if (!url)
            return { publicId: null, url: null };
        try {
            const response = yield axios_1.default.get(url, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data, 'binary');
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                    resource_type: 'auto',
                    folder: 'amarcontacts',
                }, (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    else if (result) {
                        resolve({
                            url: result.secure_url,
                            publicId: result.public_id,
                        });
                    }
                });
                uploadStream.end(buffer);
            });
        }
        catch (error) {
            logger_configs_1.default.error('Google avatar upload failed:', error);
            return { publicId: null, url: null };
        }
    }),
    destroy: (publicId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield cloudinary_1.v2.uploader.destroy(publicId);
        }
        catch (error) {
            if (error instanceof Error)
                throw error;
            throw new Error('Unknown error occurred in cloudinary image destroy operation');
        }
    }),
};
exports.default = CloudinaryConfigs;
