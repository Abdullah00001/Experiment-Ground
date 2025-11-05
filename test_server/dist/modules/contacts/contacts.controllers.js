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
const logger_configs_1 = __importDefault(require("../../configs/logger.configs"));
const contacts_services_1 = __importDefault(require("../../modules/contacts/contacts.services"));
const mongoose_1 = __importDefault(require("mongoose"));
const calculation_utils_1 = __importDefault(require("../../utils/calculation.utils"));
const { generateEtag } = calculation_utils_1.default;
const { processFindContacts, processFindFavorites, processFindTrash, processCreateContacts, processChangeFavoriteStatus, processFindOneContact, processPatchUpdateOneContact, processPutUpdateOneContact, processChangeTrashStatus, processBulkChangeTrashStatus, processDeleteManyContact, processDeleteSingleContact, processSearchContact, processBulkRecoverTrash, processRecoverOneTrash, processEmptyTrash, processImportContact, processExportContact, processAddLabelToContacts, processFindContactsByLabel, } = contacts_services_1.default;
const ContactsControllers = {
    handleCreateContact: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { sub } = req.decoded;
            const userId = new mongoose_1.default.Types.ObjectId(sub);
            const { avatar, email, firstName, birthday, lastName, phone, worksAt, location, } = req.body;
            const data = yield processCreateContacts({
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
            res.status(201).json({
                success: true,
                message: 'new contact create successful',
                data,
            });
            return;
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
    handleChangeFavoriteStatus: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { sub } = req.decoded;
            const userId = new mongoose_1.default.Types.ObjectId(sub);
            const { id } = req.params;
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                res.status(400).json({ status: 'error', message: 'Invalid Trash ID' });
                return;
            }
            const contactId = new mongoose_1.default.Types.ObjectId(id);
            const { isFavorite } = req.body;
            const data = yield processChangeFavoriteStatus({
                contactId,
                isFavorite,
                userId,
            });
            res.status(200).json({
                success: true,
                message: 'marked contact as favorite',
                data,
            });
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
    handleChangeTrashStatus: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { sub } = req.decoded;
            const userId = new mongoose_1.default.Types.ObjectId(sub);
            const { id } = req.params;
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                res.status(400).json({ status: 'error', message: 'Invalid Trash ID' });
                return;
            }
            const contactId = new mongoose_1.default.Types.ObjectId(id);
            const data = yield processChangeTrashStatus({
                contactId,
                userId,
            });
            res.status(200).json({
                success: true,
                message: 'marked contact as trash',
                data,
            });
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
    handleBulkChangeTrashStatus: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { sub } = req.decoded;
            const userId = new mongoose_1.default.Types.ObjectId(sub);
            const { contactIds } = req.body;
            yield processBulkChangeTrashStatus({ contactIds, userId });
            res.status(200).json({
                success: true,
                message: 'marked contacts as trash',
            });
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
    handleFindOneContacts: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { sub } = req.decoded;
        const userId = new mongoose_1.default.Types.ObjectId(sub);
        const { id } = req.params;
        const oldEtag = req.headers['if-none-match'];
        try {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                res.status(400).json({ status: 'error', message: 'Invalid contactID' });
                return;
            }
            const contactId = new mongoose_1.default.Types.ObjectId(id);
            const data = (yield processFindOneContact({
                contactId,
                userId,
            }));
            if (!data) {
                res.status(404).json({
                    success: false,
                    message: 'contact not found',
                });
                return;
            }
            const eTag = generateEtag(data);
            if (oldEtag !== eTag) {
                res.setHeader('Cache-Control', 'private max-age:30');
                res.setHeader('ETag', eTag);
                res
                    .status(200)
                    .json({ status: 'success', message: 'contact retrieved', data });
                return;
            }
            res.status(304).end();
            return;
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
    handleDeleteOneContact: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { sub } = req.decoded;
            const userId = new mongoose_1.default.Types.ObjectId(sub);
            const { id } = req.params;
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                res.status(400).json({ status: 'error', message: 'Invalid Trash ID' });
                return;
            }
            const contactId = new mongoose_1.default.Types.ObjectId(id);
            const isDeleted = yield processDeleteSingleContact({ contactId, userId });
            if (!isDeleted) {
                res
                    .status(400)
                    .json({ status: 'error', message: 'delete contact failed' });
                return;
            }
            res.status(200).json({ status: 'success', message: 'contact deleted' });
            return;
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
    handleDeleteManyContact: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { sub } = req.decoded;
            const userId = new mongoose_1.default.Types.ObjectId(sub);
            const { contactIds } = req.body;
            const isDeleted = yield processDeleteManyContact({ contactIds, userId });
            if (!isDeleted) {
                res
                    .status(400)
                    .json({ status: 'error', message: 'delete contacts failed' });
                return;
            }
            res.status(200).json({ status: 'success', message: 'contacts deleted' });
            return;
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
    handlePatchUpdateOneContact: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { sub } = req.decoded;
            const userId = new mongoose_1.default.Types.ObjectId(sub);
            const { id } = req.params;
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                res
                    .status(400)
                    .json({ status: 'error', message: 'Invalid Contact ID' });
                return;
            }
            const contactId = new mongoose_1.default.Types.ObjectId(id);
            const { avatar, birthday, email, firstName, lastName, location, phone, worksAt, } = req.body;
            const data = yield processPatchUpdateOneContact({
                contactId,
                avatar,
                birthday,
                email,
                firstName,
                lastName,
                location,
                phone,
                worksAt,
                userId,
            });
            res.status(200).json({
                success: true,
                message: 'contact updated successful',
                data,
            });
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
    handlePutUpdateOneContact: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const avatarImage = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
        try {
            const { sub } = req.decoded;
            const userId = new mongoose_1.default.Types.ObjectId(sub);
            const { id } = req.params;
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                res
                    .status(400)
                    .json({ status: 'error', message: 'Invalid Contact ID' });
                return;
            }
            const contactId = new mongoose_1.default.Types.ObjectId(id);
            const { birthday, email, firstName, lastName, location, phone, worksAt, avatar, } = req.body;
            const data = yield processPutUpdateOneContact({
                avatarUpload: avatarImage,
                avatar: JSON.parse(avatar),
                contactId,
                birthday: JSON.parse(birthday),
                email,
                firstName,
                lastName,
                location: JSON.parse(location),
                phone: JSON.parse(phone),
                worksAt: JSON.parse(worksAt),
                userId,
            });
            res.status(200).json({
                success: true,
                message: 'contact updated successful',
                data,
            });
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
    handleFindContacts: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { sub } = req.decoded;
            const userId = new mongoose_1.default.Types.ObjectId(sub);
            const data = yield processFindContacts({ userId });
            res.setHeader('Cache-Control', 'private max-age:30');
            res.status(200).json({
                success: true,
                message: 'all contacts retrieved successful',
                data,
            });
            return;
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
    handleFindFavorites: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { sub } = req.decoded;
            const userId = new mongoose_1.default.Types.ObjectId(sub);
            const data = yield processFindFavorites({ userId });
            res.setHeader('Cache-Control', 'private max-age:30');
            res.status(200).json({
                success: true,
                message: 'all Favorites retrieved successful',
                data,
            });
            return;
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
    handleFindTrash: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { sub } = req.decoded;
            const userId = new mongoose_1.default.Types.ObjectId(sub);
            const data = yield processFindTrash({ userId });
            res.setHeader('Cache-Control', 'private max-age:30');
            res.status(200).json({
                success: true,
                message: 'all Trash retrieved successful',
                data,
            });
            return;
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
    handleSearchContact: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { query } = req.query;
        const { sub } = req.decoded;
        const userId = new mongoose_1.default.Types.ObjectId(sub);
        try {
            const data = yield processSearchContact({
                query: query,
                userId,
            });
            res.status(200).json({
                success: true,
                message: 'Search Contacts Found',
                data,
            });
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
    handleBulkRecoverTrash: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { sub } = req.decoded;
            const userId = new mongoose_1.default.Types.ObjectId(sub);
            const { contactIds } = req.body;
            yield processBulkRecoverTrash({ contactIds, userId });
            res.status(200).json({
                success: true,
                message: 'Contacts recover successful',
            });
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
    handleRecoverOneTrash: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { sub } = req.decoded;
            const userId = new mongoose_1.default.Types.ObjectId(sub);
            const { id } = req.params;
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                res.status(400).json({ status: 'error', message: 'Invalid Trash ID' });
                return;
            }
            const contactId = new mongoose_1.default.Types.ObjectId(id);
            yield processRecoverOneTrash({
                contactId,
                userId,
            });
            res.status(200).json({
                success: true,
                message: 'Contact recover successful',
            });
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
    handleEmptyTrash: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { sub } = req.decoded;
        const userId = new mongoose_1.default.Types.ObjectId(sub);
        try {
            yield processEmptyTrash({ userId });
            res.status(200).json({
                success: true,
                message: 'Trash emptied',
            });
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
    handleImportContact: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const { sub } = req.decoded;
            const userId = new mongoose_1.default.Types.ObjectId(sub);
            const file = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
            const contacts = yield processImportContact({
                fileName: file,
                userId,
            });
            res.status(200).json({
                success: true,
                message: 'Contact import successful',
                data: contacts,
            });
            return;
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
    handleExportContact: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { sub } = req.decoded;
            const userId = new mongoose_1.default.Types.ObjectId(sub);
            const { contactIds } = req.body;
            const contacts = yield processExportContact({
                contactIds,
                userId,
            });
            res.status(200).json({
                success: true,
                message: 'Contact export successful',
                data: contacts,
            });
            return;
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
    handleExportSingleContact: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { sub } = req.decoded;
            const userId = new mongoose_1.default.Types.ObjectId(sub);
            const { id } = req.params;
            const contactIds = [new mongoose_1.default.Types.ObjectId(id)];
            const contacts = yield processExportContact({
                contactIds,
                userId,
            });
            res.status(200).json({
                success: true,
                message: 'Contact export successful',
                data: contacts,
            });
            return;
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
    handleUpdateLabel: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { sub } = req.decoded;
            const { labelUpdateTree } = req.body;
            yield processAddLabelToContacts({ labelUpdateTree, userId: sub });
            res.status(200).json({ success: true, message: 'contact label updated' });
            return;
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
    handleFindContactsByLabel: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { sub } = req.decoded;
            const { id } = req.params;
            const data = yield processFindContactsByLabel({
                labelId: new mongoose_1.default.Types.ObjectId(id),
                userId: new mongoose_1.default.Types.ObjectId(sub),
            });
            res
                .status(200)
                .json({ success: true, message: 'contacts retried', data });
            return;
        }
        catch (error) {
            const err = error;
            logger_configs_1.default.error(err.message);
            next(error);
        }
    }),
};
exports.default = ContactsControllers;
