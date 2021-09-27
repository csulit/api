"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimitExceeded = void 0;
function rateLimitExceeded() {
    return {
        statusCode: 429,
        message: 'Request has been blocked',
        error: 'Rate limit exceeded',
    };
}
exports.rateLimitExceeded = rateLimitExceeded;
//# sourceMappingURL=rate-limit.response.js.map