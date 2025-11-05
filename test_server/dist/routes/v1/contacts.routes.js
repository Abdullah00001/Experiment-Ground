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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_middleware_1 = __importStar(require("../../middlewares/multer.middleware"));
const contacts_controllers_1 = __importDefault(require("../../modules/contacts/contacts.controllers"));
const contacts_middlewares_1 = __importDefault(require("../../modules/contacts/contacts.middlewares"));
const user_middlewares_1 = __importDefault(require("../../modules/user/user.middlewares"));
const express_1 = require("express");
const { checkAccessToken, checkSession } = user_middlewares_1.default;
const { checkImportFile, checkImportFileContents } = contacts_middlewares_1.default;
const { handleFindContacts, handleFindFavorites, handleFindTrash, handleCreateContact, handleChangeFavoriteStatus, handleFindOneContacts, handlePatchUpdateOneContact, handlePutUpdateOneContact, handleChangeTrashStatus, handleBulkChangeTrashStatus, handleDeleteManyContact, handleDeleteOneContact, handleSearchContact, handleBulkRecoverTrash, handleRecoverOneTrash, handleEmptyTrash, handleImportContact, handleExportContact, handleExportSingleContact, handleUpdateLabel, handleFindContactsByLabel, } = contacts_controllers_1.default;
const router = (0, express_1.Router)();
router
    .route('/contacts/label')
    .patch(checkAccessToken, checkSession, handleUpdateLabel);
router
    .route('/contacts/recover')
    .patch(checkAccessToken, checkSession, handleBulkRecoverTrash);
router
    .route('/contacts/recover/:id')
    .patch(checkAccessToken, checkSession, handleRecoverOneTrash);
router
    .route('/contacts/empty')
    .delete(checkAccessToken, checkSession, handleEmptyTrash);
router
    .route('/contacts')
    .get(checkAccessToken, checkSession, handleFindContacts)
    .post(checkAccessToken, checkSession, handleCreateContact);
router
    .route('/search')
    .get(checkAccessToken, checkSession, handleSearchContact);
router
    .route('/contacts/:id')
    .get(checkAccessToken, checkSession, handleFindOneContacts)
    .put(checkAccessToken, checkSession, multer_middleware_1.default.single('avatarImage'), handlePutUpdateOneContact)
    .patch(checkAccessToken, checkSession, handlePatchUpdateOneContact);
router
    .route('/favorites')
    .get(checkAccessToken, checkSession, handleFindFavorites);
router
    .route('/favorites/:id')
    .patch(checkAccessToken, checkSession, handleChangeFavoriteStatus);
// get all trash item and add many in trash endpoint
router
    .route('/trash')
    .get(checkAccessToken, checkSession, handleFindTrash)
    .patch(checkAccessToken, checkSession, handleBulkChangeTrashStatus);
// single trash add endpoint
router
    .route('/trash/:id')
    .patch(checkAccessToken, checkSession, handleChangeTrashStatus);
router
    .route('/contacts/delete')
    .delete(checkAccessToken, checkSession, handleDeleteManyContact);
router
    .route('/contacts/delete/:id')
    .delete(checkAccessToken, checkSession, handleDeleteOneContact);
router
    .route('/contacts/import')
    .post(checkAccessToken, checkSession, multer_middleware_1.docsUpload.single('docsFile'), checkImportFile, checkImportFileContents, handleImportContact);
router
    .route('/contacts/export')
    .post(checkAccessToken, checkSession, handleExportContact);
router
    .route('/contacts/export/:id')
    .get(checkAccessToken, checkSession, handleExportSingleContact);
router
    .route('/contacts/label/:id')
    .get(checkAccessToken, checkSession, handleFindContactsByLabel);
exports.default = router;
