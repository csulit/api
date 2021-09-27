"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieConfig = void 0;
const cookieConfig = (seconds) => {
    return {
        expires: new Date(Date.now() + seconds),
        sameSite: 'strict',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'development' ? false : true,
    };
};
exports.cookieConfig = cookieConfig;
//# sourceMappingURL=cookie.config.js.map