"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const feedback_controllers_1 = __importDefault(require("../../modules/feedback/feedback.controllers"));
const user_middlewares_1 = __importDefault(require("../../modules/user/user.middlewares"));
const express_1 = require("express");
const { checkAccessToken, checkSession } = user_middlewares_1.default;
const { handleCreateFeedBack } = feedback_controllers_1.default;
const router = (0, express_1.Router)();
router
    .route('/feedback')
    .post(checkAccessToken, checkSession, handleCreateFeedBack);
exports.default = router;
