"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorMiddleware = void 0;
const globalErrorMiddleware = (err, req, res, next) => {
    res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        errors: [
            'The server failed to respond. Please try again later.',
            'The server may be experiencing temporary issues or may have become unresponsive.',
            'If the problem persists, it could indicate a more serious backend issue that requires attention.',
        ],
    });
    return;
};
exports.globalErrorMiddleware = globalErrorMiddleware;
