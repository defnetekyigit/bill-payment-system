"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSwagger = exports.swaggerSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Bill Payment System API",
            version: "1.0.0",
            description: "SE4458 Midterm Project - Bill Payment APIs",
        },
        servers: [{ url: "http://localhost:3000/api/v1" }],
    },
    apis: [`${__dirname}/../routes/*.{ts,js}`],
};
exports.swaggerSpec = (0, swagger_jsdoc_1.default)(options);
const setupSwagger = (app) => {
    app.use("/swagger", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(exports.swaggerSpec));
};
exports.setupSwagger = setupSwagger;
