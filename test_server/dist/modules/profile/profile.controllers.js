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
const const_1 = require("../../const");
const profile_services_1 = __importDefault(require("../../modules/profile/profile.services"));
const cookie_utils_1 = __importDefault(require("../../utils/cookie.utils"));
const metaData_utils_1 = __importDefault(require("../../utils/metaData.utils"));
const mongoose_1 = __importDefault(require("mongoose"));
const { processGetProfile, processUpdateProfile, processChangePassword, processDeleteAccount, processAvatarUpload, processAvatarRemove, processAvatarChange, } = profile_services_1.default;
const { getRealIP, getClientMetaData } = metaData_utils_1.default;
const { cookieOption } = cookie_utils_1.default;
const ProfileControllers = {
    handleUpdateProfile: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { sub } = req.decoded;
            const userId = new mongoose_1.default.Types.ObjectId(sub);
            const payload = req.body;
            const data = yield processUpdateProfile(Object.assign(Object.assign({}, payload), { user: userId }));
            res.status(200).json({
                status: 'success',
                message: 'update profile successful',
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
    handleGetProfile: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { sub } = req.decoded;
            const user = new mongoose_1.default.Types.ObjectId(sub);
            const queryString = req.query.fields;
            if (queryString && (queryString === null || queryString === void 0 ? void 0 : queryString.length) > 0) {
                const queryFieldList = queryString.split(',');
                const data = yield processGetProfile({ user, queryFieldList });
                res
                    .status(200)
                    .json({ status: 'success', message: 'get profile successful', data });
            }
            else {
                const data = yield processGetProfile({ user });
                res
                    .status(200)
                    .json({ status: 'success', message: 'get profile successful', data });
            }
            return;
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
    handleChangePassword: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { password } = req.body;
            const { sub } = req.decoded;
            const user = new mongoose_1.default.Types.ObjectId(sub);
            yield processChangePassword({
                password: { secret: password, change_at: new Date().toISOString() },
                user,
            });
            res.status(200).json({
                status: 'success',
                message: 'password change successful',
                data: {
                    change_at: new Date().toISOString(),
                },
            });
            return;
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
    handleDeleteAccount: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { sub, sid } = req.decoded;
        const accessToken = req.cookies.accesstoken;
        const refreshToken = req.cookies.refreshtoken;
        const { browser, device, location, os, ip } = yield getClientMetaData(req);
        const user = new mongoose_1.default.Types.ObjectId(sub);
        try {
            yield processDeleteAccount({
                accessToken,
                browser: browser.name,
                deviceType: device.type || 'desktop',
                ipAddress: ip,
                location: `${location.city} ${location.country}`,
                os: os.name,
                refreshToken,
                user,
                sid: sid,
            });
            res.clearCookie('accesstoken', cookieOption(const_1.accessTokenExpiresIn));
            res.clearCookie('refreshtoken', cookieOption(const_1.refreshTokenExpiresIn));
            res
                .status(200)
                .json({ status: 'success', message: 'account delete successful' });
            return;
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
    handleAvatarUpload: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { sub } = req.decoded;
        const user = new mongoose_1.default.Types.ObjectId(sub);
        const fileName = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
        try {
            const data = yield processAvatarUpload({ fileName, user });
            res.status(200).json({ success: true, message: 'Avatar uploaded', data });
            return;
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
    handleAvatarRemove: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { sub } = req.decoded;
        const user = new mongoose_1.default.Types.ObjectId(sub);
        const { folder, public_id } = req.params;
        if (!public_id && !folder) {
            res.status(400).json({
                status: 'error',
                message: 'public_id is required to delete an image',
            });
            return;
        }
        const publicId = `${folder}/${public_id}`;
        try {
            yield processAvatarRemove({ publicId, user });
            res.status(204).end();
            return;
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
    handleAvatarChange: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const { sub } = req.decoded;
        const user = new mongoose_1.default.Types.ObjectId(sub);
        const fileName = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
        const { publicId } = req.body;
        try {
            const data = yield processAvatarChange({
                fileName,
                user,
                publicId,
            });
            res.status(200).json({ success: true, message: 'Avatar changed', data });
            return;
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
};
exports.default = ProfileControllers;
