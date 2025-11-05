"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequiredFields = exports.validateBirthday = exports.validatePhone = exports.ExportContactFromVCard = exports.ExtractContactsFromCsv = exports.getFileExtension = void 0;
const contacts_enums_1 = require("../modules/contacts/contacts.enums");
const sync_1 = require("csv-parse/sync");
const path_1 = __importDefault(require("path"));
/**
 * Get file extension from filename (without dot, lowercase)
 * @param fileName - The name of the file
 * @returns The file extension in lowercase without dot
 * @example
 * getFileExtension('example.CSV') // returns 'csv'
 * getFileExtension('archive.tar.gz') // returns 'gz'
 * getFileExtension('no-extension') // returns ''
 */
const getFileExtension = (fileName) => {
    return path_1.default.extname(fileName).slice(1).toLowerCase();
};
exports.getFileExtension = getFileExtension;
const ExtractContactsFromCsv = ({ fileContent, userId, }) => {
    const records = (0, sync_1.parse)(fileContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
    });
    const monthArray = Object.values(contacts_enums_1.BMonth);
    const extractedContacts = records.map(({ addressCity, addressCountry, addressPostCode, addressStreet, birthdayDate, birthdayMonth, birthdayYear, email, firstName, lastName, organizationName, organizationPosition, phoneCountryCode, phoneNumber, }) => ({
        firstName,
        lastName,
        email: email || null,
        phone: {
            countryCode: phoneCountryCode || null,
            number: phoneNumber || null,
        },
        birthday: {
            day: birthdayDate || null,
            month: monthArray[Number(birthdayMonth) - 1] || null,
            year: birthdayYear || null,
        },
        location: {
            city: addressCity || null,
            country: addressCountry || null,
            postCode: addressPostCode || null,
            streetAddress: addressStreet || null,
        },
        worksAt: {
            companyName: organizationName || null,
            jobTitle: organizationPosition || null,
        },
        userId,
    }));
    return extractedContacts;
};
exports.ExtractContactsFromCsv = ExtractContactsFromCsv;
/**
 * Safely extracts value after colon from vCard line
 */
const extractVCardValue = (line) => {
    const colonIndex = line.indexOf(':');
    return colonIndex !== -1 ? line.substring(colonIndex + 1).trim() : '';
};
/**
 * Validates if a string is a valid email
 */
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
/**
 * Parses phone number into country code and number
 */
const parsePhoneNumber = (tel) => {
    if (!tel)
        return { countryCode: null, number: null };
    let phoneMatch = tel.match(/^(\+\d{1,3})(\d+)$/);
    if (phoneMatch) {
        return {
            countryCode: phoneMatch[1],
            number: tel,
        };
    }
    phoneMatch = tel.match(/^(\+\d{1,3}-\d{1,3})(\d+)$/);
    if (phoneMatch) {
        return {
            countryCode: phoneMatch[1],
            number: tel,
        };
    }
    // If no match, try to extract any digits
    const digitsOnly = tel.replace(/\D/g, '');
    if (digitsOnly.length > 0) {
        // Assume first 1-4 digits after + are country code if it starts with +
        if (tel.startsWith('+')) {
            const countryCode = '+' + digitsOnly.substring(0, Math.min(4, digitsOnly.length));
            const number = digitsOnly.substring(Math.min(4, digitsOnly.length));
            return {
                countryCode: number ? countryCode : null,
                number: number || null,
            };
        }
        return { countryCode: null, number: digitsOnly };
    }
    return { countryCode: null, number: null };
};
/**
 * Parses birthday string into day, month, year
 */
const parseBirthday = (bday, monthNames) => {
    if (!bday)
        return { day: null, month: null, year: null };
    const [year, monthNum, day] = bday.split('-');
    const parsedYear = year ? parseInt(year, 10) : null;
    const parsedDay = day ? parseInt(day, 10) : null;
    const parsedMonth = monthNum ? monthNames[parseInt(monthNum, 10) - 1] : null;
    // Validate parsed values
    const isValidYear = parsedYear && parsedYear > 1900 && parsedYear <= new Date().getFullYear();
    const isValidDay = parsedDay && parsedDay >= 1 && parsedDay <= 31;
    const isValidMonth = parsedMonth && monthNames.includes(parsedMonth);
    return {
        day: isValidDay ? parsedDay : null,
        month: isValidMonth ? parsedMonth : null,
        year: isValidYear ? parsedYear : null,
    };
};
/**
 * Parses address string into components
 */
const parseAddress = (adr) => {
    var _a, _b, _c, _d;
    if (!adr) {
        return { streetAddress: null, city: null, postCode: null, country: null };
    }
    const adrParts = adr.split(';');
    // vCard ADR format: PO Box;Extended Address;Street;City;Region;Postal Code;Country
    const streetAddress = ((_a = adrParts[2]) === null || _a === void 0 ? void 0 : _a.trim()) || null;
    const city = ((_b = adrParts[3]) === null || _b === void 0 ? void 0 : _b.trim()) || null;
    const postCodeStr = (_c = adrParts[5]) === null || _c === void 0 ? void 0 : _c.trim();
    const country = ((_d = adrParts[6]) === null || _d === void 0 ? void 0 : _d.trim()) || null;
    // Parse postal code - handle both numeric and alphanumeric
    let postCode = null;
    if (postCodeStr) {
        const numericPostCode = parseInt(postCodeStr.replace(/\D/g, ''), 10);
        postCode = !isNaN(numericPostCode) ? numericPostCode : null;
    }
    return { streetAddress, city, postCode, country };
};
/**
 * Parses a single vCard string into structured fields
 */
const parseVCardString = (vCardString) => {
    try {
        const lines = vCardString
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line.length > 0);
        let firstName = '';
        let lastName = '';
        let email = null;
        let tel = '';
        let bday = '';
        let adr = '';
        let org = null;
        let title = null;
        for (const line of lines) {
            const upperLine = line.toUpperCase();
            if (upperLine.startsWith('N:')) {
                const nValue = extractVCardValue(line);
                const [last = '', first = ''] = nValue.split(';');
                lastName = last.trim();
                firstName = first.trim();
            }
            else if (upperLine.startsWith('EMAIL')) {
                const emailValue = extractVCardValue(line);
                email = emailValue && isValidEmail(emailValue) ? emailValue : null;
            }
            else if (upperLine.startsWith('TEL')) {
                const telValue = extractVCardValue(line);
                tel = telValue;
            }
            else if (upperLine.startsWith('BDAY:')) {
                bday = extractVCardValue(line);
            }
            else if (upperLine.startsWith('ADR')) {
                adr = extractVCardValue(line);
            }
            else if (upperLine.startsWith('ORG:')) {
                const orgValue = extractVCardValue(line);
                org = orgValue || null;
            }
            else if (upperLine.startsWith('TITLE:')) {
                const titleValue = extractVCardValue(line);
                title = titleValue || null;
            }
        }
        // Validate required fields
        if (!firstName && !lastName) {
            console.warn('vCard missing both first and last name, skipping');
            return null;
        }
        return { firstName, lastName, email, tel, bday, adr, org, title };
    }
    catch (error) {
        console.error('Error parsing vCard string:', error);
        return null;
    }
};
/**
 * Extracts contacts from vCard file content
 */
const ExportContactFromVCard = ({ fileContent, userId, }) => {
    const monthNames = Object.values(contacts_enums_1.BMonth);
    const extractedContacts = [];
    if (!fileContent || fileContent.trim().length === 0) {
        console.warn('Empty vCard file content');
        return extractedContacts;
    }
    // Match all vCard blocks using regex
    const vCardRegex = /BEGIN:VCARD[\s\S]*?END:VCARD/gi;
    const vCardMatches = fileContent.match(vCardRegex);
    if (!vCardMatches || vCardMatches.length === 0) {
        console.warn('No vCards found in content');
        return extractedContacts;
    }
    console.log(`Found ${vCardMatches.length} vCard(s)`);
    for (let i = 0; i < vCardMatches.length; i++) {
        const vCardString = vCardMatches[i];
        try {
            const parsedFields = parseVCardString(vCardString);
            if (!parsedFields) {
                console.warn(`Skipping invalid vCard at index ${i}`);
                continue;
            }
            const { firstName, lastName, email, tel, bday, adr, org, title } = parsedFields;
            console.log(tel);
            // Parse phone number
            const { countryCode, number } = parsePhoneNumber(tel);
            // Parse birthday
            const { day, month, year } = parseBirthday(bday, monthNames);
            // Parse address
            const { streetAddress, city, postCode, country } = parseAddress(adr);
            const contact = {
                firstName: firstName || '',
                lastName: lastName || '',
                email: email || null,
                phone: {
                    countryCode: countryCode || null,
                    number: number || null,
                },
                birthday: {
                    day: day || null,
                    month: month || null,
                    year: year || null,
                },
                location: {
                    city: city || null,
                    country: country || null,
                    postCode: postCode || null,
                    streetAddress: streetAddress || null,
                },
                worksAt: {
                    companyName: org || null,
                    jobTitle: title || null,
                },
                userId,
            };
            extractedContacts.push(contact);
        }
        catch (error) {
            console.error(`✗ Error parsing vCard at index ${i}:`, error);
            continue;
        }
    }
    console.log(`Total extracted: ${extractedContacts.length}/${vCardMatches.length}`);
    return extractedContacts;
};
exports.ExportContactFromVCard = ExportContactFromVCard;
// Validation helper functions
const validatePhone = (data) => {
    const { phone, countryCode } = data;
    // If phone exists, country code must exist
    if (phone && phone.trim() && (!countryCode || !countryCode.trim())) {
        return 'Country code is required when phone number is provided';
    }
    return null;
};
exports.validatePhone = validatePhone;
const validateBirthday = (data) => {
    const { birthMonth, birthDate, birthYear } = data;
    // Check if any birthday field is provided
    const hasMonth = birthMonth && birthMonth.trim();
    const hasDate = birthDate && birthDate.trim();
    const hasYear = birthYear && birthYear.trim();
    const providedFields = [hasMonth, hasDate, hasYear].filter(Boolean).length;
    // If any birthday field is provided
    if (providedFields > 0) {
        // Month and date are BOTH required
        if (!hasMonth || !hasDate) {
            return 'Both month and date are required for birthday. Year is optional.';
        }
    }
    return null;
};
exports.validateBirthday = validateBirthday;
const validateRequiredFields = (data) => {
    if (!data.firstName || !data.firstName.trim()) {
        return 'firstName is required';
    }
    if (!data.lastName || !data.lastName.trim()) {
        return 'lastName is required';
    }
    return null;
};
exports.validateRequiredFields = validateRequiredFields;
