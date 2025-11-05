"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profile_controllers_1 = __importDefault(require("../../modules/profile/profile.controllers"));
const user_middlewares_1 = __importDefault(require("../../modules/user/user.middlewares"));
const multer_middleware_1 = __importDefault(require("../../middlewares/multer.middleware"));
const profile_middlewares_1 = __importDefault(require("../../modules/profile/profile.middlewares"));
const { checkAccessToken, checkSession } = user_middlewares_1.default;
const { profilePictureChangeInputValidation, checkCurrentPassword } = profile_middlewares_1.default;
const { handleGetProfile, handleUpdateProfile, handleChangePassword, handleDeleteAccount, handleAvatarUpload, handleAvatarRemove, handleAvatarChange, } = profile_controllers_1.default;
const router = (0, express_1.Router)();
router
    .route('/me')
    .get(checkAccessToken, checkSession, handleGetProfile)
    .patch(checkAccessToken, checkSession, handleUpdateProfile)
    .post(checkAccessToken, checkSession, checkCurrentPassword, handleChangePassword)
    .delete(checkAccessToken, checkSession, handleDeleteAccount);
router
    .route('/me/avatar')
    .put(checkAccessToken, checkSession, multer_middleware_1.default.single('avatar'), handleAvatarUpload)
    .patch(checkAccessToken, checkSession, multer_middleware_1.default.single('avatar'), profilePictureChangeInputValidation, handleAvatarChange);
router
    .route('/me/avatar/:folder/:public_id')
    .delete(checkAccessToken, checkSession, handleAvatarRemove);
exports.default = router;
