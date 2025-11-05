"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_middlewares_1 = __importDefault(require("../../modules/user/user.middlewares"));
const multer_middleware_1 = __importDefault(require("../../middlewares/multer.middleware"));
const image_controllers_1 = __importDefault(require("../../modules/image/image.controllers"));
const { checkAccessToken, checkSession } = user_middlewares_1.default;
const { handleImageUpload, handleImageDelete } = image_controllers_1.default;
const router = (0, express_1.Router)();
router
    .route('/image')
    .post(checkAccessToken, checkSession, multer_middleware_1.default.single('image'), handleImageUpload);
router
    .route('/image/:folder/:public_id')
    .delete(checkAccessToken, checkSession, handleImageDelete);
exports.default = router;
