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
const user_repositories_1 = __importDefault(require("../../modules/user/user.repositories"));
const otp_generator_1 = require("otp-generator");
const redis_configs_1 = __importDefault(require("../../configs/redis.configs"));
const const_1 = require("../../const");
const jwt_utils_1 = __importDefault(require("../../utils/jwt.utils"));
const mongoose_1 = __importDefault(require("mongoose"));
const calculation_utils_1 = __importDefault(require("../../utils/calculation.utils"));
const password_utils_1 = __importDefault(require("../../utils/password.utils"));
const email_jobs_1 = __importDefault(require("../../queue/jobs/email.jobs"));
const singletons_1 = require("../../singletons");
const uuid_1 = require("uuid");
const date_utils_1 = __importDefault(require("../../utils/date.utils"));
const activity_jobs_1 = __importDefault(require("../../queue/jobs/activity.jobs"));
const user_enums_1 = require("../../modules/user/user.enums");
const user_dto_1 = require("../../modules/user/user.dto");
const profile_repositories_1 = __importDefault(require("../../modules/profile/profile.repositories"));
const { hashPassword } = password_utils_1.default;
const { addSendAccountVerificationOtpEmailToQueue, addSendPasswordResetNotificationEmailToQueue, addSendAccountRecoverOtpEmailToQueue, addSendSignupSuccessNotificationEmailToQueue, addLoginSuccessNotificationEmailToQueue, addAccountUnlockNotificationToQueue, addAccountScheduleDeletionCancelAndLoginNotificationToQueue, } = email_jobs_1.default;
const { signupSuccessActivitySavedInDb, loginSuccessActivitySavedInDb, accountUnlockActivitySavedInDb, passwordResetActivitySavedInDb, } = activity_jobs_1.default;
const { createNewUser, verifyUser, resetPassword, findUserById, changePasswordAndAccountActivation, retrieveSecurityOverviewData, recentActivityDataRetrieve, retrieveActivity, retrieveActivityDetails, } = user_repositories_1.default;
const { cancelDeleteAccount } = profile_repositories_1.default;
const { expiresInTimeUnitToMs, calculateMilliseconds } = calculation_utils_1.default;
const { calculateFutureDate, formatDateTime, compareDate } = date_utils_1.default;
const { generateAccessToken, generateRefreshToken, generateRecoverToken, generateActivationToken, generateChangePasswordPageToken, generateAddPasswordPageToken, } = jwt_utils_1.default;
const otpUtils = (0, singletons_1.OtpUtilsSingleton)();
const UserServices = {
    processSignup: (payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const createdUser = yield createNewUser(Object.assign(Object.assign({}, payload), { avatar: { publicId: null, url: null }, accountStatus: { accountStatus: user_enums_1.AccountStatus.PENDING, lockedAt: null } }));
            const otp = (0, otp_generator_1.generate)(6, {
                digits: true,
                lowerCaseAlphabets: false,
                specialChars: false,
                upperCaseAlphabets: false,
            });
            const activationToken = generateActivationToken({
                sub: createdUser === null || createdUser === void 0 ? void 0 : createdUser._id,
            });
            const hashOtp = otpUtils.hashOtp({ otp });
            yield Promise.all([
                redis_configs_1.default.set(`user:otp:${createdUser === null || createdUser === void 0 ? void 0 : createdUser._id}`, hashOtp, 'PX', calculateMilliseconds(const_1.otpExpireAt, 'minute')),
                addSendAccountVerificationOtpEmailToQueue({
                    email: createdUser === null || createdUser === void 0 ? void 0 : createdUser.email,
                    expirationTime: const_1.otpExpireAt,
                    name: createdUser === null || createdUser === void 0 ? void 0 : createdUser.name,
                    otp,
                }),
            ]);
            return { createdUser, activationToken };
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Process Signup Service');
            }
        }
    }),
    processVerifyUser: (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, browser, deviceType, location, os, ipAddress, }) {
        try {
            const user = yield verifyUser({
                userId: new mongoose_1.default.Types.ObjectId(userId),
            });
            const sid = (0, uuid_1.v4)();
            const accessToken = generateAccessToken({
                sid,
                sub: user === null || user === void 0 ? void 0 : user._id,
            });
            const refreshToken = generateRefreshToken({
                sid,
                sub: user === null || user === void 0 ? void 0 : user._id,
                provider: user_enums_1.AuthType.LOCAL,
            });
            const session = {
                browser,
                deviceType,
                location,
                os,
                createdAt: new Date().toISOString(),
                sessionId: sid,
                userId: user === null || user === void 0 ? void 0 : user._id,
                expiredAt: calculateFutureDate(const_1.refreshTokenExpiresIn),
                lastUsedAt: new Date().toISOString(),
            };
            const emailPayload = {
                name: user === null || user === void 0 ? void 0 : user.name,
                email: user === null || user === void 0 ? void 0 : user.email,
            };
            const activityPayload = {
                activityType: user_enums_1.ActivityType.SIGNUP_SUCCESS,
                title: const_1.AccountActivityMap.SIGNUP_SUCCESS.title,
                description: const_1.AccountActivityMap.SIGNUP_SUCCESS.description,
                browser,
                device: deviceType,
                ipAddress,
                location,
                os,
                user: user === null || user === void 0 ? void 0 : user._id,
            };
            const redisPipeLine = redis_configs_1.default.pipeline();
            redisPipeLine.set(`user:${user === null || user === void 0 ? void 0 : user._id}:sessions:${sid}`, JSON.stringify(session), 'PX', expiresInTimeUnitToMs(const_1.refreshTokenExpiresIn));
            redisPipeLine.sadd(`user:${user === null || user === void 0 ? void 0 : user._id}:sessions`, sid);
            redisPipeLine.del(`user:otp:${userId}`);
            redisPipeLine.del(`otp:limit:${userId}`);
            redisPipeLine.del(`otp:resendOtpEmailCoolDown:${userId}`);
            redisPipeLine.del(`otp:resendOtpEmailCoolDown:${userId}:count`);
            yield Promise.all([
                redisPipeLine.exec(),
                signupSuccessActivitySavedInDb(activityPayload),
                addSendSignupSuccessNotificationEmailToQueue(emailPayload),
            ]);
            return { accessToken: accessToken, refreshToken: refreshToken };
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Process Verify Service');
            }
        }
    }),
    processResend: (sub) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, name, _id } = yield findUserById(sub);
            const otp = (0, otp_generator_1.generate)(6, {
                digits: true,
                lowerCaseAlphabets: false,
                specialChars: false,
                upperCaseAlphabets: false,
            });
            const hashOtp = otpUtils.hashOtp({ otp });
            yield Promise.all([
                redis_configs_1.default.set(`user:otp:${_id}`, hashOtp, 'PX', calculateMilliseconds(const_1.otpExpireAt, 'minute')),
                addSendAccountVerificationOtpEmailToQueue({
                    email: email,
                    expirationTime: const_1.otpExpireAt,
                    name: name,
                    otp,
                }),
            ]);
            return;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Process Resend Service');
            }
        }
    }),
    processCheckResendStatus: (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId }) {
        const ttlKey = `otp:resendOtpEmailCoolDown:${userId}`;
        const countKey = `otp:resendOtpEmailCoolDown:${userId}:count`;
        try {
            const currentCoolDownCount = Number(yield redis_configs_1.default.get(countKey));
            if (currentCoolDownCount >= const_1.maxOtpResendPerHour) {
                const countTtl = yield redis_configs_1.default.pttl(countKey);
                if (countTtl > 0)
                    return { availableAt: Date.now() + countTtl };
            }
            const countTtl = yield redis_configs_1.default.pttl(ttlKey);
            if (countTtl > 0)
                return { availableAt: Date.now() + countTtl };
            return { availableAt: Date.now() };
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Process Check Resend Status Service');
            }
        }
    }),
    processRefreshToken: (payload) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { sid, userId } = payload;
            const accessToken = generateAccessToken({
                sid,
                sub: userId,
            });
            const session = yield redis_configs_1.default.get(`user:${userId}:sessions:${sid}`);
            const parsedSession = JSON.parse(session);
            const updatedSession = Object.assign(Object.assign({}, parsedSession), { lastUsedAt: new Date().toISOString() });
            yield redis_configs_1.default.set(`user:${userId}:sessions:${sid}`, JSON.stringify(updatedSession), 'KEEPTTL');
            return { accessToken };
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Process Refresh Token Service');
            }
        }
    }),
    processRetrieveSessionsForClearDevice: (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, }) {
        try {
            const sessionIds = yield redis_configs_1.default.smembers(`user:${userId}:sessions`);
            const sessions = yield Promise.all(sessionIds.map((sid) => __awaiter(void 0, void 0, void 0, function* () {
                const session = (yield redis_configs_1.default.get(`user:${userId}:sessions:${sid}`));
                return JSON.parse(session);
            })));
            return sessions;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Process Retrieve Sessions For Clear Device Service');
            }
        }
    }),
    processClearDeviceAndLogin: (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, deviceType, devices, ipAddress, location, os, rememberMe, user, provider, }) {
        try {
            const { email, name, _id } = yield findUserById(user);
            const sid = (0, uuid_1.v4)();
            const accessToken = generateAccessToken({
                sid,
                sub: _id,
            });
            const refreshToken = generateRefreshToken({
                sid,
                sub: _id,
                rememberMe,
                provider,
            });
            const session = {
                browser,
                deviceType,
                location,
                os,
                createdAt: new Date().toISOString(),
                sessionId: sid,
                userId: _id,
                expiredAt: rememberMe || provider === user_enums_1.AuthType.GOOGLE
                    ? calculateFutureDate(const_1.refreshTokenExpiresIn)
                    : calculateFutureDate(const_1.refreshTokenExpiresInWithoutRememberMe),
                lastUsedAt: new Date().toISOString(),
            };
            const activityPayload = {
                activityType: user_enums_1.ActivityType.LOGIN_SUCCESS,
                title: const_1.AccountActivityMap.LOGIN_SUCCESS.title,
                description: const_1.AccountActivityMap.LOGIN_SUCCESS.description,
                browser,
                device: deviceType,
                ipAddress,
                location,
                os,
                user: _id,
            };
            const emailPayload = {
                browser,
                device: deviceType,
                email,
                ip: ipAddress,
                location,
                name,
                os,
                time: formatDateTime(new Date().toISOString()),
            };
            const redisPipeLine = redis_configs_1.default.pipeline();
            devices.forEach((sid) => {
                redisPipeLine.set(`blacklist:sessions:${sid}`, sid, 'PX', expiresInTimeUnitToMs(const_1.refreshTokenExpiresIn));
                redisPipeLine.srem(`user:${_id}:sessions`, sid);
                redisPipeLine.del(`user:${_id}:sessions:${sid}`);
            });
            const sessionExpireIn = rememberMe || provider === user_enums_1.AuthType.GOOGLE
                ? const_1.refreshTokenExpiresIn
                : const_1.refreshTokenExpiresInWithoutRememberMe;
            redisPipeLine.set(`user:${_id}:sessions:${sid}`, JSON.stringify(session), 'PX', expiresInTimeUnitToMs(sessionExpireIn));
            redisPipeLine.sadd(`user:${_id}:sessions`, sid);
            yield Promise.all([
                redisPipeLine.exec(),
                loginSuccessActivitySavedInDb(activityPayload),
                addLoginSuccessNotificationEmailToQueue(emailPayload),
            ]);
            return {
                accessToken: accessToken,
                refreshToken: refreshToken,
            };
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Process Clear Device And Login Service');
            }
        }
    }),
    processLogin: (_a) => __awaiter(void 0, [_a], void 0, function* ({ user, browser, deviceType, ipAddress, location, os, rememberMe, }) {
        try {
            const { _id, name, email, accountStatus } = user;
            const sid = (0, uuid_1.v4)();
            const accessToken = generateAccessToken({
                sid,
                sub: _id,
            });
            const refreshToken = generateRefreshToken({
                sid,
                sub: _id,
                rememberMe,
            });
            const session = {
                browser,
                deviceType,
                location,
                os,
                createdAt: new Date().toISOString(),
                sessionId: sid,
                userId: _id,
                expiredAt: rememberMe
                    ? calculateFutureDate(const_1.refreshTokenExpiresIn)
                    : calculateFutureDate(const_1.refreshTokenExpiresInWithoutRememberMe),
                lastUsedAt: new Date().toISOString(),
            };
            const redisPipeLine = redis_configs_1.default.pipeline();
            redisPipeLine.set(`user:${_id}:sessions:${sid}`, JSON.stringify(session), 'PX', expiresInTimeUnitToMs(const_1.refreshTokenExpiresIn));
            redisPipeLine.sadd(`user:${_id}:sessions`, sid);
            if (accountStatus.accountStatus === user_enums_1.AccountStatus.DELETION_PENDING) {
                const metaDataString = yield redis_configs_1.default.get(`user:${_id}:delete-meta`);
                const metaDataObject = JSON.parse(metaDataString);
                const emailPayload = {
                    browser,
                    device: deviceType,
                    email,
                    ip: ipAddress,
                    location,
                    name,
                    os,
                    time: formatDateTime(new Date().toISOString()),
                    deleteAt: formatDateTime(metaDataObject.deleteAt),
                };
                const activityPayload = {
                    activityType: user_enums_1.ActivityType.ACCOUNT_DELETE_SCHEDULE_CANCEL,
                    title: const_1.AccountActivityMap.DELETION_CANCELED.title,
                    description: const_1.AccountActivityMap.DELETION_CANCELED.description,
                    browser,
                    device: deviceType,
                    ipAddress,
                    location,
                    os,
                    user: _id,
                };
                redisPipeLine.del(`user:${_id}:delete-meta`);
                yield cancelDeleteAccount({ userId: _id });
                yield Promise.all([
                    redisPipeLine.exec(),
                    loginSuccessActivitySavedInDb(activityPayload),
                    addAccountScheduleDeletionCancelAndLoginNotificationToQueue(emailPayload),
                ]);
                return {
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                };
            }
            const activityPayload = {
                activityType: user_enums_1.ActivityType.LOGIN_SUCCESS,
                title: const_1.AccountActivityMap.LOGIN_SUCCESS.title,
                description: const_1.AccountActivityMap.LOGIN_SUCCESS.description,
                browser,
                device: deviceType,
                ipAddress,
                location,
                os,
                user: _id,
            };
            const emailPayload = {
                browser,
                device: deviceType,
                email,
                ip: ipAddress,
                location,
                name,
                os,
                time: formatDateTime(new Date().toISOString()),
            };
            yield Promise.all([
                redisPipeLine.exec(),
                loginSuccessActivitySavedInDb(activityPayload),
                addLoginSuccessNotificationEmailToQueue(emailPayload),
            ]);
            return {
                accessToken: accessToken,
                refreshToken: refreshToken,
            };
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Process Login Service');
            }
        }
    }),
    /**
     * Service to handle user logout by revoking tokens and cleaning up sessions.
     *
     * Responsibilities:
     * - Blacklists the provided refresh token with its TTL.
     * - Blacklists the provided access token with its TTL.
     * - Marks the session ID (`sid`) as blacklisted with the refresh token TTL.
     * - Removes the session ID from the user's active session set.
     * - Deletes the specific session record from Redis.
     *
     * @param params - Object containing logout details
     * @param params.accessToken - The access token to revoke
     * @param params.refreshToken - The refresh token to revoke
     * @param params.sid - Session ID to blacklist and remove
     * @param params.userId - The user ID associated with the session
     * @throws Will throw an error if Redis operations fail
     */
    processLogout: (_a) => __awaiter(void 0, [_a], void 0, function* ({ accessToken, refreshToken, sid, userId, }) {
        try {
            const pipeline = redis_configs_1.default.pipeline();
            if (refreshToken) {
                pipeline.set(`blacklist:jwt:${refreshToken}`, refreshToken, 'PX', expiresInTimeUnitToMs(const_1.refreshTokenExpiresIn));
            }
            pipeline.set(`blacklist:jwt:${accessToken}`, accessToken, 'PX', expiresInTimeUnitToMs(const_1.accessTokenExpiresIn));
            pipeline.set(`blacklist:sessions:${sid}`, sid, 'PX', expiresInTimeUnitToMs(const_1.refreshTokenExpiresIn));
            pipeline.srem(`user:${userId}:sessions`, sid);
            pipeline.del(`user:${userId}:sessions:${sid}`);
            yield pipeline.exec();
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Process Logout Service');
            }
        }
    }),
    processFindUser: ({ userId }) => {
        try {
            const r_stp1 = generateRecoverToken({
                sub: userId,
            });
            return { r_stp1: r_stp1 };
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Process Find User Service');
            }
        }
    },
    processRecoverUserInfo: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield findUserById(userId);
            return user_dto_1.RecoverUserInfoDTO.fromEntity(data);
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Process Retrieve User Info Service');
            }
        }
    }),
    processSentRecoverAccountOtp: (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, r_stp1, }) {
        try {
            const { email, name } = yield findUserById(userId);
            const otp = (0, otp_generator_1.generate)(6, {
                digits: true,
                lowerCaseAlphabets: false,
                specialChars: false,
                upperCaseAlphabets: false,
            });
            yield Promise.all([
                yield redis_configs_1.default.set(`blacklist:recover:r_stp1:${userId}`, r_stp1, 'PX', expiresInTimeUnitToMs(const_1.recoverSessionExpiresIn)),
                redis_configs_1.default.set(`user:recover:otp:${userId}`, otp, 'PX', calculateMilliseconds(const_1.otpExpireAt, 'minute')),
                addSendAccountRecoverOtpEmailToQueue({
                    email,
                    expirationTime: const_1.otpExpireAt,
                    name,
                    otp,
                }),
            ]);
            const r_stp2 = generateRecoverToken({
                sub: userId,
            });
            return { r_stp2: r_stp2 };
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Process Find User Service');
            }
        }
    }),
    processVerifyOtp: (_a) => __awaiter(void 0, [_a], void 0, function* ({ r_stp2, userId, }) {
        try {
            const redisPipeLine = redis_configs_1.default.pipeline();
            redisPipeLine.del(`user:recover:otp:${userId}`);
            redisPipeLine.set(`blacklist:recover:r_stp2:${userId}`, r_stp2, 'PX', expiresInTimeUnitToMs(const_1.recoverSessionExpiresIn));
            redisPipeLine.del(`otp:limit:${userId}`);
            redisPipeLine.del(`otp:resendOtpEmailCoolDown:${userId}`);
            redisPipeLine.del(`otp:resendOtpEmailCoolDown:${userId}:count`);
            const r_stp3 = generateRecoverToken({
                sub: userId,
            });
            yield redisPipeLine.exec();
            return { r_stp3: r_stp3 };
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Process Verify Otp Service');
            }
        }
    }),
    processReSentRecoverAccountOtp: (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId, }) {
        try {
            const { name, email } = yield findUserById(userId);
            const otp = (0, otp_generator_1.generate)(6, {
                digits: true,
                lowerCaseAlphabets: false,
                specialChars: false,
                upperCaseAlphabets: false,
            });
            yield Promise.all([
                addSendAccountRecoverOtpEmailToQueue({
                    email,
                    expirationTime: const_1.otpExpireAt,
                    name,
                    otp,
                }),
                redis_configs_1.default.set(`user:recover:otp:${userId}`, otp, 'PX', calculateMilliseconds(const_1.otpExpireAt, 'minute')),
            ]);
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Process Find User Service');
            }
        }
    }),
    processResetPassword: (_a) => __awaiter(void 0, [_a], void 0, function* ({ browser, deviceType, ipAddress, location, os, password, r_stp3, userId, }) {
        const id = new mongoose_1.default.Types.ObjectId(userId);
        try {
            const hashed = (yield hashPassword(password));
            const newPassword = {
                secret: hashed,
                change_at: new Date().toISOString(),
            };
            const user = yield resetPassword({
                userId: id,
                password: newPassword,
            });
            if (!user)
                throw new Error('No User Found');
            const { email, name } = user;
            const emailPayload = {
                name,
                email,
                device: deviceType,
                ipAddress,
                location,
            };
            const activityPayload = {
                activityType: user_enums_1.ActivityType.PASSWORD_RESET,
                title: const_1.AccountActivityMap.PASSWORD_RESET.title,
                description: const_1.AccountActivityMap.PASSWORD_RESET.description,
                browser,
                device: deviceType,
                ipAddress,
                location,
                os,
                user: user === null || user === void 0 ? void 0 : user._id,
            };
            yield Promise.all([
                redis_configs_1.default.set(`blacklist:recover:r_stp2:${userId}`, r_stp3, 'PX', expiresInTimeUnitToMs(const_1.recoverSessionExpiresIn)),
                addSendPasswordResetNotificationEmailToQueue(emailPayload),
                passwordResetActivitySavedInDb(activityPayload),
            ]);
            return;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Process Reset Password Service');
            }
        }
    }),
    processOAuthCallback: (_a) => __awaiter(void 0, [_a], void 0, function* ({ user, activity, browser, deviceType, ipAddress, location, os, provider, }) {
        try {
            const { _id, name, email } = user;
            const sid = (0, uuid_1.v4)();
            const accessToken = generateAccessToken({
                sid,
                sub: _id,
            });
            const refreshToken = generateRefreshToken({
                sid,
                sub: _id,
                provider,
            });
            const session = {
                browser,
                deviceType,
                location,
                os,
                createdAt: new Date().toISOString(),
                sessionId: sid,
                userId: _id,
                expiredAt: calculateFutureDate(const_1.refreshTokenExpiresIn),
                lastUsedAt: new Date().toISOString(),
            };
            const redisPipeLine = redis_configs_1.default.pipeline();
            redisPipeLine.set(`user:${_id}:sessions:${sid}`, JSON.stringify(session), 'PX', expiresInTimeUnitToMs(const_1.refreshTokenExpiresIn));
            redisPipeLine.sadd(`user:${_id}:sessions`, sid);
            // cancel account deletion on OAuth Login
            if ((user === null || user === void 0 ? void 0 : user.accountStatus.accountStatus) === user_enums_1.AccountStatus.DELETION_PENDING) {
                const metaDataString = yield redis_configs_1.default.get(`user:${_id}:delete-meta`);
                const metaDataObject = JSON.parse(metaDataString);
                const emailPayload = {
                    browser,
                    device: deviceType,
                    email,
                    ip: ipAddress,
                    location,
                    name,
                    os,
                    time: formatDateTime(new Date().toISOString()),
                    deleteAt: formatDateTime(metaDataObject.deleteAt),
                };
                const activityPayload = {
                    activityType: user_enums_1.ActivityType.ACCOUNT_DELETE_SCHEDULE_CANCEL,
                    title: const_1.AccountActivityMap.DELETION_CANCELED.title,
                    description: const_1.AccountActivityMap.DELETION_CANCELED.description,
                    browser,
                    device: deviceType,
                    ipAddress,
                    location,
                    os,
                    user: _id,
                };
                redisPipeLine.del(`user:${_id}:delete-meta`);
                yield cancelDeleteAccount({ userId: _id });
                yield Promise.all([
                    redisPipeLine.exec(),
                    loginSuccessActivitySavedInDb(activityPayload),
                    addAccountScheduleDeletionCancelAndLoginNotificationToQueue(emailPayload),
                ]);
                return {
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                };
            }
            if (activity === user_enums_1.ActivityType.LOGIN_SUCCESS) {
                const activityPayload = {
                    activityType: user_enums_1.ActivityType.LOGIN_SUCCESS,
                    title: const_1.AccountActivityMap.LOGIN_SUCCESS.title,
                    description: const_1.AccountActivityMap.LOGIN_SUCCESS.description,
                    browser,
                    device: deviceType,
                    ipAddress,
                    location,
                    os,
                    user: _id,
                };
                const emailPayload = {
                    browser,
                    device: deviceType,
                    email,
                    ip: ipAddress,
                    location,
                    name,
                    os,
                    time: new Date().toISOString(),
                };
                redisPipeLine.del(`user:otp:${_id}`);
                redisPipeLine.del(`otp:limit:${_id}`);
                redisPipeLine.del(`otp:resendOtpEmailCoolDown:${_id}`);
                redisPipeLine.del(`otp:resendOtpEmailCoolDown:${_id}:count`);
                yield Promise.all([
                    redisPipeLine.exec(),
                    loginSuccessActivitySavedInDb(activityPayload),
                    addLoginSuccessNotificationEmailToQueue(emailPayload),
                ]);
                if (!user.password.secret && compareDate(user.createdAt, '7d')) {
                    const addPasswordPageToken = generateAddPasswordPageToken({
                        sid,
                        sub: _id,
                    });
                    return {
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        addPasswordPageToken: addPasswordPageToken,
                    };
                }
                if (!user.password.secret) {
                    const addPasswordPageToken = generateAddPasswordPageToken({
                        sid,
                        sub: _id,
                    });
                    return {
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                        addPasswordPageToken: addPasswordPageToken,
                    };
                }
                return {
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                };
            }
            const activityPayload = {
                activityType: user_enums_1.ActivityType.SIGNUP_SUCCESS,
                title: const_1.AccountActivityMap.SIGNUP_SUCCESS.title,
                description: const_1.AccountActivityMap.SIGNUP_SUCCESS.description,
                browser,
                device: deviceType,
                ipAddress,
                location,
                os,
                user: _id,
            };
            const emailPayload = {
                name,
                email,
            };
            redisPipeLine.del(`user:otp:${_id}`);
            redisPipeLine.del(`otp:limit:${_id}`);
            redisPipeLine.del(`otp:resendOtpEmailCoolDown:${_id}`);
            redisPipeLine.del(`otp:resendOtpEmailCoolDown:${_id}:count`);
            yield Promise.all([
                redisPipeLine.exec(),
                signupSuccessActivitySavedInDb(activityPayload),
                addSendSignupSuccessNotificationEmailToQueue(emailPayload),
            ]);
            const addPasswordPageToken = generateAddPasswordPageToken({
                sid,
                sub: _id,
            });
            return {
                accessToken: accessToken,
                refreshToken: refreshToken,
                addPasswordPageToken: addPasswordPageToken,
            };
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Process OAuth Callback Service');
            }
        }
    }),
    processAccountActivation: (userId) => {
        try {
            const token = generateChangePasswordPageToken({ sub: userId });
            return token;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Process Account Activation Service');
            }
        }
    },
    processChangePasswordAndAccountActivation: (_a) => __awaiter(void 0, [_a], void 0, function* ({ token, userId, uuid, password, browser, deviceType, ipAddress, location, os, }) {
        try {
            const id = new mongoose_1.default.Types.ObjectId(userId);
            const hashSecret = yield hashPassword(password);
            const user = yield changePasswordAndAccountActivation({
                userId: id,
                password: hashSecret,
            });
            const pipeline = redis_configs_1.default.pipeline();
            pipeline.del(`user:activation:uuid:${uuid}`);
            pipeline.del(`blacklist:ip:${ipAddress}`);
            redis_configs_1.default.del(`user:login:attempts:${user === null || user === void 0 ? void 0 : user.email}`);
            pipeline.set(`blacklist:jwt:${token}`, token, 'PX', expiresInTimeUnitToMs('15m'));
            const activityPayload = {
                activityType: user_enums_1.ActivityType.ACCOUNT_ACTIVE,
                title: const_1.AccountActivityMap.ACCOUNT_ACTIVE.title,
                description: const_1.AccountActivityMap.ACCOUNT_ACTIVE.description,
                browser,
                device: deviceType,
                ipAddress,
                location,
                os,
                user: user === null || user === void 0 ? void 0 : user._id,
            };
            const emailPayload = {
                email: user === null || user === void 0 ? void 0 : user.email,
                name: user === null || user === void 0 ? void 0 : user.name,
                time: formatDateTime(new Date().toISOString()),
            };
            yield Promise.all([
                pipeline.exec(),
                addAccountUnlockNotificationToQueue(emailPayload),
                accountUnlockActivitySavedInDb(activityPayload),
            ]);
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Process Change Password And Account Activation Service');
            }
        }
    }),
    processSecurityOverview: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield retrieveSecurityOverviewData(userId);
            return data;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Process Security Overview Service');
            }
        }
    }),
    processActiveSessions: (_a) => __awaiter(void 0, [_a], void 0, function* ({ sid, sub, }) {
        try {
            const sessionIds = yield redis_configs_1.default.smembers(`user:${sub}:sessions`);
            const sessions = yield Promise.all(sessionIds.map((id) => __awaiter(void 0, void 0, void 0, function* () {
                const isSessionExist = yield redis_configs_1.default.exists(`user:${sub}:sessions:${id}`);
                if (!isSessionExist) {
                    yield redis_configs_1.default.srem(`user:${sub}:sessions`, id);
                    return;
                }
                if (id === sid) {
                    const currentSessionString = yield redis_configs_1.default.get(`user:${sub}:sessions:${id}`);
                    const currentSession = JSON.parse(currentSessionString);
                    return Object.assign(Object.assign({}, currentSession), { currentSession: true });
                }
                const otherSessionString = yield redis_configs_1.default.get(`user:${sub}:sessions:${id}`);
                const otherSession = JSON.parse(otherSessionString);
                return Object.assign(Object.assign({}, otherSession), { currentSession: false });
            })));
            return sessions;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Process Active Sessions Service');
            }
        }
    }),
    processRecentActivityData: (user) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield recentActivityDataRetrieve(user);
            return data;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Process Recent Activity Data Service');
            }
        }
    }),
    processSessionRemove: (_a) => __awaiter(void 0, [_a], void 0, function* ({ sid, sub, sessionId, }) {
        try {
            const redisPipeLine = redis_configs_1.default.pipeline();
            redisPipeLine.set(`blacklist:sessions:${sessionId}`, sessionId, 'PX', expiresInTimeUnitToMs(const_1.refreshTokenExpiresIn));
            redisPipeLine.srem(`user:${sub}:sessions`, sessionId);
            redisPipeLine.del(`user:${sub}:sessions:${sessionId}`);
            yield redisPipeLine.exec();
            const currentActiveSids = yield redis_configs_1.default.smembers(`user:${sub}:sessions`);
            const sessions = yield Promise.all(currentActiveSids.map((id) => __awaiter(void 0, void 0, void 0, function* () {
                if (id === sid) {
                    const currentSessionString = yield redis_configs_1.default.get(`user:${sub}:sessions:${id}`);
                    const currentSession = JSON.parse(currentSessionString);
                    return Object.assign(Object.assign({}, currentSession), { currentSession: true });
                }
                const otherSessionString = yield redis_configs_1.default.get(`user:${sub}:sessions:${id}`);
                const otherSession = JSON.parse(otherSessionString);
                return Object.assign(Object.assign({}, otherSession), { currentSession: false });
            })));
            return sessions;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Process Remove Session Service');
            }
        }
    }),
    processRetrieveActivity: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield retrieveActivity(userId);
            return data;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Process Retrieve Activity Service');
            }
        }
    }),
    processRetrieveActivityDetails: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield retrieveActivityDetails(userId);
            return data;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Process Retrieve Activity Details Service');
            }
        }
    }),
};
exports.default = UserServices;
