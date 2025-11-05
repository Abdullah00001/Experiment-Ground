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
const profile_models_1 = __importDefault(require("../../modules/profile/profile.models"));
const user_enums_1 = require("../../modules/user/user.enums");
const user_models_1 = __importDefault(require("../../modules/user/user.models"));
const mongoose_1 = __importDefault(require("mongoose"));
const ProfileRepositories = {
    updateProfile: (_a) => __awaiter(void 0, [_a], void 0, function* ({ bio, dateOfBirth, location, user, name, phone, avatar, gender, }) {
        var _b, _c;
        try {
            if (bio || dateOfBirth || location || gender) {
                const updatePayload = {};
                if (bio !== undefined)
                    updatePayload.bio = bio;
                if (dateOfBirth !== undefined)
                    updatePayload.dateOfBirth = dateOfBirth;
                if (location !== undefined)
                    updatePayload.location = location;
                if (gender !== undefined)
                    updatePayload.gender = gender;
                const projection = { _id: 0 };
                for (const key of Object.keys(updatePayload)) {
                    projection[key] = 1;
                }
                const result = yield profile_models_1.default.findOneAndUpdate({ user }, {
                    $set: updatePayload,
                }, { new: true, projection });
                const data = (_b = result === null || result === void 0 ? void 0 : result.toObject) === null || _b === void 0 ? void 0 : _b.call(result);
                data === null || data === void 0 ? true : delete data._id;
                return data;
            }
            else {
                const updatePayload = {};
                if (name !== undefined)
                    updatePayload.name = name;
                if (phone !== undefined)
                    updatePayload.phone = phone;
                if (avatar !== undefined)
                    updatePayload.avatar = avatar;
                const projection = { _id: 0 };
                for (const key of Object.keys(updatePayload)) {
                    projection[key] = 1;
                }
                const result = yield user_models_1.default.findOneAndUpdate({ _id: user }, {
                    $set: updatePayload,
                }, { new: true, projection });
                const data = (_c = result === null || result === void 0 ? void 0 : result.toObject) === null || _c === void 0 ? void 0 : _c.call(result);
                data === null || data === void 0 ? true : delete data._id;
                return data;
            }
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Update Profile Query');
            }
        }
    }),
    getProfile: (_a) => __awaiter(void 0, [_a], void 0, function* ({ user, query }) {
        const objectUserId = new mongoose_1.default.Types.ObjectId(user);
        try {
            if (query && Object.keys(query).length > 0) {
                const profileData = yield user_models_1.default.aggregate([
                    { $match: { _id: objectUserId } },
                    {
                        $lookup: {
                            from: 'profiles',
                            localField: '_id',
                            foreignField: 'user',
                            as: 'profile',
                        },
                    },
                    {
                        $unwind: {
                            path: '$profile',
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $project: query,
                    },
                ]);
                const { avatar, email, name, phone, dateOfBirth, gender, location } = Object.assign({}, profileData[0]);
                return { avatar, email, name, phone, dateOfBirth, gender, location };
            }
            else {
                const profileData = yield user_models_1.default.aggregate([
                    { $match: { _id: objectUserId } },
                    {
                        $lookup: {
                            from: 'profiles',
                            localField: '_id',
                            foreignField: 'user',
                            as: 'profile',
                        },
                    },
                    {
                        $unwind: {
                            path: '$profile',
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            name: 1,
                            avatar: 1,
                            phone: 1,
                            email: 1,
                            location: '$profile.location',
                            dateOfBirth: '$profile.dateOfBirth',
                            gender: '$profile.gender',
                        },
                    },
                ]);
                const { avatar, email, name, phone, location, dateOfBirth, gender } = Object.assign({}, profileData[0]);
                return { avatar, email, name, phone, location, dateOfBirth, gender };
            }
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Get Profile Query');
            }
        }
    }),
    changePassword: (_a) => __awaiter(void 0, [_a], void 0, function* ({ user, password }) {
        try {
            yield user_models_1.default.findOneAndUpdate({ _id: user }, { $set: { password } });
            return;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Change Password Query');
            }
        }
    }),
    deleteAccount: (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId }) {
        try {
            return yield user_models_1.default.findByIdAndUpdate(userId, {
                $set: {
                    accountStatus: {
                        accountStatus: user_enums_1.AccountStatus.DELETION_PENDING,
                    },
                },
            }, { new: true });
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Delete Account Query');
            }
        }
    }),
    cancelDeleteAccount: (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId }) {
        try {
            return yield user_models_1.default.findByIdAndUpdate(userId, {
                $set: {
                    accountStatus: {
                        accountStatus: user_enums_1.AccountStatus.ACTIVE,
                    },
                },
            }, { new: true });
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Delete Account Query');
            }
        }
    }),
};
exports.default = ProfileRepositories;
