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
const cloudinary_configs_1 = __importDefault(require("../../configs/cloudinary.configs"));
const redis_configs_1 = __importDefault(require("../../configs/redis.configs"));
const const_1 = require("../../const");
const profile_repositories_1 = __importDefault(require("../../modules/profile/profile.repositories"));
const user_enums_1 = require("../../modules/user/user.enums");
const accountDelete_jobs_1 = __importDefault(require("../../queue/jobs/accountDelete.jobs"));
const activity_jobs_1 = __importDefault(require("../../queue/jobs/activity.jobs"));
const email_jobs_1 = __importDefault(require("../../queue/jobs/email.jobs"));
const calculation_utils_1 = __importDefault(require("../../utils/calculation.utils"));
const date_utils_1 = __importDefault(require("../../utils/date.utils"));
const password_utils_1 = __importDefault(require("../../utils/password.utils"));
const path_1 = require("path");
const { calculateFutureDate, formatDateTime } = date_utils_1.default;
const { getProfile, updateProfile, changePassword, deleteAccount } = profile_repositories_1.default;
const { expiresInTimeUnitToMs, calculateMilliseconds } = calculation_utils_1.default;
const { upload, destroy } = cloudinary_configs_1.default;
const { hashPassword } = password_utils_1.default;
const { scheduleAccountDeletion } = accountDelete_jobs_1.default;
const { scheduleAccountDeletionActivitySavedInDb } = activity_jobs_1.default;
const { addAccountScheduleDeletionNotificationToQueue } = email_jobs_1.default;
const ProfileServices = {
    processUpdateProfile: (payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield updateProfile(payload);
            // await redisClient.del(`me:${payload.user}`);
            return data;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Update Profile Service');
            }
        }
    }),
    processGetProfile: (_a) => __awaiter(void 0, [_a], void 0, function* ({ queryFieldList, user }) {
        try {
            if (queryFieldList && queryFieldList.length > 0) {
                const projection = { _id: 0 };
                queryFieldList.forEach((fieldName) => {
                    if (fieldName === 'location') {
                        projection.location = '$profile.location';
                    }
                    else if (fieldName === 'dateOfBirth') {
                        projection.dateOfBirth = '$profile.dateOfBirth';
                    }
                    else if (fieldName === 'gender') {
                        projection.dateOfBirth = '$profile.gender';
                    }
                    else if (fieldName === 'name') {
                        projection.name = 1;
                    }
                    else if (fieldName === 'avatar') {
                        projection.avatar = 1;
                    }
                    else if (fieldName === 'email') {
                        projection.email = 1;
                    }
                    else if (fieldName === 'phone') {
                        projection.phone = 1;
                    }
                });
                return yield getProfile({ user, query: projection });
            }
            else {
                return yield getProfile({ user });
            }
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Get Profile Service');
            }
        }
    }),
    processChangePassword: (_a) => __awaiter(void 0, [_a], void 0, function* ({ user, password, addPasswordPageToken, }) {
        try {
            if (addPasswordPageToken) {
                yield redis_configs_1.default.set(`blacklist:jwt:${addPasswordPageToken}`, addPasswordPageToken, 'PX', expiresInTimeUnitToMs(const_1.addPasswordPageTokenExpiresIn));
            }
            const hash = (yield hashPassword(password === null || password === void 0 ? void 0 : password.secret));
            yield changePassword({
                user,
                password: Object.assign(Object.assign({}, password), { secret: hash }),
            });
            return;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Change Password Service');
            }
        }
    }),
    processDeleteAccount: (_a) => __awaiter(void 0, [_a], void 0, function* ({ accessToken, browser, deviceType, ipAddress, location, os, refreshToken, user, sid, }) {
        try {
            const pipeline = redis_configs_1.default.pipeline();
            const activityPayload = {
                activityType: user_enums_1.ActivityType.ACCOUNT_DELETE_SCHEDULE,
                title: const_1.AccountActivityMap.DELETION_SCHEDULED.title,
                description: const_1.AccountActivityMap.DELETION_SCHEDULED.description,
                browser,
                device: deviceType,
                ipAddress,
                location,
                os,
                user,
            };
            const result = yield deleteAccount({ userId: user });
            const deleteAt = calculateFutureDate('7d');
            const emailPayload = {
                email: result === null || result === void 0 ? void 0 : result.email,
                name: result === null || result === void 0 ? void 0 : result.name,
                scheduleAt: formatDateTime(new Date().toISOString()),
                deleteAt: formatDateTime(deleteAt),
            };
            pipeline.set(`blacklist:jwt:${accessToken}`, accessToken, 'PX', expiresInTimeUnitToMs(const_1.accessTokenExpiresIn));
            pipeline.set(`blacklist:jwt:${refreshToken}`, refreshToken, 'PX', expiresInTimeUnitToMs(const_1.refreshTokenExpiresIn));
            pipeline.set(`blacklist:sessions:${sid}`, sid, 'PX', expiresInTimeUnitToMs(const_1.refreshTokenExpiresIn));
            const sessions = yield redis_configs_1.default.smembers(`user:${user}:sessions`);
            pipeline.del(`user:${user}:sessions`);
            sessions.forEach((sid) => {
                pipeline.del(`user:${user}:sessions:${sid}`);
            });
            yield Promise.all([
                pipeline.exec(),
                scheduleAccountDeletion({
                    userId: user,
                    scheduleAt: new Date().toISOString(),
                    deleteAt,
                }),
                scheduleAccountDeletionActivitySavedInDb(activityPayload),
                addAccountScheduleDeletionNotificationToQueue(emailPayload),
            ]);
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Delete Account Services');
            }
        }
    }),
    processAvatarUpload: (_a) => __awaiter(void 0, [_a], void 0, function* ({ fileName, user }) {
        const avatarFilePath = (0, path_1.join)(__dirname, '../../../public/temp', fileName);
        try {
            const uploadResponse = yield upload(avatarFilePath);
            if (!uploadResponse)
                throw new Error('Avatar Upload Failed');
            yield updateProfile({ avatar: uploadResponse, user });
            return uploadResponse;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Profile Avatar Upload Services');
            }
        }
    }),
    processAvatarChange: (_a) => __awaiter(void 0, [_a], void 0, function* ({ fileName, user, publicId, }) {
        const avatarFilePath = (0, path_1.join)(__dirname, '../../../public/temp', fileName);
        try {
            const uploadResponse = yield upload(avatarFilePath);
            if (!uploadResponse)
                throw new Error('Avatar Change Failed');
            yield destroy(publicId);
            yield updateProfile({ avatar: uploadResponse, user });
            return uploadResponse;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Profile Avatar Change Services');
            }
        }
    }),
    processAvatarRemove: (_a) => __awaiter(void 0, [_a], void 0, function* ({ publicId, user }) {
        try {
            yield destroy(publicId);
            yield updateProfile({ avatar: { publicId: null, url: null }, user });
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Profile Avatar Services');
            }
        }
    }),
};
exports.default = ProfileServices;
