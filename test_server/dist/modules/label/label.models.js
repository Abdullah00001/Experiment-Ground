"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const LabelSchema = new mongoose_1.Schema({
    labelName: { type: String, required: true, trim: true },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
const Label = (0, mongoose_1.model)('Label', LabelSchema);
exports.default = Label;
