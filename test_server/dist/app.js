"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const morgan_configs_1 = require("./configs/morgan.configs");
const cors_configs_1 = __importDefault(require("./configs/cors.configs"));
const globalError_middleware_1 = require("./middlewares/globalError.middleware");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const v1_1 = __importDefault(require("./routes/v1"));
const const_1 = require("./const");
const express_useragent_1 = __importDefault(require("express-useragent"));
const yamljs_1 = __importDefault(require("yamljs"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const path_1 = __importDefault(require("path"));
require("./jobs/index");
require("./queue/index");
const passport_1 = __importDefault(require("passport"));
require("./configs/googleStrategy.config");
const helmet_1 = __importDefault(require("helmet"));
const app = (0, express_1.default)();
const swaggerDocumentPath = path_1.default.resolve(__dirname, '../swagger.yaml');
const swaggerDocument = yamljs_1.default.load(swaggerDocumentPath);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)(cors_configs_1.default));
app.use(express_useragent_1.default.express());
app.use((0, morgan_1.default)(morgan_configs_1.morganMessageFormat, {
    stream: {
        write: (message) => (0, morgan_configs_1.streamConfig)(message),
    },
}));
app.use((0, helmet_1.default)());
app.use(passport_1.default.initialize());
app.get('/health', (req, res) => {
    res.status(200).json({ message: 'Server Is Running' });
});
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
/* ====================================|
|--------------APP ROUTES--------------|
|==================================== */
// V1 ROUTES
app.use(const_1.baseUrl.v1, v1_1.default);
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        error: `Cannot ${req.method} ${req.originalUrl}`,
    });
});
app.use(globalError_middleware_1.globalErrorMiddleware);
exports.default = app;
