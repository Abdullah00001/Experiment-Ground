"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const label_controllers_1 = __importDefault(require("../../modules/label/label.controllers"));
const user_middlewares_1 = __importDefault(require("../../modules/user/user.middlewares"));
const express_1 = require("express");
const { handleCreateLabel, handleUpdateLabel, handleDeleteLabel, handleRetrieveLabels, handleRetrieveSingleLabel, } = label_controllers_1.default;
const { checkAccessToken, checkSession } = user_middlewares_1.default;
const router = (0, express_1.Router)();
router
    .route('/label')
    .post(checkAccessToken, checkSession, handleCreateLabel)
    .get(checkAccessToken, checkSession, handleRetrieveLabels);
router
    .route('/label/:id')
    .get(checkAccessToken, checkSession, handleRetrieveSingleLabel)
    .patch(checkAccessToken, checkSession, handleUpdateLabel)
    .delete(checkAccessToken, checkSession, handleDeleteLabel);
exports.default = router;
