"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('email', () => ({
    ERP_BASE_URL: process.env.ERP_BASE_URL,
    ERP_EMAIL_URL: process.env.ERP_EMAIL_URL,
}));
//# sourceMappingURL=email.config.js.map