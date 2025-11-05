"use strict";
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
const contacts_repositories_1 = __importDefault(require("../../modules/contacts/contacts.repositories"));
const path_1 = require("path");
const cloudinary_configs_1 = __importDefault(require("../../configs/cloudinary.configs"));
const promises_1 = __importDefault(require("fs/promises"));
const import_utils_1 = require("../../utils/import.utils");
const mongoose_1 = __importDefault(require("mongoose"));
const { upload, destroy } = cloudinary_configs_1.default;
const { findContacts, findFavorites, findTrash, createContact, changeFavoriteStatus, findOneContact, updateOneContact, changeTrashStatus, bulkChangeTrashStatus, deleteManyContact, deleteSingleContact, searchContact, bulkRecoverTrash, recoverOneTrash, emptyTrash, bulkInsertContacts, exportContact, addLabelToContacts, findContactsByLabel, } = contacts_repositories_1.default;
const ContactsServices = {
    processCreateContacts: (_a) => __awaiter(void 0, [_a], void 0, function* ({ avatar, email, firstName, birthday, lastName, phone, worksAt, location, userId, }) {
        try {
            const data = yield createContact({
                avatar,
                email,
                firstName,
                birthday,
                lastName,
                phone,
                worksAt,
                location,
                userId,
            });
            return data;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Process Create Contacts');
            }
        }
    }),
    processFindOneContact: (_a) => __awaiter(void 0, [_a], void 0, function* ({ contactId, userId, }) {
        try {
            const data = yield findOneContact({ contactId });
            return data;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Process Find One Contacts');
            }
        }
    }),
    processPatchUpdateOneContact: (_a) => __awaiter(void 0, [_a], void 0, function* ({ contactId, avatar, birthday, email, firstName, lastName, location, phone, worksAt, userId, }) {
        try {
            const updatedAvatar = avatar;
            if ((avatar === null || avatar === void 0 ? void 0 : avatar.url) === null && (avatar === null || avatar === void 0 ? void 0 : avatar.publicId)) {
                yield destroy(avatar === null || avatar === void 0 ? void 0 : avatar.publicId);
                updatedAvatar.publicId = null;
            }
            const data = yield updateOneContact({
                contactId,
                avatar: updatedAvatar,
                birthday,
                email,
                firstName,
                lastName,
                location,
                phone,
                worksAt,
            });
            return data;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Process Update One Contacts');
            }
        }
    }),
    processPutUpdateOneContact: (_a) => __awaiter(void 0, [_a], void 0, function* ({ contactId, avatar, avatarUpload, birthday, email, firstName, lastName, location, phone, worksAt, userId, }) {
        const filePath = (0, path_1.join)(__dirname, '../../../public/temp', avatarUpload);
        try {
            if (avatar === null || avatar === void 0 ? void 0 : avatar.publicId) {
                yield destroy(avatar === null || avatar === void 0 ? void 0 : avatar.publicId);
            }
            const uploadedImage = yield upload(filePath);
            if (!uploadedImage)
                throw new Error('Cloudinary Image Upload Failed');
            const data = yield updateOneContact({
                contactId,
                avatar: uploadedImage,
                birthday,
                email,
                firstName,
                lastName,
                location,
                phone,
                worksAt,
            });
            return data;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Process Update One Contacts');
            }
        }
    }),
    processChangeFavoriteStatus: (_a) => __awaiter(void 0, [_a], void 0, function* ({ contactId, isFavorite, userId, }) {
        try {
            const data = yield changeFavoriteStatus({ contactId, isFavorite });
            return data;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Process Change Contacts Favorite Status');
            }
        }
    }),
    processChangeTrashStatus: (_a) => __awaiter(void 0, [_a], void 0, function* ({ contactId, userId, }) {
        try {
            const data = yield changeTrashStatus({ contactId });
            return data;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Process Change Contacts Trash Status');
            }
        }
    }),
    processBulkChangeTrashStatus: (_a) => __awaiter(void 0, [_a], void 0, function* ({ contactIds, userId, }) {
        try {
            yield bulkChangeTrashStatus({ contactIds });
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Process Bulk Change Contacts Trash Status');
            }
        }
    }),
    processDeleteSingleContact: (_a) => __awaiter(void 0, [_a], void 0, function* ({ contactId, userId, }) {
        try {
            const isDeleted = yield deleteSingleContact({ contactId });
            if (!isDeleted)
                return null;
            yield destroy(isDeleted.avatar.publicId);
            return isDeleted;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Process Delete Single Contacts');
            }
        }
    }),
    processDeleteManyContact: (_a) => __awaiter(void 0, [_a], void 0, function* ({ contactIds, userId, }) {
        try {
            const { deletedContactCount, deletedContacts } = yield deleteManyContact({
                contactIds,
            });
            const avatarPublicIds = deletedContacts.map((item) => { var _a; return (_a = item === null || item === void 0 ? void 0 : item.avatar) === null || _a === void 0 ? void 0 : _a.publicId; });
            yield Promise.all(avatarPublicIds.map((item) => destroy(item)));
            return { deletedContactCount, deletedContacts };
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Process Delete Many Contacts');
            }
        }
    }),
    processEmptyTrash: (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId }) {
        try {
            const { contacts, deletedCount } = yield emptyTrash({ userId });
            if (!deletedCount && contacts.length === 0)
                throw new Error('Empty Trash Operation Failed');
            const avatarPublicIds = contacts.map((item) => { var _a; return (_a = item === null || item === void 0 ? void 0 : item.avatar) === null || _a === void 0 ? void 0 : _a.publicId; });
            yield Promise.all(avatarPublicIds.map((item) => destroy(item)));
        }
        catch (error) {
            if (error instanceof Error)
                throw error;
            throw new Error('Unknown Error Occurred In Empty Trash Service');
        }
    }),
    processFindContacts: (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId }) {
        try {
            const data = yield findContacts({ userId });
            return data;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Process Find Contacts');
            }
        }
    }),
    processFindFavorites: (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId }) {
        try {
            const data = yield findFavorites({ userId });
            return data;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Process Find Favorites');
            }
        }
    }),
    processFindTrash: (_a) => __awaiter(void 0, [_a], void 0, function* ({ userId }) {
        try {
            const data = yield findTrash({ userId });
            return data;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Process Find Trash');
            }
        }
    }),
    processSearchContact: (_a) => __awaiter(void 0, [_a], void 0, function* ({ query, userId }) {
        try {
            return yield searchContact({ query, userId });
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Process Search Contact');
            }
        }
    }),
    processBulkRecoverTrash: (_a) => __awaiter(void 0, [_a], void 0, function* ({ contactIds, userId, }) {
        try {
            yield bulkRecoverTrash({ contactIds });
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Process Bulk Recover Trash');
            }
        }
    }),
    processRecoverOneTrash: (_a) => __awaiter(void 0, [_a], void 0, function* ({ contactId, userId, }) {
        try {
            yield recoverOneTrash({ contactId });
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Process Recover One Trash');
            }
        }
    }),
    processImportContact: (_a) => __awaiter(void 0, [_a], void 0, function* ({ fileName, userId }) {
        const filePath = (0, path_1.join)(__dirname, '../../../public/temp', fileName);
        const fileExtension = (0, import_utils_1.getFileExtension)(fileName);
        try {
            const fileBuffer = yield promises_1.default.readFile(filePath);
            const fileContent = fileBuffer.toString();
            let extractedContacts = [];
            if (fileExtension === 'csv') {
                extractedContacts = (0, import_utils_1.ExtractContactsFromCsv)({ fileContent, userId });
            }
            if (fileExtension === 'vcf') {
                extractedContacts = (0, import_utils_1.ExportContactFromVCard)({ fileContent, userId });
            }
            const savedContacts = yield bulkInsertContacts({
                contacts: extractedContacts,
            });
            yield promises_1.default.unlink(filePath);
            return savedContacts;
        }
        catch (error) {
            yield promises_1.default.unlink(filePath);
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Process Import Service');
            }
        }
    }),
    processExportContact: (_a) => __awaiter(void 0, [_a], void 0, function* ({ contactIds, userId, }) {
        try {
            const contactObjectIds = contactIds.map((id) => new mongoose_1.default.Types.ObjectId(id));
            const contacts = yield exportContact({
                contactIds: contactObjectIds,
                userId,
            });
            return contacts;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Process Import Service');
            }
        }
    }),
    processAddLabelToContacts: (_a) => __awaiter(void 0, [_a], void 0, function* ({ labelUpdateTree, userId, }) {
        try {
            const typedPayload = labelUpdateTree.map(({ contactId, labelIds }) => ({
                contactId: new mongoose_1.default.Types.ObjectId(contactId),
                labelIds: labelIds.map((item) => new mongoose_1.default.Types.ObjectId(item)),
            }));
            const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
            yield addLabelToContacts({
                labelUpdateTree: typedPayload,
                userId: userObjectId,
            });
            return;
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Process Add Label To Contacts Service');
            }
        }
    }),
    processFindContactsByLabel: (_a) => __awaiter(void 0, [_a], void 0, function* ({ labelId, userId, }) {
        try {
            return yield findContactsByLabel({
                labelId,
                userId,
            });
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            else {
                throw new Error('Unknown Error Occurred In Process Find Contacts By Label Service');
            }
        }
    }),
};
exports.default = ContactsServices;
