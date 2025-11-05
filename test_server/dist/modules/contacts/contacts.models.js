"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvatarSchema = void 0;
const mongoose_1 = require("mongoose");
const BirthDaySchema = new mongoose_1.Schema({
    day: { type: Number, default: null },
    month: { type: String, default: null },
    year: { type: Number, default: null },
}, { _id: false });
exports.AvatarSchema = new mongoose_1.Schema({
    url: { type: String, default: null },
    publicId: { type: String, default: null },
}, { _id: false });
const WorksAtSchema = new mongoose_1.Schema({
    companyName: { type: String, default: null },
    jobTitle: { type: String, default: null },
}, { _id: false });
const PhoneSchema = new mongoose_1.Schema({
    countryCode: { type: String, default: null, index: true },
    number: { type: String, default: null, index: true },
}, { _id: false });
const LocationSchema = new mongoose_1.Schema({
    city: { type: String, default: null },
    country: { type: String, default: null },
    streetAddress: { type: String, default: null },
    postCode: { type: Number, default: null },
}, { _id: false });
const ContactsSchema = new mongoose_1.Schema({
    avatar: { type: exports.AvatarSchema, default: () => ({}) },
    birthday: { type: BirthDaySchema, default: () => ({}) },
    email: { type: String, default: null, index: true },
    firstName: { type: String, default: null, index: true },
    lastName: { type: String, default: null, index: true },
    phone: { type: PhoneSchema, default: () => ({}) },
    isTrashed: { type: Boolean, default: false, index: true },
    isFavorite: { type: Boolean, default: false },
    trashedAt: { type: Date, default: null, index: true },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        default: null,
        index: true,
        required: true,
    },
    location: { type: LocationSchema, default: () => ({}) },
    worksAt: { type: WorksAtSchema, default: () => ({}) },
    linkedUserId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
    labels: {
        type: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Label' }],
        default: [],
        index: true,
    },
}, { timestamps: true });
const Contacts = (0, mongoose_1.model)('Contacts', ContactsSchema);
exports.default = Contacts;
