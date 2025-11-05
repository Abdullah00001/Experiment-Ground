"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const FeedBackSchema = new mongoose_1.Schema({
    userEmail: { type: String, required: true },
    message: { type: String, required: true },
}, { timestamps: true });
const Feedback = (0, mongoose_1.model)('Feedback', FeedBackSchema);
exports.default = Feedback;
