"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_routes_1 = __importDefault(require("../../routes/v1/user.routes"));
const contacts_routes_1 = __importDefault(require("../../routes/v1/contacts.routes"));
const profile_routes_1 = __importDefault(require("../../routes/v1/profile.routes"));
const feedback_routes_1 = __importDefault(require("../../routes/v1/feedback.routes"));
const image_routes_1 = __importDefault(require("../../routes/v1/image.routes"));
const label_routes_1 = __importDefault(require("../../routes/v1/label.routes"));
const routes = [
    user_routes_1.default,
    contacts_routes_1.default,
    profile_routes_1.default,
    feedback_routes_1.default,
    image_routes_1.default,
    label_routes_1.default,
];
const v1Routes = (0, express_1.Router)();
routes.forEach((route) => v1Routes.use(route));
exports.default = v1Routes;
