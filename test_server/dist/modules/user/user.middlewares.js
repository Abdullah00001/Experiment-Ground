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
const redis_configs_1 = __importDefault(require("../../configs/redis.configs"));
const user_repositories_1 = __importDefault(require("../../modules/user/user.repositories"));
const password_utils_1 = __importDefault(require("../../utils/password.utils"));
const jwt_utils_1 = __importDefault(require("../../utils/jwt.utils"));
const email_jobs_1 = __importDefault(require("../../queue/jobs/email.jobs"));
const activity_jobs_1 = __importDefault(require("../../queue/jobs/activity.jobs"));
const metaData_utils_1 = __importDefault(require("../../utils/metaData.utils"));
const user_enums_1 = require("../../modules/user/user.enums");
const const_1 = require("../../const");
const date_utils_1 = __importDefault(require("../../utils/date.utils"));
const singletons_1 = require("../../singletons");
const calculation_utils_1 = __importDefault(require("../../utils/calculation.utils"));
const cookie_utils_1 = __importDefault(require("../../utils/cookie.utils"));
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../../env");
const uuid_1 = require("uuid");
const { comparePassword } = password_utils_1.default;
const { findUserByEmail, updateUserAccountStatus } = user_repositories_1.default;
const { verifyAccessToken, verifyRefreshToken, verifyRecoverToken, verifyActivationToken, verifyChangePasswordPageToken, generateClearDevicePageToken, verifyClearDevicePageToken, verifyAddPasswordPageToken, } = jwt_utils_1.default;
const { sharedCookieOption, cookieOption } = cookie_utils_1.default;
const { loginFailedNotificationEmailToQueue, addAccountLockNotificationToQueue, } = email_jobs_1.default;
const { loginFailedActivitySavedInDb, accountLockActivitySavedInDb } = activity_jobs_1.default;
const { getClientMetaData, getRealIP } = metaData_utils_1.default;
const { formatDateTime } = date_utils_1.default;
const otpUtils = (0, singletons_1.OtpUtilsSingleton)();
const { expiresInTimeUnitToMs } = calculation_utils_1.default;
const UserMiddlewares = {
    isSignupUserExist: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email } = req.body;
            const isUser = yield findUserByEmail(email);
            if (isUser) {
                res.status(409).json({ success: false, message: 'User already exist' });
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
                logger_configs_1.default.error('Unknown Error Occurred In isSignupUser Exist Middleware');
                next(error);
            }
        }
    }),
    isUserExistAndVerified: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email } = req.body;
            const isUserExist = yield findUserByEmail(email);
            if (!isUserExist) {
                res.status(401).json({
                    success: false,
                    message: 'Invalid Credential,Check Your Email And Password',
                });
                return;
            }
            if (!isUserExist.isVerified) {
                res.status(403).json({ success: false, message: 'User Not Verified' });
                return;
            }
            req.user = { user: isUserExist };
            next();
        }
        catch (error) {
            if (error instanceof Error) {
                logger_configs_1.default.error(error);
                next(error);
            }
            else {
                logger_configs_1.default.error('Unknown Error Occurred In isUser Exist and Verified Middleware');
                next(error);
            }
        }
    }),
    isUserExist: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email } = req.body;
            const isUserExist = yield findUserByEmail(email);
            if (!isUserExist) {
                res.status(404).json({ success: false, message: 'User Not Found' });
                return;
            }
            req.user = { user: isUserExist };
            next();
        }
        catch (error) {
            if (error instanceof Error) {
                logger_configs_1.default.error(error);
                next(error);
            }
            else {
                logger_configs_1.default.error('Unknown Error Occurred In isUser Exist Middleware');
                next(error);
            }
        }
    }),
    isUserVerified: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const { isVerified } = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user;
            if (!isVerified) {
                res
                    .status(403)
                    .json({ success: false, message: 'Email With User Not Verified' });
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
                logger_configs_1.default.error('Unknown Error Occurred In isUserVerified Middleware');
                next(error);
            }
        }
    }),
    checkOtp: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { otp } = req.body;
            const { sub } = req === null || req === void 0 ? void 0 : req.decoded;
            const hashedOtp = yield redis_configs_1.default.get(`user:otp:${sub}`);
            if (!hashedOtp) {
                res
                    .status(400)
                    .json({ success: false, message: 'Otp has been expired' });
                return;
            }
            if (otpUtils.compareOtp({ hashedOtp, otp }) === false) {
                res.status(400).json({ success: false, message: 'Invalid otp' });
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
                logger_configs_1.default.error('Unknown Error Occurred In Check Otp Middleware');
                next(error);
            }
        }
    }),
    checkRecoverOtp: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { otp } = req.body;
            const { sub } = req.decoded;
            const storedOtp = yield redis_configs_1.default.get(`user:recover:otp:${sub}`);
            if (!storedOtp) {
                res
                    .status(400)
                    .json({ success: false, message: 'Otp has been expired' });
                return;
            }
            if (storedOtp !== otp) {
                res.status(400).json({ success: false, message: 'Invalid otp' });
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
                logger_configs_1.default.error('Unknown Error Occurred In Check Otp Middleware');
                next(error);
            }
        }
    }),
    checkPassword: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            const { name, email, password, _id } = (_a = req.user) === null || _a === void 0 ? void 0 : _a.user;
            const key = `user:login:attempts:${email}`;
            if (!(yield comparePassword((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.password, password.secret))) {
                yield redis_configs_1.default.set(key, 0, 'PX', expiresInTimeUnitToMs('24h'), 'NX');
                const attemptCount = yield redis_configs_1.default.incr(key);
                if (attemptCount === 3) {
                    const { browser, device, location, os, ip } = yield getClientMetaData(req);
                    const emailPayload = {
                        name,
                        email,
                        browser: browser.name,
                        device: device.type || 'desktop',
                        ip,
                        os: os.name,
                        location: `${location.city} ${location.country}`,
                        time: formatDateTime(new Date().toISOString()),
                    };
                    const activityPayload = {
                        browser: browser.name,
                        device: device.type || 'desktop',
                        os: os.name,
                        location: `${location.city} ${location.country}`,
                        ipAddress: ip,
                        activityType: user_enums_1.ActivityType.LOGIN_FAILED,
                        user: _id,
                        title: const_1.AccountActivityMap.LOGIN_FAILED.title,
                        description: const_1.AccountActivityMap.LOGIN_FAILED.description,
                    };
                    yield Promise.all([
                        updateUserAccountStatus({
                            userId: _id,
                            accountStatus: user_enums_1.AccountStatus.ON_RISK,
                        }),
                        loginFailedNotificationEmailToQueue(emailPayload),
                        loginFailedActivitySavedInDb(activityPayload),
                    ]);
                    res.cookie('__cptchaRequired', true, sharedCookieOption());
                }
                if (attemptCount === 9) {
                    const { browser, device, location, os, ip } = yield getClientMetaData(req);
                    const activityPayload = {
                        activityType: user_enums_1.ActivityType.ACCOUNT_LOCKED,
                        title: const_1.AccountActivityMap.ACCOUNT_LOCKED.title,
                        description: const_1.AccountActivityMap.ACCOUNT_LOCKED.description,
                        browser: browser.name,
                        device: device.type || 'desktop',
                        ipAddress: ip,
                        location: `${location.city} ${location.country}`,
                        os: os.name,
                        user: _id,
                    };
                    const uuid = (0, uuid_1.v4)();
                    const emailData = {
                        name,
                        email,
                        time: formatDateTime(new Date().toISOString()),
                        activeLink: `${env_1.env.SERVER_BASE_URL}${const_1.baseUrl.v1}/auth/active/${uuid}`,
                    };
                    const pipeline = redis_configs_1.default.pipeline();
                    yield updateUserAccountStatus({
                        userId: _id,
                        accountStatus: user_enums_1.AccountStatus.LOCKED,
                        lockedAt: new Date().toISOString(),
                    });
                    pipeline.set(`blacklist:ip:${ip}`, ip, 'PX', expiresInTimeUnitToMs('1d'));
                    const sessions = yield redis_configs_1.default.smembers(`user:${_id}:sessions`);
                    pipeline.del(`user:${_id}:sessions`);
                    sessions.forEach((sid) => {
                        pipeline.del(`user:${_id}:sessions:${sid}`);
                    });
                    pipeline.set(`user:activation:uuid:${uuid}`, _id, 'PX', expiresInTimeUnitToMs('1d'));
                    yield Promise.all([
                        pipeline.exec(),
                        addAccountLockNotificationToQueue(emailData),
                        accountLockActivitySavedInDb(activityPayload),
                    ]);
                    res.status(401).json({
                        success: false,
                        message: 'Your account has been locked,Check your email we sent yor email for more information,Or contact our support',
                    });
                    return;
                }
                res.status(401).json({
                    success: false,
                    message: 'Invalid Credential,Check Your Email And Password',
                });
                return;
            }
            yield redis_configs_1.default.del(key);
            next();
        }
        catch (error) {
            if (error instanceof Error) {
                logger_configs_1.default.error(error);
                next(error);
            }
            else {
                logger_configs_1.default.error('Unknown Error Occurred In Check Password Middleware');
                next(error);
            }
        }
    }),
    checkSessionsLimit: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const { user, provider } = req.user;
            const { _id } = user;
            const sessions = yield redis_configs_1.default.smembers(`user:${_id}:sessions`);
            const validSessions = [];
            for (const sessionId of sessions) {
                const isExist = yield redis_configs_1.default.exists(`user:${_id}:sessions:${sessionId}`);
                if (isExist)
                    validSessions.push(sessionId);
                else
                    yield redis_configs_1.default.srem(`user:${_id}:sessions`, sessionId);
            }
            if (validSessions.length === 3) {
                let token;
                if (provider === user_enums_1.AuthType.GOOGLE) {
                    token = generateClearDevicePageToken({
                        sub: _id,
                        provider,
                    });
                }
                else {
                    const rememberMe = (_a = req.body) === null || _a === void 0 ? void 0 : _a.rememberMe;
                    token = generateClearDevicePageToken({
                        sub: _id,
                        rememberMe,
                    });
                }
                res.cookie('__clear_device', token, cookieOption(const_1.clearDevicePageTokenExpireIn));
                if (provider === user_enums_1.AuthType.GOOGLE) {
                    res.redirect(`${env_1.env.CLIENT_BASE_URL}/auth/clear-session`);
                }
                res.status(429).json({ success: false, message: 'Login limit exceed' });
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
                logger_configs_1.default.error('Unknown Error Occurred In Check Session Limit Middleware');
                next(error);
            }
        }
    }),
    checkClearDevicePageToken: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.__clear_device;
            const isExist = yield redis_configs_1.default.exists(`blacklist:jwt:${token}`);
            if (isExist) {
                res.status(403).json({ success: false, message: 'Token expired' });
                return;
            }
            if (!token) {
                res.status(403).json({ success: false, message: 'Token expired' });
                return;
            }
            const decoded = verifyClearDevicePageToken(token);
            if (!decoded) {
                res
                    .status(403)
                    .json({ success: false, message: 'Token expired or invalid' });
                return;
            }
            req.decoded = decoded;
            next();
        }
        catch (error) {
            if (error instanceof Error) {
                logger_configs_1.default.error(error);
                next(error);
            }
            else {
                logger_configs_1.default.error('Unknown Error Occurred In Check Session Limit Middleware');
                next(error);
            }
        }
    }),
    checkActiveToken: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { uuid } = req.params;
            // const isBlacklist=await redisClient.exists(`blacklist:uuid:${uuid}`);
            const isExist = yield redis_configs_1.default.get(`user:activation:uuid:${uuid}`);
            if (!isExist) {
                res.redirect(`${env_1.env.CLIENT_BASE_URL}/activation/${uuid}`);
                return;
            }
            req.user = isExist;
            next();
        }
        catch (error) {
            if (error instanceof Error) {
                logger_configs_1.default.error(error);
                next(error);
            }
            else {
                logger_configs_1.default.error('Unknown Error Occurred In Check Active Token Middleware');
                next(error);
            }
        }
    }),
    checkChangePasswordPageToken: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.__actvwithcngpass;
            const isExist = yield redis_configs_1.default.exists(`blacklist:jwt:${token}`);
            if (isExist) {
                res.status(403).json({ success: false, message: 'Token expired' });
                return;
            }
            if (!token) {
                res.status(403).json({ success: false, message: 'Token expired' });
                return;
            }
            const decoded = verifyChangePasswordPageToken(token);
            if (!decoded) {
                res
                    .status(403)
                    .json({ success: false, message: 'Token expired or invalid' });
                return;
            }
            req.user = decoded.sub;
            next();
        }
        catch (error) {
            if (error instanceof Error) {
                logger_configs_1.default.error(error);
                next(error);
            }
            else {
                logger_configs_1.default.error('Unknown Error Occurred In Check Active Token Middleware');
                next(error);
            }
        }
    }),
    /**
     * Middleware to validate the user's access token.
     *
     * - Ensures an access token exists in cookies.
     * - Checks if the token is blacklisted (revoked).
     * - Verifies token validity (expiration, signature).
     * - Attaches the decoded payload to `req.decoded` on success.
     *
     * @param req - Express request object
     * @param res - Express response object
     * @param next - Express next middleware function
     */
    checkAccessToken: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const token = (_a = req === null || req === void 0 ? void 0 : req.cookies) === null || _a === void 0 ? void 0 : _a.accesstoken;
            if (!token) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorize Request',
                    error: user_enums_1.AuthErrorType.TOKEN_EXPIRED,
                });
                return;
            }
            const isBlacklisted = yield redis_configs_1.default.get(`blacklist:jwt:${token}`);
            if (isBlacklisted) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorize Request',
                    error: user_enums_1.AuthErrorType.SESSION_BLACKLISTED,
                });
                return;
            }
            const decoded = verifyAccessToken(token);
            if (!decoded) {
                res.clearCookie('accesstoken', cookieOption(const_1.accessTokenExpiresIn));
                res.status(401).json({
                    success: false,
                    message: 'Unauthorize Request',
                    error: user_enums_1.AuthErrorType.TOKEN_INVALID,
                });
                return;
            }
            req.decoded = decoded;
            next();
        }
        catch (error) {
            if (error instanceof Error) {
                logger_configs_1.default.error(error);
                next(error);
            }
            else {
                logger_configs_1.default.error('Unknown Error Occurred In Check Access Token Middleware');
                next(error);
            }
        }
    }),
    /**
     * Middleware to validate the user's session extracted from the refresh token.
     *
     * Responsibilities:
     * - Checks if the session ID (`sid`) is blacklisted (revoked/expired).
     * - Validates that the session still exists in Redis.
     * - Cleans up invalid session references and clears cookies if necessary.
     * - Proceeds to the next middleware if the session is valid.
     *
     * Possible responses:
     * - 401 Unauthorized → if the session is blacklisted or expired.
     *
     * @param req - Express request object (must include `decoded` with `sid` and `sub`)
     * @param res - Express response object
     * @param next - Express next middleware function
     */
    checkSession: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const isLogoutEndpoint = req.path === '/auth/logout';
        try {
            const { sid, sub } = req.decoded;
            const isBlacklisted = yield redis_configs_1.default.exists(`blacklist:sessions:${sid}`);
            const isExists = yield redis_configs_1.default.exists(`user:${sub}:sessions:${sid}`);
            if (isLogoutEndpoint && !isExists && !isBlacklisted) {
                const accessToken = (_a = req === null || req === void 0 ? void 0 : req.cookies) === null || _a === void 0 ? void 0 : _a.accesstoken;
                yield redis_configs_1.default.srem(`user:${sub}:sessions`, sid);
                yield redis_configs_1.default.set(`blacklist:jwt:${accessToken}`, accessToken, 'PX', expiresInTimeUnitToMs(const_1.accessTokenExpiresIn));
                res.clearCookie('accesstoken', cookieOption(const_1.accessTokenExpiresIn));
                res.clearCookie('refreshtoken', cookieOption(const_1.refreshTokenExpiresIn));
                res.status(200).json({
                    status: 'success',
                    message: 'Logout successful',
                });
                return;
            }
            if (isBlacklisted) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorize Request',
                    error: user_enums_1.AuthErrorType.SESSION_BLACKLISTED,
                });
                return;
            }
            if (!isExists) {
                yield redis_configs_1.default.srem(`user:${sub}:sessions`, sid);
                res.clearCookie('accesstoken', cookieOption(const_1.accessTokenExpiresIn));
                res.clearCookie('refreshtoken', cookieOption(const_1.refreshTokenExpiresIn));
                res.status(440).json({
                    success: false,
                    message: 'Unauthorize Request',
                    error: 'Session has been expired,Login Required!',
                });
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
                logger_configs_1.default.error('Unknown Error Occurred In Check Session Middleware');
                next(error);
            }
        }
    }),
    /**
     * Middleware to validate the refresh token.
     *
     * Responsibilities:
     * - Ensures a refresh token exists in cookies.
     * - Checks if the token is blacklisted (revoked).
     * - Verifies token validity (expiration, signature).
     * - Attaches the decoded payload to `req.decoded` if valid.
     * - Allows the server to issue a new access token based on a valid session.
     *
     * Possible responses:
     * - 401 Unauthorized → if the token is missing, revoked, or invalid/expired.
     *
     * @param req - Express request object
     * @param res - Express response object
     * @param next - Express next middleware function
     */
    checkRefreshToken: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.refreshtoken;
            if (!token) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorize Request',
                    error: user_enums_1.AuthErrorType.TOKEN_EXPIRED,
                });
                return;
            }
            const isBlacklisted = yield redis_configs_1.default.get(`blacklist:jwt:${token}`);
            if (isBlacklisted) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorize Request',
                    error: user_enums_1.AuthErrorType.TOKEN_BLACKLISTED,
                });
                return;
            }
            const decoded = verifyRefreshToken(token);
            if (!decoded) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorize Request',
                    error: user_enums_1.AuthErrorType.TOKEN_INVALID,
                });
                return;
            }
            req.decoded = decoded;
            next();
        }
        catch (error) {
            if (error instanceof Error) {
                logger_configs_1.default.error(error);
                next(error);
            }
            else {
                logger_configs_1.default.error('Unknown Error Occurred In Check Refresh Token Middleware');
                next(error);
            }
        }
    }),
    checkAddPasswordPageToken: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.pass_rqrd;
            if (!token) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorize Request',
                    error: user_enums_1.AuthErrorType.TOKEN_EXPIRED,
                });
                return;
            }
            const isBlacklisted = yield redis_configs_1.default.get(`blacklist:jwt:${token}`);
            if (isBlacklisted) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorize Request',
                    error: user_enums_1.AuthErrorType.TOKEN_BLACKLISTED,
                });
                return;
            }
            const decoded = verifyAddPasswordPageToken(token);
            if (!decoded) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorize Request',
                    error: user_enums_1.AuthErrorType.TOKEN_INVALID,
                });
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
                logger_configs_1.default.error('Unknown Error Occurred In Check Refresh Token Middleware');
                next(error);
            }
        }
    }),
    /**
     * This Middleware For Recover Account Step 1 Token Check So That Step 1 Will Secure And Prevent Unwanted Situation
     * @param req Http Request Container
     * @param res Http Response Container
     */
    checkR_stp1Token: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const token = (_a = req === null || req === void 0 ? void 0 : req.cookies) === null || _a === void 0 ? void 0 : _a.r_stp1;
            if (!token) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorize Request',
                });
                return;
            }
            const isBlacklisted = yield redis_configs_1.default.get(`blacklist:r_stp1:${token}`);
            if (isBlacklisted) {
                res.status(403).json({
                    success: false,
                    message: 'Permission Denied',
                });
                return;
            }
            const decoded = verifyRecoverToken(token);
            if (!decoded) {
                res.status(403).json({
                    success: false,
                    message: 'Permission Denied',
                });
                return;
            }
            req.decoded = decoded;
            next();
        }
        catch (error) {
            if (error instanceof Error) {
                logger_configs_1.default.error(error);
                next(error);
            }
            else {
                logger_configs_1.default.error('Unknown Error Occurred In Check r_stp1 Token Middleware');
                next(error);
            }
        }
    }),
    /**
     * This Middleware For Recover Account Step 2 Token Check So That Step 2 Will Secure And Prevent Unwanted Situation
     * @param req Http Request Container
     * @param res Http Response Container
     */
    checkR_stp2Token: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const token = (_a = req === null || req === void 0 ? void 0 : req.cookies) === null || _a === void 0 ? void 0 : _a.r_stp2;
            if (!token) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorize Request',
                });
                return;
            }
            const isBlacklisted = yield redis_configs_1.default.get(`blacklist:r_stp2:${token}`);
            if (isBlacklisted) {
                res.status(403).json({
                    success: false,
                    message: 'Permission Denied',
                });
                return;
            }
            const decoded = verifyRecoverToken(token);
            if (!decoded) {
                res.status(403).json({
                    success: false,
                    message: 'Permission Denied',
                });
                return;
            }
            req.decoded = decoded;
            next();
        }
        catch (error) {
            if (error instanceof Error) {
                logger_configs_1.default.error(error);
                next(error);
            }
            else {
                logger_configs_1.default.error('Unknown Error Occurred In Check r_stp2 Token Middleware');
                next(error);
            }
        }
    }),
    /**
     * This Middleware For Recover Account Step 3 Token Check So That Step 3 Will Secure And Prevent Unwanted Situation
     * @param req Http Request Container
     * @param res Http Response Container
     */
    checkR_stp3Token: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const token = (_a = req === null || req === void 0 ? void 0 : req.cookies) === null || _a === void 0 ? void 0 : _a.r_stp3;
            if (!token) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorize Request',
                });
                return;
            }
            const isBlacklisted = yield redis_configs_1.default.get(`blacklist:r_stp3:${token}`);
            if (isBlacklisted) {
                res.status(403).json({
                    success: false,
                    message: 'Permission Denied',
                });
                return;
            }
            const decoded = verifyRecoverToken(token);
            if (!decoded) {
                res.status(403).json({
                    success: false,
                    message: 'Permission Denied',
                });
                return;
            }
            req.decoded = decoded;
            next();
        }
        catch (error) {
            if (error instanceof Error) {
                logger_configs_1.default.error(error);
                next(error);
            }
            else {
                logger_configs_1.default.error('Unknown Error Occurred In Check r_stp3 Token Middleware');
                next(error);
            }
        }
    }),
    otpRateLimiter: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { sub } = req.decoded;
        const key = `otp:limit:${sub}`;
        try {
            const isKeyExist = yield redis_configs_1.default.exists(key);
            if (!isKeyExist) {
                yield redis_configs_1.default.set(key, 1, 'PX', expiresInTimeUnitToMs(const_1.otpRateLimitSlidingWindow));
                next();
            }
            else {
                const limitCount = yield redis_configs_1.default.incr(key);
                if (limitCount <= const_1.otpRateLimitMaxCount) {
                    next();
                }
                else {
                    res.status(429).json({
                        success: false,
                        message: 'Too Many Request,Try Again Later',
                    });
                    return;
                }
            }
        }
        catch (error) {
            if (error instanceof Error) {
                logger_configs_1.default.error(error);
                next(error);
            }
            else {
                logger_configs_1.default.error('Unknown Error Occurred In Otp Rate Limiter Middleware');
                next(error);
            }
        }
    }),
    /**
     * Middleware to apply rate limiting and cooldown for the "resend OTP email" endpoint.
     *
     * Purpose:
     * - Prevents users from sending repeated OTP requests in quick succession.
     * - Mitigates spam, bot abuse, or accidental multiple requests that could overload the server.
     *
     * Behavior:
     * 1. Checks if a cooldown (`ttlKey`) already exists for the user:
     *    - If yes, blocks the request with a 400 response (`Try Again Later`).
     * 2. Checks if a count (`countKey`) exists:
     *    - If not, this is the first attempt:
     *      - Creates the cooldown key and initial count in Redis.
     *    - If yes, user has made previous attempts:
     *      - Increments the cooldown count.
     *      - Extends the cooldown duration **proportionally to the number of previous attempts** (linear backoff).
     *
     * Redis keys:
     * - `ttlKey` → Tracks the active cooldown period per user.
     * - `countKey` → Tracks the number of resend OTP attempts for the user.
     *
     * @param req - Express request object (must include `decoded.sub` for user identification)
     * @param res - Express response object
     * @param next - Express next middleware function
     * @returns JSON response with status 400 if cooldown is active, otherwise calls `next()`
     * @throws Forwards any Redis or unexpected errors to `next()`
     */
    resendOtpEmailCoolDown: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { sub } = req.decoded;
        const ttlKey = `otp:resendOtpEmailCoolDown:${sub}`;
        const countKey = `otp:resendOtpEmailCoolDown:${sub}:count`;
        try {
            const isTtlKeyExist = yield redis_configs_1.default.exists(ttlKey);
            if (isTtlKeyExist) {
                res.status(400).json({
                    success: false,
                    message: `Try Again Later`,
                });
                return;
            }
            const isCountKeyExist = yield redis_configs_1.default.exists(countKey);
            if (!isCountKeyExist) {
                const initialExpireAt = 1 * expiresInTimeUnitToMs(const_1.resendOtpEmailCoolDownWindow);
                const pipeline = redis_configs_1.default.pipeline();
                pipeline.set(ttlKey, sub, 'PX', initialExpireAt);
                pipeline.set(countKey, 1, 'PX', 1 * 60 * 60 * 1000);
                yield pipeline.exec();
                req.availableAt = Date.now() + initialExpireAt;
                next();
            }
            else {
                const currentCoolDownCount = Number(yield redis_configs_1.default.get(countKey));
                if (currentCoolDownCount >= const_1.maxOtpResendPerHour) {
                    const countTtl = yield redis_configs_1.default.pttl(countKey);
                    res.status(429).json({
                        success: false,
                        message: 'Too many attempts. Please try again later.',
                        nextAvailableAt: Date.now() + countTtl,
                    });
                    return;
                }
                const pipeline = redis_configs_1.default.pipeline();
                const coolDownCount = currentCoolDownCount + 1;
                const expireAt = Math.min(Math.pow(2, coolDownCount - 1) *
                    expiresInTimeUnitToMs(const_1.resendOtpEmailCoolDownWindow), 60 * 60 * 1000);
                pipeline.set(ttlKey, sub, 'PX', expireAt);
                pipeline.set(countKey, coolDownCount, 'KEEPTTL');
                yield pipeline.exec();
                req.availableAt = Date.now() + expireAt;
                next();
            }
        }
        catch (error) {
            if (error instanceof Error) {
                logger_configs_1.default.error(error);
                next(error);
            }
            else {
                logger_configs_1.default.error('Unknown Error Occurred In Otp Rate Limiter Middleware');
                next(new Error('Unknown Error In resendOtpEmailCoolDown middleware'));
            }
        }
    }),
    checkActivationToken: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const token = (_a = req === null || req === void 0 ? void 0 : req.cookies) === null || _a === void 0 ? void 0 : _a.actv_token;
            if (!token) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorize Request',
                    error: 'Refresh Token is missing',
                });
                return;
            }
            const isBlacklisted = yield redis_configs_1.default.get(`blacklist:actv_token:${token}`);
            if (isBlacklisted) {
                res.status(401).json({
                    success: false,
                    message: 'Permission Denied',
                    error: 'actv Token has been revoked',
                });
                return;
            }
            const decoded = verifyActivationToken(token);
            if (!decoded) {
                res.status(401).json({
                    success: false,
                    message: 'Permission Denied',
                });
                return;
            }
            req.decoded = decoded;
            next();
        }
        catch (error) {
            if (error instanceof Error) {
                logger_configs_1.default.error(error);
                next(error);
            }
            else {
                logger_configs_1.default.error('Unknown Error Occurred In Otp Rate Limiter Middleware');
                next(new Error('Unknown Error In resendOtpEmailCoolDown middleware'));
            }
        }
    }),
    checkIpBlackList: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const ip = getRealIP(req);
            const isBlacklisted = yield redis_configs_1.default.get(`blacklist:ip:${ip}`);
            if (isBlacklisted) {
                res.status(403).json({
                    success: false,
                    message: 'Access denied: Your IP address has been temporarily blocked due to suspicious activity. Please try again later or contact support if you believe this is a mistake.',
                });
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
                logger_configs_1.default.error('Unknown Error Occurred In Check IP Blacklist Middleware');
                next(new Error('Unknown Error In Check IP Blacklist middleware'));
            }
        }
    }),
    checkLoginAttempts: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, captchaToken } = req.body;
        try {
            const attempts = Number(yield redis_configs_1.default.get(`user:login:attempts:${email}`));
            if (attempts >= 4 && !captchaToken) {
                res.status(402).json({
                    success: false,
                    message: 'Captcha verification failed, Captcha token required',
                });
                return;
            }
            if (attempts >= 4 && captchaToken) {
                const captchaRes = yield axios_1.default.post(`https://www.google.com/recaptcha/api/siteverify?secret=${env_1.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`);
                const data = captchaRes.data;
                if (!data.success) {
                    res.status(402).json({
                        success: false,
                        message: 'Captcha verification failed',
                    });
                    return;
                }
            }
            next();
        }
        catch (error) {
            if (error instanceof Error) {
                logger_configs_1.default.error(error);
                next(error);
            }
            else {
                logger_configs_1.default.error('Unknown Error Occurred In Check Login Attempts Middleware');
                next(new Error('Unknown Error In Check Login Attempts middleware'));
            }
        }
    }),
};
exports.default = UserMiddlewares;
