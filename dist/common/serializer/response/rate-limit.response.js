"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimitExceededResponse = void 0;
function rateLimitExceededResponse() {
    return {
        statusCode: 429,
        message: 'Request has been blocked',
        error: 'Rate limit exceeded',
    };
}
exports.rateLimitExceededResponse = rateLimitExceededResponse;
//# sourceMappingURL=rate-limit.response.js.map