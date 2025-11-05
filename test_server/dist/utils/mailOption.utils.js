"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mailOption = (to, subject, html) => {
    const option = {
        from: process.env.SMTP_USER,
        to,
        subject,
        html,
    };
    return option;
};
exports.default = mailOption;
