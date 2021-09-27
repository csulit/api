"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('auth', () => ({
    accessTokenSecretKey: process.env.JWT_SECRET,
    refreshTokenKey: process.env.REFRESH_TOKEN_SECRET,
    accessTokenExpires: process.env.JWT_SECRET_EXPIRES_IN,
}));
//# sourceMappingURL=auth.config.js.map