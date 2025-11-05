"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const contacts_models_1 = __importDefault(require("../../modules/contacts/contacts.models"));
const label_models_1 = __importDefault(require("../../modules/label/label.models"));
const user_models_1 = __importDefault(require("../../modules/user/user.models"));
const mongoose_1 = __importStar(require("mongoose"));
const ContactsRepositories = {
    createContact: (_a) => __awaiter(void 0, [_a], void 0, function* ({ avatar, birthday, email, firstName, lastName, location, phone, worksAt, userId, }) {
        try {
            const user = yield user_models_1.default.findOne({ email: email });
            const payload = {
                avatar,
                birthday,
                email,
                firstName,
                lastName,
                location,
                phone,
                worksAt,
                userId,
                linkedUserId: user && user._id,
            };
            const newContact = new contacts_models_1.default(payload);
            yield newContact.save();
            return newContact;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Create Contacts Query');
            }
        }
    }),
    updateOneContact: (_a) => __awaiter(void 0, [_a], void 0, function* ({ contactId, avatar, birthday, email, firstName, lastName, location, phone, worksAt, }) {
        try {
            const payload = {
                avatar,
                birthday,
                email,
                firstName,
                lastName,
                location,
                phone,
                worksAt,
            };
            const data = yield contacts_models_1.default.findByIdAndUpdate(contactId, payload, {
                new: true,
            });
            return data;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Update One Contacts Query');
            }
        }
    }),
    findOneContact: (_a) => __awaiter(void 0, [_a], void 0, function* ({ contactId }) {
        try {
            return yield contacts_models_1.default.findById(contactId);
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Find One Contacts Query');
            }
        }
    }),
    changeFavoriteStatus: (_a) => __awaiter(void 0, [_a], void 0, function* ({ contactId, isFavorite, }) {
        try {
            return yield contacts_models_1.default.findByIdAndUpdate(contactId, { $set: { isFavorite } }, { new: true });
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Change Contacts Favorite Status Query');
            }
        }
    }),
    changeTrashStatus: (_a) => __awaiter(void 0, [_a], void 0, function* ({ contactId }) {
        try {
            return yield contacts_models_1.default.findByIdAndUpdate(contactId, { $set: { isTrashed: true, isFavorite: false, trashedAt: Date.now() } }, { new: true });
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Change Contacts Trash Status Query');
            }
        }
    }),
    bulkChangeTrashStatus: (_a) => __awaiter(void 0, [_a], void 0, function* ({ contactIds, }) {
        try {
            yield contacts_models_1.default.updateMany({ _id: { $in: contactIds } }, { $set: { isTrashed: true, isFavorite: false, trashedAt: Date.now() } });
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Bulk Change Contacts Trash Status Query');
            }
        }
    }),
    deleteSingleContact: (_a) => __awaiter(void 0, [_a], void 0, function* ({ contactId }) {
        try {
            return yield contacts_models_1.default.findByIdAndDelete(contactId);
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Delete Single Contacts Query');
            }
        }
    }),
    deleteManyContact: (_a) => __awaiter(void 0, [_a], void 0, function* ({ contactIds }) {
        const session = yield mongoose_1.default.startSession();
        session.startTransaction();
        try {
            const deletedContacts = yield contacts_models_1.default.find({ _id: { $in: contactIds } }, { avatar: 1 }).session(session);
            const result = yield contacts_models_1.default.deleteMany({
                _id: { $in: contactIds },
            }).session(session);
            yield session.commitTransaction();
            session.endSession();
            return { deletedContacts, deletedContactCount: result.deletedCount };
        }
        catch (error) {
            yield session.abortTransaction();
            session.endSession();
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Delete Many Contacts Query');
            }
        }
    }),
    findContacts: (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId }) {
        try {
            const objectUserId = new mongoose_1.default.Types.ObjectId(userId);
            return yield contacts_models_1.default.aggregate([
                { $match: { userId: objectUserId, isTrashed: false } },
                {
                    $project: {
                        _id: 1,
                        avatar: 1,
                        firstName: 1,
                        lastName: 1,
                        isTrashed: 1,
                        isFavorite: 1,
                        email: 1,
                        phone: 1,
                        location: 1,
                        worksAt: 1,
                        labels: 1,
                    },
                },
                {
                    $addFields: {
                        sortKey: {
                            $toLower: {
                                $ifNull: ['$firstName', '$lastName'],
                            },
                        },
                    },
                },
                { $sort: { sortKey: 1 } },
            ]);
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Find Contacts Query');
            }
        }
    }),
    findFavorites: (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId }) {
        const objectUserId = new mongoose_1.default.Types.ObjectId(userId);
        try {
            return yield contacts_models_1.default.aggregate([
                {
                    $match: { userId: objectUserId, isTrashed: false, isFavorite: true },
                },
                {
                    $project: {
                        _id: 1,
                        avatar: 1,
                        firstName: 1,
                        lastName: 1,
                        isTrashed: 1,
                        isFavorite: 1,
                        email: 1,
                        phone: 1,
                        location: 1,
                        worksAt: 1,
                        labels: 1,
                    },
                },
                {
                    $addFields: {
                        sortKey: {
                            $toLower: {
                                $ifNull: ['$firstName', '$lastName'],
                            },
                        },
                    },
                },
                { $sort: { sortKey: 1 } },
            ]);
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Find Find Favorites Query');
            }
        }
    }),
    findTrash: (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId }) {
        const objectUserId = new mongoose_1.default.Types.ObjectId(userId);
        try {
            return yield contacts_models_1.default.aggregate([
                {
                    $match: { userId: objectUserId, isTrashed: true },
                },
                {
                    $sort: {
                        trashedAt: -1,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        avatar: 1,
                        firstName: 1,
                        lastName: 1,
                        isTrashed: 1,
                        trashedAt: 1,
                    },
                },
            ]);
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Find Find Trash Query');
            }
        }
    }),
    searchContact: (_a) => __awaiter(void 0, [_a], void 0, function* ({ query, userId }) {
        const objectUserId = new mongoose_1.default.Types.ObjectId(userId);
        const escapeRegex = (str) => {
            return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        };
        // Detect query type
        const detectQueryType = (q) => {
            if (q.includes('@'))
                return 'email';
            if (/^[\d\+\-\s()]+$/.test(q))
                return 'phone';
            return 'name';
        };
        const queryType = detectQueryType(query);
        const escapedQuery = escapeRegex(query);
        // Split query into words and create regex for each
        const words = query.trim().split(/\s+/);
        const regexArray = words.map((word) => new RegExp(escapeRegex(word), 'i'));
        try {
            const orConditions = [];
            // Build conditions based on query type
            if (queryType === 'email') {
                orConditions.push({ email: new RegExp(`^${escapedQuery}$`, 'i') });
            }
            else if (queryType === 'phone') {
                orConditions.push({ 'phone.number': new RegExp(escapedQuery, 'i') }, { 'phone.number': new RegExp(query.replace(/\D/g, ''), 'i') });
            }
            else {
                // Name search
                const words = query.trim().split(/\s+/);
                // Match individual name fields
                orConditions.push({ firstName: new RegExp(escapedQuery, 'i') }, { lastName: new RegExp(escapedQuery, 'i') });
                // For multi-word queries, add full name matching
                if (words.length > 1) {
                    const nameConditions = words.map((word) => ({
                        fullName: new RegExp(escapeRegex(word), 'i'),
                    }));
                    orConditions.push({ $and: nameConditions });
                }
            }
            return yield contacts_models_1.default.aggregate([
                {
                    $match: {
                        userId: objectUserId,
                        isTrashed: false,
                    },
                },
                {
                    $addFields: {
                        fullName: {
                            $concat: [
                                { $ifNull: ['$firstName', ''] },
                                ' ',
                                { $ifNull: ['$lastName', ''] },
                            ],
                        },
                    },
                },
                {
                    $match: {
                        $or: orConditions,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        avatar: 1,
                        firstName: 1,
                        lastName: 1,
                        email: 1,
                    },
                },
            ]);
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Find Find Trash Query');
            }
        }
    }),
    bulkRecoverTrash: (_a) => __awaiter(void 0, [_a], void 0, function* ({ contactIds }) {
        try {
            yield contacts_models_1.default.updateMany({ _id: { $in: contactIds } }, { $set: { isTrashed: false, trashedAt: null } });
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Bulk Recover Trash Contacts Status Query');
            }
        }
    }),
    recoverOneTrash: (_a) => __awaiter(void 0, [_a], void 0, function* ({ contactId }) {
        try {
            yield contacts_models_1.default.findByIdAndUpdate(contactId, { $set: { isTrashed: false, trashedAt: null } }, { new: true });
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Single Recover Trash Query');
            }
        }
    }),
    emptyTrash: (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId }) {
        const session = yield mongoose_1.default.startSession();
        session.startTransaction();
        try {
            const contacts = yield contacts_models_1.default.find({ userId, isTrashed: true }).session(session);
            const deleteResponse = yield contacts_models_1.default.deleteMany({
                userId,
                isTrashed: true,
            }).session(session);
            yield session.commitTransaction();
            session.endSession();
            return { contacts, deletedCount: deleteResponse.deletedCount };
        }
        catch (error) {
            yield session.abortTransaction();
            session.endSession();
            if (error instanceof Error)
                throw error;
            throw new Error('Unknown Error Occurred In Empty Trash Query');
        }
    }),
    bulkInsertContacts: (_a) => __awaiter(void 0, [_a], void 0, function* ({ contacts }) {
        try {
            const writContact = yield contacts_models_1.default.insertMany(contacts);
            return writContact;
        }
        catch (error) {
            if (error instanceof Error)
                throw error;
            throw new Error('Unknown Error Occurred In Bulk Insert Contact Query');
        }
    }),
    exportContact: (_a) => __awaiter(void 0, [_a], void 0, function* ({ contactIds, userId }) {
        try {
            const contacts = yield contacts_models_1.default.find({
                userId,
                _id: { $in: contactIds },
            }, {
                firstName: 1,
                lastName: 1,
                location: 1,
                phone: 1,
                email: 1,
                birthday: 1,
                worksAt: 1,
                _id: 0,
            }).lean();
            return contacts;
        }
        catch (error) {
            if (error instanceof Error)
                throw error;
            throw new Error('Unknown Error Occurred In Bulk Insert Contact Query');
        }
    }),
    addLabelToContacts: (_a) => __awaiter(void 0, [_a], void 0, function* ({ labelUpdateTree, userId }) {
        try {
            const bulkOps = labelUpdateTree.map(({ contactId, labelIds }) => ({
                updateOne: {
                    filter: { _id: contactId, userId },
                    update: { $set: { labels: labelIds } },
                },
            }));
            yield contacts_models_1.default.bulkWrite(bulkOps);
            return;
        }
        catch (error) {
            if (error instanceof Error)
                throw error;
            throw new Error('Unknown Error Occurred In Bulk Add Label To Contact Query');
        }
    }),
    findContactsByLabel: (_a) => __awaiter(void 0, [_a], void 0, function* ({ labelId, userId, }) {
        try {
            const result = yield label_models_1.default.aggregate([
                { $match: { _id: new mongoose_1.Types.ObjectId(labelId), createdBy: userId } }, // match label created by user
                {
                    $lookup: {
                        from: 'contacts', // MongoDB collection name
                        let: { labelId: '$_id', creatorId: '$createdBy' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $in: ['$$labelId', '$labels'] }, // contact has this label
                                            { $eq: ['$userId', '$$creatorId'] }, // contact belongs to same user
                                            { $eq: ['$isTrashed', false] }, // only non-trashed contacts
                                        ],
                                    },
                                },
                            },
                        ],
                        as: 'labelContacts',
                    },
                },
                {
                    $set: {
                        labelContacts: {
                            $sortArray: {
                                input: '$labelContacts',
                                sortBy: {
                                    firstName: 1,
                                    lastName: 1,
                                },
                            },
                        },
                    },
                },
                {
                    $project: {
                        _id: 1,
                        labelName: 1, // label name
                        labelContacts: 1, // contacts array
                    },
                },
            ]);
            return (result[0] || { _id: labelId, name: '', color: '', labelContacts: [] });
        }
        catch (error) {
            if (error instanceof Error)
                throw error;
            throw new Error('Unknown Error Occurred In Bulk Add Label To Contact Query');
        }
    }),
};
exports.default = ContactsRepositories;
