"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const const_1 = require("../../const");
const fs_1 = require("fs");
const logger_configs_1 = __importDefault(require("../../configs/logger.configs"));
const sync_1 = __importDefault(require("csv-parse/sync"));
const import_utils_1 = require("../../utils/import.utils");
const ContactsMiddlewares = {
    checkImportFile: (req, res, next) => {
        try {
            const uploadedFile = req.file;
            if (!uploadedFile) {
                res
                    .status(400)
                    .json({ success: false, message: 'File is missing in the request' });
                return;
            }
            const { filename, originalname, mimetype, size } = uploadedFile;
            const filePath = (0, path_1.join)(__dirname, '../../../public/temp', filename);
            if (!(0, fs_1.existsSync)(filePath)) {
                res.status(400).json({
                    success: false,
                    message: 'Uploaded file not found on server',
                });
                return;
            }
            if (!const_1.allowedMimeTypes.includes(mimetype)) {
                (0, fs_1.unlinkSync)(filePath);
                res.status(400).json({
                    success: false,
                    message: `Invalid file type: ${mimetype}. Only CSV or vCard allowed.`,
                });
                return;
            }
            if (size > const_1.MAX_IMPORT_FILE_SIZE) {
                (0, fs_1.unlinkSync)(filePath);
                res.status(400).json({
                    success: false,
                    message: `File size exceeds limit of ${const_1.MAX_IMPORT_FILE_SIZE / (1024 * 1024)} MB.`,
                });
                return;
            }
            next();
        }
        catch (error) {
            if (error instanceof Error) {
                logger_configs_1.default.error(error);
                next(error);
            }
            logger_configs_1.default.error('Unknown Error Occurred In Check Import File Middleware');
            next(error);
        }
    },
    checkImportFileContents: (req, res, next) => {
        try {
            const uploadedFile = req.file;
            if (!uploadedFile) {
                res.status(400).json({
                    success: false,
                    message: 'File is missing in the request',
                });
                return;
            }
            const { filename, mimetype, originalname } = uploadedFile;
            const filePath = (0, path_1.join)(__dirname, '../../../public/temp', filename);
            if (!(0, fs_1.existsSync)(filePath)) {
                res.status(400).json({
                    success: false,
                    message: 'Uploaded file not found on server',
                });
                return;
            }
            const extension = (0, path_1.extname)(originalname).toLowerCase();
            // Handle CSV files
            if (['.csv'].includes(extension) || mimetype.includes('csv')) {
                const content = (0, fs_1.readFileSync)(filePath, 'utf8');
                const records = sync_1.default.parse(content, {
                    columns: true,
                    skip_empty_lines: true,
                });
                if (!records.length) {
                    (0, fs_1.unlinkSync)(filePath);
                    res.status(400).json({
                        success: false,
                        message: 'CSV file is empty or invalid',
                    });
                    return;
                }
                // Validate each row
                const errors = [];
                records.forEach((row, index) => {
                    // Validate required fields
                    const requiredError = (0, import_utils_1.validateRequiredFields)(row);
                    if (requiredError) {
                        errors.push({
                            row: index + 1,
                            field: 'name',
                            message: requiredError,
                        });
                    }
                    // Validate phone number
                    const phoneError = (0, import_utils_1.validatePhone)({
                        phone: row.phone,
                        countryCode: row.countryCode,
                    });
                    if (phoneError) {
                        errors.push({
                            row: index + 1,
                            field: 'phone',
                            message: phoneError,
                        });
                    }
                    // Validate birthday
                    const birthdayError = (0, import_utils_1.validateBirthday)({
                        birthMonth: row.birthMonth,
                        birthDate: row.birthDate,
                        birthYear: row.birthYear,
                    });
                    if (birthdayError) {
                        errors.push({
                            row: index + 1,
                            field: 'birthday',
                            message: birthdayError,
                        });
                    }
                });
                if (errors.length > 0) {
                    (0, fs_1.unlinkSync)(filePath);
                    res.status(400).json({
                        success: false,
                        message: `CSV validation failed in ${errors.length} record(s)`,
                        errors: errors,
                    });
                    return;
                }
                next();
            }
            // Handle vCard files
            else if (['.vcf', '.vcard'].includes(extension) ||
                mimetype.includes('vcard') ||
                mimetype.includes('text/directory')) {
                const content = (0, fs_1.readFileSync)(filePath, 'utf8');
                const cards = content
                    .split(/END:VCARD/i)
                    .filter((c) => c.trim().length > 0);
                if (!cards.length) {
                    (0, fs_1.unlinkSync)(filePath);
                    res.status(400).json({
                        success: false,
                        message: 'vCard file is empty or invalid',
                    });
                    return;
                }
                const errors = [];
                cards.forEach((card, index) => {
                    // Extract fields using regex
                    const fnMatch = card.match(/FN:(.+)/i);
                    const nMatch = card.match(/N:(.+)/i);
                    const telMatch = card.match(/TEL.*:(.+)/i);
                    const bdayMatch = card.match(/BDAY:(\d{4})-?(\d{2})?-?(\d{2})?/i);
                    const fn = fnMatch ? fnMatch[1].trim() : '';
                    const n = nMatch ? nMatch[1].trim() : '';
                    // Validate required fields
                    if (!fn || !n) {
                        errors.push({
                            card: index + 1,
                            field: 'name',
                            message: 'vCard missing FN or N field',
                        });
                    }
                    // Validate phone (vCard TEL field)
                    // Note: vCard format typically includes country code in TEL field
                    if (telMatch) {
                        const tel = telMatch[1].trim();
                        // Check if phone number starts with a country code (+ prefix)
                        if (tel && !tel.startsWith('+')) {
                            errors.push({
                                card: index + 1,
                                field: 'phone',
                                message: 'Phone number must include country code (e.g., +1234567890)',
                            });
                        }
                    }
                    // Validate birthday (vCard BDAY field)
                    if (bdayMatch) {
                        const year = bdayMatch[1];
                        const month = bdayMatch[2];
                        const date = bdayMatch[3];
                        const birthdayError = (0, import_utils_1.validateBirthday)({
                            birthMonth: month,
                            birthDate: date,
                            birthYear: year,
                        });
                        if (birthdayError) {
                            errors.push({
                                card: index + 1,
                                field: 'birthday',
                                message: birthdayError,
                            });
                        }
                    }
                });
                if (errors.length > 0) {
                    (0, fs_1.unlinkSync)(filePath);
                    res.status(400).json({
                        success: false,
                        message: `vCard validation failed in ${errors.length} card(s)`,
                        errors: errors,
                    });
                    return;
                }
                next();
            }
            else {
                (0, fs_1.unlinkSync)(filePath);
                res.status(400).json({
                    success: false,
                    message: 'Unsupported file type for required field validation',
                });
                return;
            }
        }
        catch (error) {
            if (error instanceof Error) {
                logger_configs_1.default.error(error);
                next(error);
            }
            else {
                logger_configs_1.default.error('Unknown Error Occurred In Check Import File Contents Middleware');
                next(error);
            }
        }
    },
};
exports.default = ContactsMiddlewares;
