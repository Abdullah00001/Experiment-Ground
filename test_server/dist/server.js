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
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const db_configs_1 = __importDefault(require("./configs/db.configs"));
const cloudinary_configs_1 = __importDefault(require("./configs/cloudinary.configs"));
const { config } = dotenv_1.default;
const { initializedCloudinary } = cloudinary_configs_1.default;
config();
initializedCloudinary();
const PORT = Number(process.env.PORT) || 5000;
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_configs_1.default)();
        app_1.default.listen(PORT, '0.0.0.0', () => {
            console.log(`Server Running On Port ${PORT}`);
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.log(`\nServer startup failed!\n-----------------------------\nError Name: ${error.name}\nError Message: ${error.message}\nTime: ${new Date().toLocaleString()}\n⏳ Please check your database configuration or network.
        `);
        }
        else {
            console.error(`\nUnknown error during server connection\n----------------------------------------\nTime: ${new Date().toLocaleString()}\nPlease investigate the issue further.\n----------------------------------------
        `);
        }
        process.exit(1);
    }
}))();
