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
exports.Activity = void 0;
const mongoose_1 = require("mongoose");
const password_utils_1 = __importDefault(require("../../utils/password.utils"));
const contacts_models_1 = require("../../modules/contacts/contacts.models");
const user_enums_1 = require("../../modules/user/user.enums");
const { hashPassword } = password_utils_1.default;
const PasswordSchema = new mongoose_1.Schema({
    secret: { type: String, default: null },
    change_at: { type: String, default: null },
}, { _id: false });
const AccountStatusSchema = new mongoose_1.Schema({
    accountStatus: {
        type: String,
        enum: user_enums_1.AccountStatus,
        default: user_enums_1.AccountStatus.PENDING,
    },
    lockedAt: { type: String, default: null },
}, { _id: false });
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: PasswordSchema,
    avatar: contacts_models_1.AvatarSchema,
    isVerified: { type: Boolean, default: false },
    phone: { type: String, default: null },
    googleId: { type: String, default: null },
    provider: { type: String, required: true },
    accountStatus: AccountStatusSchema,
}, { timestamps: true });
const ActivitySchema = new mongoose_1.Schema({
    activityType: { type: String, enum: user_enums_1.ActivityType, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    device: { type: String, required: true },
    browser: { type: String, required: true },
    ipAddress: { type: String, required: true },
    location: { type: String, required: true },
    os: { type: String, required: true },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });
UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        if (user.isModified('password') || user.isNew) {
            try {
                if (user.password.secret) {
                    user.password.secret = (yield hashPassword(user.password.secret));
                    user.password.change_at = new Date().toISOString();
                    next();
                }
                else {
                    next();
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    next(error);
                }
                else {
                    throw new Error('Unknown error occurred in password hash middleware');
                }
            }
        }
    });
});
const User = (0, mongoose_1.model)('User', UserSchema);
exports.Activity = (0, mongoose_1.model)('Activity', ActivitySchema);
exports.default = User;
