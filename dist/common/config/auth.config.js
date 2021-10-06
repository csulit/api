"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('auth', () => ({
    ACCESS_TOKEN_SECRET_KEY: process.env.ACCESS_TOKEN_SECRET_KEY,
    REFRESH_TOKEN_SECRET_KEY: process.env.REFRESH_TOKEN_SECRET_KEY,
    ACCESS_TOKEN_SECRET_KEY_EXPIRES_IN: process.env.ACCESS_TOKEN_SECRET_KEY_EXPIRES_IN,
    REFRESH_TOKEN_SECRET_KEY_EXPIRES_IN: process.env.REFRESH_TOKEN_SECRET_KEY_EXPIRES_IN,
    JWT_ISSUER: process.env.JWT_ISSUER,
}));
//# sourceMappingURL=auth.config.js.map