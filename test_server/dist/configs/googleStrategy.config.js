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
const cloudinary_configs_1 = __importDefault(require("../configs/cloudinary.configs"));
const env_1 = require("../env");
const user_enums_1 = require("../modules/user/user.enums");
const user_repositories_1 = __importDefault(require("../modules/user/user.repositories"));
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const { CALLBACK_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = env_1.env;
const { uploadAvatar } = cloudinary_configs_1.default;
const { findUserByEmail, createNewUser } = user_repositories_1.default;
/**
 * @strategy GoogleStrategy
 * @description Handles Google login using passport-google-oauth20.
 * - Receives Google profile info after user consents.
 * - Finds existing user by email in DB.
 * - If not found → creates new user with Google profile data.
 * - Calls `done(null, user)` which attaches the user to req.user.
 */
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: CALLBACK_URL,
    passReqToCallback: true,
}, (_request, _accessToken, _refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const email = (_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value;
    const user = yield findUserByEmail(email);
    if (!user) {
        const googleId = profile.id;
        const avatar = yield uploadAvatar(((_d = (_c = profile.photos) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value) || null);
        const name = profile.displayName;
        const newUser = {
            avatar: avatar,
            email,
            password: { secret: null, change_at: null },
            name,
            isVerified: true,
            provider: user_enums_1.AuthType.GOOGLE,
            googleId,
            accountStatus: {
                accountStatus: user_enums_1.AccountStatus.ACTIVE,
                lockedAt: null,
            },
        };
        const createdUser = yield createNewUser(newUser);
        return done(null, {
            user: createdUser,
            activity: user_enums_1.ActivityType.SIGNUP_SUCCESS,
            provider: user_enums_1.AuthType.GOOGLE,
        }); // attaches to req.user
    }
    return done(null, {
        user,
        activity: user_enums_1.ActivityType.LOGIN_SUCCESS,
        provider: user_enums_1.AuthType.GOOGLE,
    }); // attaches to req.user
})));
