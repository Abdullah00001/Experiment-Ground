"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.docsUpload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/temp');
    },
    filename: (req, file, cb) => {
        const name = path_1.default.parse(file.originalname).name;
        const ext = path_1.default.extname(file.originalname);
        cb(null, name + '-' + Date.now() + '-' + ext);
    },
});
const imageFileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/webp' ||
        file.mimetype === 'image/svg+xml') {
        cb(null, true);
    }
    else {
        cb(new Error('Only .jpeg and .png and .webp and .svg files are allowed!'), false);
    }
};
exports.docsUpload = (0, multer_1.default)({
    storage: storage,
});
const upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: imageFileFilter,
});
exports.default = upload;
