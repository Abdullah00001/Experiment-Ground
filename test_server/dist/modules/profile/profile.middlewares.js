"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const user_repositories_1 = __importDefault(require("../../modules/user/user.repositories"));
const password_utils_1 = __importDefault(require("../../utils/password.utils"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importStar(require("path"));
const { findUserById } = user_repositories_1.default;
const { comparePassword } = password_utils_1.default;
const ProfileMiddlewares = {
    profilePictureChangeInputValidation: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const fileName = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
        const { publicId } = req.body;
        if (!fileName) {
            res.status(400).json({
                success: false,
                message: 'No uploaded file found,please upload a file!',
            });
            return;
        }
        if (!publicId || typeof publicId !== 'string') {
            const safePath = path_1.default.basename(fileName);
            const filePath = (0, path_1.join)(__dirname, '../../../public/temp', safePath);
            try {
                yield promises_1.default.unlink(filePath);
            }
            catch (error) {
                if (error instanceof Error) {
                    logger_configs_1.default.error(error);
                }
                else {
                    logger_configs_1.default.error('Unknown Error Occurred In Profile Picture Change Input Validation Middleware');
                }
            }
            res.status(400).json({
                success: false,
                message: 'Upload failed due invalid input or missing field',
            });
            return;
        }
        else {
            next();
        }
    }),
    checkCurrentPassword: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { currentPassword } = req.body;
            const { sub } = req.decoded;
            const user = yield findUserById(sub);
            const isPasswordMatch = yield comparePassword(currentPassword, user.password.secret);
            if (!isPasswordMatch) {
                res
                    .status(400)
                    .json({ success: false, message: 'Invalid Current Password' });
                return;
            }
            next();
        }
        catch (error) {
            if (error instanceof Error) {
                logger_configs_1.default.error(error);
                next(error);
            }
            else {
                logger_configs_1.default.error('Unknown Error Occurred In Check Current Password Middleware');
                next(new Error('Unknown Error In Check Current Password Middleware'));
            }
        }
    }),
};
exports.default = ProfileMiddlewares;
