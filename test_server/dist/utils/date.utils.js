"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dayjs_1 = __importDefault(require("dayjs"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(timezone_1.default);
const DateUtils = {
    formatDate: (isoDateString) => {
        try {
            const date = new Date(isoDateString);
            // Check if date is valid
            if (isNaN(date.getTime())) {
                throw new Error('Invalid date string');
            }
            const months = [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December',
            ];
            const day = date.getDate();
            const month = months[date.getMonth()];
            const year = date.getFullYear();
            return `${day} ${month} ${year}`;
        }
        catch (error) {
            throw new Error(`Failed to format date: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
    formatDateTime: (isoString, timeZone = 'Asia/Dhaka') => {
        return (0, dayjs_1.default)(isoString)
            .tz(timeZone)
            .format('MMMM D, YYYY [at] hh:mm A (z)');
    },
    calculateFutureDate: (value) => {
        const regex = /^(\d+)(ms|s|m|h|d)$/;
        const match = value.match(regex);
        if (!match)
            throw new Error('Invalid expiresIn format');
        const number = Number(match[1]);
        const unit = match[2];
        let now = Date.now();
        switch (unit) {
            case 'ms':
                now += number;
                break;
            case 's':
                now += number * 1000;
                break;
            case 'm':
                now += number * 60 * 1000;
                break;
            case 'h':
                now += number * 60 * 60 * 1000;
                break;
            case 'd':
                now += number * 24 * 60 * 60 * 1000;
                break;
            default:
                throw new Error('Unsupported time unit');
        }
        return new Date(now).toISOString();
    },
    compareDate: (oldIsoDate, duration) => {
        try {
            const regex = /^(\d+)(ms|s|m|h|d)$/;
            const match = duration.match(regex);
            if (!match)
                throw new Error('Invalid duration format');
            const number = Number(match[1]);
            const unit = match[2];
            const oldDate = new Date(oldIsoDate);
            const currentDate = new Date();
            // Check if date is valid
            if (isNaN(oldDate.getTime())) {
                throw new Error('Invalid date string');
            }
            // Calculate duration in milliseconds
            let durationInMs = 0;
            switch (unit) {
                case 'ms':
                    durationInMs = number;
                    break;
                case 's':
                    durationInMs = number * 1000;
                    break;
                case 'm':
                    durationInMs = number * 60 * 1000;
                    break;
                case 'h':
                    durationInMs = number * 60 * 60 * 1000;
                    break;
                case 'd':
                    durationInMs = number * 24 * 60 * 60 * 1000;
                    break;
                default:
                    throw new Error('Unsupported time unit');
            }
            // Calculate the difference between current date and old date
            const differenceInMs = currentDate.getTime() - oldDate.getTime();
            // Returns true if the old date is at least the specified duration old
            return differenceInMs >= durationInMs;
        }
        catch (error) {
            throw new Error(`Failed to compare date: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    },
};
exports.default = DateUtils;
