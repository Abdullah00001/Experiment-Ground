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
const profile_models_1 = __importDefault(require("../../modules/profile/profile.models"));
const user_enums_1 = require("../../modules/user/user.enums");
const user_models_1 = __importStar(require("../../modules/user/user.models"));
const mongoose_1 = __importStar(require("mongoose"));
const UserRepositories = {
    findUserById: (payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const foundedUser = yield user_models_1.default.findById(payload);
            if (!foundedUser) {
                throw new Error('Something Went Wrong In Find User By Id Query');
            }
            return foundedUser;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In User Find Operation');
            }
        }
    }),
    findUserByEmail: (payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const foundedUser = yield user_models_1.default.findOne({ email: payload });
            return foundedUser;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In User Find Operation');
            }
        }
    }),
    createNewUser: (payload) => __awaiter(void 0, void 0, void 0, function* () {
        const session = yield (0, mongoose_1.startSession)();
        session.startTransaction();
        try {
            const newUser = new user_models_1.default(Object.assign({}, payload));
            const newProfile = new profile_models_1.default({
                user: newUser._id,
                location: { home: null, work: null },
            });
            yield newProfile.save({ session });
            yield newUser.save({ session });
            yield session.commitTransaction();
            session.endSession();
            return newUser;
        }
        catch (error) {
            yield session.abortTransaction();
            session.endSession();
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In User Creation Operation');
            }
        }
    }),
    verifyUser: (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId }) {
        try {
            const verifiedUser = yield user_models_1.default.findByIdAndUpdate(userId, {
                $set: {
                    isVerified: true,
                    accountStatus: { accountStatus: user_enums_1.AccountStatus.ACTIVE },
                },
            }, { new: true });
            return verifiedUser;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In User Verify Operation');
            }
        }
    }),
    updateUserAccountStatus: (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, accountStatus, lockedAt, }) {
        try {
            const user = yield user_models_1.default.findByIdAndUpdate(userId, { $set: { accountStatus: { accountStatus, lockedAt } } }, { new: true });
            return user;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Update User Account Status Operation');
            }
        }
    }),
    changePasswordAndAccountActivation: (_a) => __awaiter(void 0, [_a], void 0, function* ({ password, userId, }) {
        try {
            const user = yield user_models_1.default.findByIdAndUpdate(userId, {
                $set: {
                    password: { secret: password, change_at: new Date().toISOString() },
                    accountStatus: {
                        accountStatus: user_enums_1.AccountStatus.ACTIVE,
                        lockedAt: null,
                    },
                },
            }, { new: true });
            return user;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Change Password And Account Activation Operation');
            }
        }
    }),
    resetPassword: (_a) => __awaiter(void 0, [_a], void 0, function* ({ password, userId, }) {
        try {
            const user = yield user_models_1.default.findByIdAndUpdate(userId, { $set: { password } }, { new: true });
            return user;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Password Reset Operation');
            }
        }
    }),
    retrieveSecurityOverviewData: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const [user, lastLogin] = yield Promise.all([
                user_models_1.default.findById(userId, { createdAt: 1, 'password.change_at': 1 }).lean(),
                user_models_1.Activity.findOne({
                    user: userId,
                    activityType: user_enums_1.ActivityType.LOGIN_SUCCESS,
                }, {
                    browser: 1,
                    location: 1,
                    os: 1,
                    createdAt: 1,
                })
                    .sort({ createdAt: -1 })
                    .lean(),
            ]);
            if (!user)
                throw new Error('Security Overview Database Operation Failed');
            if (!lastLogin) {
                const lastSignup = yield user_models_1.Activity.findOne({
                    user: userId,
                    activityType: user_enums_1.ActivityType.SIGNUP_SUCCESS,
                }, {
                    browser: 1,
                    location: 1,
                    os: 1,
                    createdAt: 1,
                })
                    .sort({ createdAt: -1 })
                    .lean();
                return {
                    accountCreatedAt: user === null || user === void 0 ? void 0 : user.createdAt,
                    lastPasswordChange: user.password.change_at,
                    lastLoginBrowser: lastSignup === null || lastSignup === void 0 ? void 0 : lastSignup.browser,
                    lastLoginOs: lastSignup === null || lastSignup === void 0 ? void 0 : lastSignup.os,
                    lastLoginLocation: lastSignup === null || lastSignup === void 0 ? void 0 : lastSignup.location,
                    lastLoginTime: String(lastSignup === null || lastSignup === void 0 ? void 0 : lastSignup.createdAt),
                };
            }
            return {
                accountCreatedAt: user === null || user === void 0 ? void 0 : user.createdAt,
                lastPasswordChange: user.password.change_at,
                lastLoginBrowser: lastLogin.browser,
                lastLoginOs: lastLogin.os,
                lastLoginLocation: lastLogin.location,
                lastLoginTime: String(lastLogin.createdAt),
            };
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Security Overview Operation');
            }
        }
    }),
    recentActivityDataRetrieve: (user) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield user_models_1.Activity.find({ user }, { activityType: 1, createdAt: 1, location: 1 })
                .sort({ createdAt: -1 })
                .limit(3);
            return data;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Recent Activity Data Operation');
            }
        }
    }),
    retrieveActivity: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = new mongoose_1.default.Types.ObjectId(userId);
            const data = yield user_models_1.Activity.find({ user }, { title: 1, createdAt: 1, location: 1, device: 1 }).sort({ createdAt: -1 });
            return data;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Retrieve Activity Data Operation');
            }
        }
    }),
    retrieveActivityDetails: (activityId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield user_models_1.Activity.findById(activityId);
            return data;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Retrieve Activity Details Operation');
            }
        }
    }),
};
exports.default = UserRepositories;
