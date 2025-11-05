"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthErrorType = exports.DeviceType = exports.AccountStatus = exports.ActivityType = exports.AuthType = void 0;
var AuthType;
(function (AuthType) {
    AuthType["LOCAL"] = "local";
    AuthType["GOOGLE"] = "google";
})(AuthType || (exports.AuthType = AuthType = {}));
var ActivityType;
(function (ActivityType) {
    ActivityType["LOGIN_FAILED"] = "LOGIN_FAILED";
    ActivityType["LOGIN_SUCCESS"] = "LOGIN_SUCCESS";
    ActivityType["SIGNUP_SUCCESS"] = "SIGNUP_SUCCESS";
    ActivityType["PASSWORD_RESET"] = "PASSWORD_RESET";
    ActivityType["ACCOUNT_LOCKED"] = "ACCOUNT_LOCKED";
    ActivityType["ACCOUNT_ACTIVE"] = "ACCOUNT_ACTIVE";
    ActivityType["ACCOUNT_DELETE_SCHEDULE"] = "DELETION_SCHEDULED";
    ActivityType["ACCOUNT_DELETE_SCHEDULE_CANCEL"] = "DELETION_CANCELED";
})(ActivityType || (exports.ActivityType = ActivityType = {}));
var AccountStatus;
(function (AccountStatus) {
    AccountStatus["ACTIVE"] = "active";
    AccountStatus["ON_RISK"] = "on_risk";
    AccountStatus["LOCKED"] = "locked";
    AccountStatus["DELETION_PENDING"] = "deletion_pending";
    AccountStatus["PENDING"] = "pending";
})(AccountStatus || (exports.AccountStatus = AccountStatus = {}));
var DeviceType;
(function (DeviceType) {
    DeviceType["MOBILE"] = "mobile";
    DeviceType["TABLET"] = "tablet";
    DeviceType["DESKTOP"] = "desktop";
})(DeviceType || (exports.DeviceType = DeviceType = {}));
var AuthErrorType;
(function (AuthErrorType) {
    AuthErrorType["SESSION_EXPIRED"] = "SESSION_EXPIRED";
    AuthErrorType["SESSION_BLACKLISTED"] = "SESSION_BLACKLISTED";
    AuthErrorType["TOKEN_EXPIRED"] = "TOKEN_EXPIRED";
    AuthErrorType["TOKEN_INVALID"] = "TOKEN_INVALID";
    AuthErrorType["TOKEN_BLACKLISTED"] = "TOKEN_BLACKLISTED";
})(AuthErrorType || (exports.AuthErrorType = AuthErrorType = {}));
