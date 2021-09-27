"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('auth', () => ({
    accessTokenSecretKey: process.env.ACCESS_TOKEN_SECRET_KEY,
    refreshTokenSecretKey: process.env.REFRESH_TOKEN_SECRET_KEY,
    accessTokenSecretKeyExpiresIn: process.env.ACCESS_TOKEN_SECRET_KEY_EXPIRES_IN,
    refreshTokenSecretKeyExpiresIn: process.env.REFRESH_TOKEN_SECRET_KEY_EXPIRES_IN,
    issuer: process.env.JWT_ISSUER,
}));
//# sourceMappingURL=auth.config.js.map