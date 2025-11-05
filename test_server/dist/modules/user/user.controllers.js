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
const user_services_1 = __importDefault(require("../../modules/user/user.services"));
const cookie_utils_1 = __importDefault(require("../../utils/cookie.utils"));
const const_1 = require("../../const");
const user_enums_1 = require("../../modules/user/user.enums");
const env_1 = require("../../env");
const metaData_utils_1 = __importDefault(require("../../utils/metaData.utils"));
const user_dto_1 = require("../../modules/user/user.dto");
const mongoose_1 = __importDefault(require("mongoose"));
const profile_services_1 = __importDefault(require("../../modules/profile/profile.services"));
const { cookieOption } = cookie_utils_1.default;
const { getRealIP, getClientMetaData } = metaData_utils_1.default;
const { CLIENT_BASE_URL } = env_1.env;
const { processSignup, processVerifyUser, processLogin, processRefreshToken, processLogout, processResend, processCheckResendStatus, processFindUser, processSentRecoverAccountOtp, processVerifyOtp, processReSentRecoverAccountOtp, processResetPassword, processOAuthCallback, processAccountActivation, processChangePasswordAndAccountActivation, processRetrieveSessionsForClearDevice, processClearDeviceAndLogin, processRecoverUserInfo, processSecurityOverview, processActiveSessions, processRecentActivityData, processSessionRemove, processRetrieveActivity, processRetrieveActivityDetails, } = user_services_1.default;
const { processChangePassword } = profile_services_1.default;
const UserControllers = {
    /**
     * This Handle Function Is For Signup Controller
     * @param req request
     * @param res request
     * @param next next function
     * This Handler Accept name,email,password as string in req.body object.we destructure the object and pass to processSignup service.processSignup service return the created user or if error occurred throw error.
     * @returns successful user creation processSignup return us created user and we send the response with activation token in cookie and with success flag,short message and in data with created user object.
     * @error on error we simply call the next function with error
     */
    handleSignUp: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, email, password } = req.body;
            const { activationToken, createdUser } = yield processSignup({
                name,
                email,
                password: { secret: password, change_at: new Date().toISOString() },
                provider: user_enums_1.AuthType.LOCAL,
            });
            const createdUserData = user_dto_1.CreateUserResponseDTO.fromEntity(createdUser);
            res.cookie('actv_token', activationToken, cookieOption(const_1.activationTokenExpiresIn));
            res.status(201).json({
                success: true,
                message: 'User created',
                data: createdUserData,
            });
        }
        catch (error) {
            logger_configs_1.default.error(error);
            next(error);
        }
    }),
    /**
     *
     */
    handleCheckActivationTokenValidity: (req, res, next) => {
        try {
            res.status(200).json({
                success: true,
                message: 'Token Is Valid',
            });
        }
        catch (error) {
            logger_configs_1.default.error(error);
            next(error);
        }
    },
    /**
     * Verify User Signup User Email
     * @param req - Express request object
     * @param res - Express response object
     * @param next - Express next middleware function
     */
    handleVerifyUser: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { sub } = req === null || req === void 0 ? void 0 : req.decoded;
            const { browser, device, location, os, ip } = yield getClientMetaData(req);
            const { accessToken, refreshToken } = yield processVerifyUser({
                browser: browser.name,
                deviceType: device.type || 'desktop',
                userId: sub,
                ipAddress: ip,
                location: `${location.city} ${location.country}`,
                os: os.name,
            });
            res.clearCookie('actv_token', cookieOption(const_1.activationTokenExpiresIn));
            res.cookie('accesstoken', accessToken, cookieOption(const_1.accessTokenExpiresIn));
            res.cookie('refreshtoken', refreshToken, cookieOption(const_1.refreshTokenExpiresIn));
            res.status(200).json({
                success: true,
                message: 'Email verification successful',
            });
        }
        catch (error) {
            logger_configs_1.default.error(error);
            next(error);
        }
    }),
    /**
     * Resend The Otp For Verify Signup User Email
     * @param req - Express request object
     * @param res - Express response object
     * @param next - Express next middleware function
     */
    handleResend: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const availableAt = req.availableAt;
            const { sub } = req.decoded;
            yield processResend(sub);
            res.status(200).json({
                success: true,
                message: 'Verification Email Resend Successful',
                data: { availableAt },
            });
        }
        catch (error) {
            logger_configs_1.default.error(error);
            next(error);
        }
    }),
    handleCheckResendStatus: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { sub } = req.decoded;
        try {
            const data = yield processCheckResendStatus({ userId: sub });
            res.status(200).json({
                success: true,
                message: 'Availability check successful',
                data,
            });
            return;
        }
        catch (error) {
            logger_configs_1.default.error(error);
            next(error);
        }
    }),
    /**
     * AccessToken Check Handler
     *
     * @param req - Express request object
     * @param res - Express response object
     * @param next - Express next middleware function
     */
    handleCheck: (req, res, next) => {
        try {
            res.status(204).send();
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    },
    handleRetrieveSessionsForClearDevice: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { sub } = req.decoded;
            const sessions = yield processRetrieveSessionsForClearDevice({
                userId: sub,
            });
            res.status(200).json({
                success: true,
                message: 'Sessions retrieve successful',
                data: sessions,
            });
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
    handleClearDeviceAndLogin: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { sub, rememberMe, provider } = req.decoded;
            const { devices } = req.body;
            const { browser, device, location, os, ip } = yield getClientMetaData(req);
            const { accessToken, refreshToken } = yield processClearDeviceAndLogin({
                browser: browser.name,
                deviceType: device.type || 'desktop',
                ipAddress: ip,
                location: `${location.city} ${location.country}`,
                os: os.name,
                user: sub,
                rememberMe,
                devices: devices,
                provider,
            });
            const refreshTokenCookieExpiresIn = rememberMe || provider === user_enums_1.AuthType.GOOGLE
                ? const_1.refreshTokenExpiresIn
                : const_1.refreshTokenExpiresInWithoutRememberMe;
            res.clearCookie('__clear_device', cookieOption(const_1.clearDevicePageTokenExpireIn));
            res.cookie('accesstoken', accessToken, cookieOption(const_1.accessTokenExpiresIn));
            res.cookie('refreshtoken', refreshToken, cookieOption(refreshTokenCookieExpiresIn));
            res.status(200).json({
                status: 'success',
                message: 'Login successful',
            });
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
    handleLogin: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { user } = req.user;
            const { rememberMe } = req.body;
            const { browser, device, location, os, ip } = yield getClientMetaData(req);
            const { accessToken, refreshToken } = yield processLogin({
                browser: browser.name,
                deviceType: device.type || 'desktop',
                ipAddress: ip,
                location: `${location.city} ${location.country}`,
                os: os.name,
                user,
                rememberMe,
            });
            res.clearCookie('r_stp1', cookieOption(const_1.recoverSessionExpiresIn));
            res.clearCookie('r_stp2', cookieOption(const_1.recoverSessionExpiresIn));
            res.clearCookie('r_stp3', cookieOption(const_1.recoverSessionExpiresIn));
            res.cookie('accesstoken', accessToken, cookieOption(const_1.accessTokenExpiresIn));
            res.cookie('refreshtoken', refreshToken, cookieOption(rememberMe
                ? const_1.refreshTokenExpiresIn
                : const_1.refreshTokenExpiresInWithoutRememberMe));
            res.status(200).json({
                status: 'success',
                message: 'Login successful',
            });
            return;
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
    /**
     * Handler to log out a user and invalidate their session.
     *
     * Responsibilities:
     * - Extracts `sub` (user ID) and `sid` (session ID) from the decoded token.
     * - Calls `processLogout` to revoke the access and refresh tokens in Redis.
     * - Clears authentication cookies (`accesstoken`, `refreshtoken`).
     * - Responds with a 200 status and a success message on completion.
     *
     * @param req - Express request object (must include `decoded`)
     * @param res - Express response object
     * @param next - Express next middleware function
     */
    handleLogout: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { sub, sid } = req.decoded;
            const { accesstoken, refreshtoken } = req.cookies;
            yield processLogout({
                accessToken: accesstoken,
                refreshToken: refreshtoken,
                userId: sub,
                sid: sid,
            });
            res.clearCookie('accesstoken', cookieOption(const_1.accessTokenExpiresIn));
            res.clearCookie('refreshtoken', cookieOption(const_1.refreshTokenExpiresIn));
            res.status(200).json({
                status: 'success',
                message: 'Logout successful',
            });
            return;
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
    handleRefreshTokens: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { sid, sub } = req.decoded;
            const { accessToken } = yield processRefreshToken({
                userId: sub,
                sid: sid,
            });
            res.cookie('accesstoken', accessToken, cookieOption(const_1.accessTokenExpiresIn));
            res.status(200).json({
                status: 'success',
                message: 'Token refreshed',
            });
            return;
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
    handleFindUser: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { user } = req.user;
            const { _id, name, avatar, email } = user;
            const { r_stp1 } = processFindUser({ userId: _id });
            res.clearCookie('r_stp2', cookieOption(const_1.recoverSessionExpiresIn));
            res.clearCookie('r_stp3', cookieOption(const_1.recoverSessionExpiresIn));
            res.cookie('r_stp1', r_stp1, cookieOption(const_1.recoverSessionExpiresIn));
            res.status(200).json({
                status: 'success',
                message: 'User Found',
                data: { name, avatar, email },
            });
            return;
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
    handleCheckR_Stp1: (req, res, next) => {
        try {
            res.status(200).json({
                status: true,
                message: 'Step One Validate',
            });
            return;
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    },
    handleRecoverUserInfo: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { sub } = req.decoded;
            const data = yield processRecoverUserInfo(sub);
            res.status(200).json({
                success: true,
                message: 'user data retrieve successful',
                data,
            });
            return;
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
    handleCheckR_Stp2: (req, res, next) => {
        try {
            res.status(200).json({
                status: true,
                message: 'Step One Validate',
            });
            return;
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    },
    handleCheckR_Stp3: (req, res, next) => {
        try {
            res.status(200).json({
                status: true,
                message: 'Step One Validate',
            });
            return;
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    },
    handleSentRecoverOtp: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const { sub } = req.decoded;
            const r_stp1 = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.r_stp1;
            const { r_stp2 } = yield processSentRecoverAccountOtp({
                userId: sub,
                r_stp1,
            });
            res.clearCookie('r_stp1', cookieOption(const_1.recoverSessionExpiresIn));
            res.clearCookie('r_stp3', cookieOption(const_1.recoverSessionExpiresIn));
            res.cookie('r_stp2', r_stp2, cookieOption(const_1.recoverSessionExpiresIn));
            res.status(200).json({
                status: 'success',
                message: 'Recover Otp Send Successful',
            });
            return;
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
    handleVerifyRecoverOtp: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const { sub } = req.decoded;
            const r_stp2 = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.r_stp2;
            const { r_stp3 } = yield processVerifyOtp({
                userId: sub,
                r_stp2,
            });
            res.clearCookie('r_stp1', cookieOption(const_1.recoverSessionExpiresIn));
            res.clearCookie('r_stp2', cookieOption(const_1.recoverSessionExpiresIn));
            res.clearCookie('r_stp3', cookieOption(const_1.recoverSessionExpiresIn));
            res.cookie('r_stp3', r_stp3, cookieOption(const_1.recoverSessionExpiresIn));
            res.status(200).json({
                status: 'success',
                message: 'OTP verification successful',
            });
            return;
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
    handleResendRecoverOtp: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const availableAt = req.availableAt;
            const { sub } = req.decoded;
            yield processReSentRecoverAccountOtp({ userId: sub });
            res.status(200).json({
                status: 'success',
                message: 'OTP resent successful',
                data: { availableAt },
            });
            return;
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
    handleResetPassword: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const { password } = req.body;
            const { sub } = req.decoded;
            const r_stp3 = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.r_stp3;
            const { browser, device, location, os, ip } = yield getClientMetaData(req);
            yield processResetPassword({
                browser: browser.name,
                deviceType: device.type || 'desktop',
                userId: sub,
                ipAddress: ip,
                location: `${location.city} ${location.country}`,
                os: os.name,
                password,
                r_stp3,
            });
            res.clearCookie('r_stp1', cookieOption(const_1.recoverSessionExpiresIn));
            res.clearCookie('r_stp2', cookieOption(const_1.recoverSessionExpiresIn));
            res.clearCookie('r_stp3', cookieOption(const_1.recoverSessionExpiresIn));
            res.status(200).json({
                status: 'success',
                message: 'Password Reset Successful',
            });
            return;
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
    handleProcessOAuthCallback: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { user, activity, provider } = req.user;
        try {
            const { browser, device, location, os, ip } = yield getClientMetaData(req);
            const { accessToken, refreshToken, addPasswordPageToken } = yield processOAuthCallback({
                user,
                activity: activity,
                browser: browser.name,
                deviceType: device.type || 'desktop',
                ipAddress: ip,
                location: `${location.city} ${location.country}`,
                os: os.name,
                provider,
            });
            res.cookie('accesstoken', accessToken, cookieOption(const_1.accessTokenExpiresIn));
            res.cookie('refreshtoken', refreshToken, cookieOption(const_1.refreshTokenExpiresIn));
            if (addPasswordPageToken && activity === user_enums_1.ActivityType.SIGNUP_SUCCESS) {
                res.cookie('pass_rqrd', addPasswordPageToken, cookieOption(const_1.addPasswordPageTokenExpiresIn));
                res.redirect(`${CLIENT_BASE_URL}/auth/create-password`);
                return;
            }
            if (addPasswordPageToken) {
                res.cookie('pass_rqrd', addPasswordPageToken, cookieOption(const_1.addPasswordPageTokenExpiresIn));
                res.redirect(`${CLIENT_BASE_URL}/auth/create-password`);
                return;
            }
            res.redirect(CLIENT_BASE_URL);
            return;
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
    handleCreatePassword: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { password } = req.body;
            const { sub } = req.decoded;
            const { pass_rqrd } = req.cookies;
            const user = new mongoose_1.default.Types.ObjectId(sub);
            yield processChangePassword({
                password: { secret: password, change_at: new Date().toISOString() },
                user,
                addPasswordPageToken: pass_rqrd,
            });
            res.clearCookie('pass_rqrd', cookieOption(const_1.addPasswordPageTokenExpiresIn));
            res.status(200).json({
                status: 'success',
                message: 'password create successful',
            });
            return;
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
    /**
     * This handle function is for account activation
     * @param req Request param for getting request details and data
     * @param res Response param for getting response details and data
     * @param next Next param for passing the request to next function
     * This handler didn't accept any data in body and query.Its only accept data in request params,An valid uuid token.
     * @return Its return an success response or error response base on query
     * @error Its throw global error if any incident happened during database query
     */
    handleAccountActivation: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { uuid } = req.params;
            const userId = req.user;
            const token = processAccountActivation(userId);
            res.cookie('__actvwithcngpass', token, cookieOption(const_1.changePasswordPageTokenExpiresIn));
            res.redirect(`${CLIENT_BASE_URL}/auth/unlock/change/${uuid}`);
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
    handleCheckChangePasswordPageToken: (req, res, next) => {
        try {
            res.status(200).json({ success: true, message: 'Token is valid' });
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    },
    handleChangePasswordAndAccountActivation: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { browser, device, location, os, ip } = yield getClientMetaData(req);
            const { password } = req.body;
            const token = req.cookies.__actvwithcngpass;
            const userId = req.user;
            const { uuid } = req.params;
            yield processChangePasswordAndAccountActivation({
                userId: userId,
                token,
                uuid,
                password,
                browser: browser.name,
                deviceType: device.type || 'desktop',
                ipAddress: ip,
                location: `${location.city} ${location.country}`,
                os: os.name,
            });
            res.clearCookie('__actvwithcngpass', cookieOption(const_1.changePasswordPageTokenExpiresIn));
            res
                .status(200)
                .json({ success: true, message: 'Account activation complete' });
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
    handleCheckClearDevicePageToken: (req, res, next) => {
        try {
            res.status(200).json({ success: true, message: 'Token Is Validate' });
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    },
    handleSecurityOverview: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { sub } = req.decoded;
            const data = yield processSecurityOverview(sub);
            res.status(200).json({
                success: true,
                message: 'Security overview data retrieve successful',
                data,
            });
            return;
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
    handleActiveSession: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { sub, sid } = req.decoded;
            const data = yield processActiveSessions({ sid: sid, sub });
            res.status(200).json({
                success: true,
                message: 'Active session data retrieve successful',
                data,
            });
            return;
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
    handleRecentActivity: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { sub } = req.decoded;
            const data = yield processRecentActivityData(sub);
            res.status(200).json({
                success: true,
                message: 'Recent Activity Retrieve Successful',
                data,
            });
            return;
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
    handleSessionRemove: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { sub, sid } = req.decoded;
            const { sessionId } = req.body;
            const data = yield processSessionRemove({
                sessionId,
                sid: sid,
                sub,
            });
            res
                .status(200)
                .json({ success: true, message: 'Session Has Removed', data });
            return;
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
    handleForceLogout: (req, res, next) => {
        try {
            res.clearCookie('accesstoken', cookieOption(const_1.accessTokenExpiresIn));
            res.clearCookie('refreshtoken', cookieOption(const_1.refreshTokenExpiresIn));
            res
                .status(200)
                .json({ success: true, message: 'Force Logout Successful' });
            return;
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    },
    handleRetrieveActivity: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { sub } = req.decoded;
            const data = yield processRetrieveActivity(sub);
            res
                .status(200)
                .json({ success: true, message: 'Activity Retrieve Successful', data });
            return;
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
    handleRetrieveActivityDetails: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const data = yield processRetrieveActivityDetails(id);
            if (!data) {
                res.status(404).json({
                    success: false,
                    message: 'Activity Details Not Found',
                });
                return;
            }
            res.status(200).json({
                success: true,
                message: 'Activity Details Retrieve Successful',
                data,
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
exports.default = UserControllers;
