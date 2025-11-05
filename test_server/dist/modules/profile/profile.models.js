"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const LocationSchema = new mongoose_1.Schema({
    home: { type: String, default: null },
    work: { type: String, default: null },
}, { _id: false });
const ProfileSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        unique: true,
        ref: 'User',
        required: true,
    },
    bio: { type: String, default: null },
    dateOfBirth: { type: String, default: null },
    location: LocationSchema,
    gender: { type: String, default: null },
}, { timestamps: true });
const Profile = (0, mongoose_1.model)('Profile', ProfileSchema);
exports.default = Profile;
