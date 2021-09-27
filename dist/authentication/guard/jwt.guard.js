"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const jsonwebtoken_1 = require("jsonwebtoken");
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    constructor() {
        super(...arguments);
        this.decodedUserAccessToken = {};
    }
    canActivate(context) {
        const req = context.switchToHttp().getRequest();
        if (req['cookies'] && req['cookies']['accessToken']) {
            this.decodedUserAccessToken = (0, jsonwebtoken_1.decode)(req['cookies']['accessToken']);
        }
        return super.canActivate(context);
    }
    handleRequest(err, user, info) {
        const currentUser = user;
        const userAccessToken = this.decodedUserAccessToken;
        if (err || info || !user) {
            if ((info === null || info === void 0 ? void 0 : info.name) === 'TokenExpiredError') {
                throw new common_1.UnprocessableEntityException('The session has expired. Please re-login');
            }
            throw new common_1.UnauthorizedException('Invalid access token!');
        }
        if (currentUser.isLocked) {
            throw new common_1.UnauthorizedException('Account is locked!');
        }
        if (currentUser.passwordChangedAt) {
            const changedTimeStamp = currentUser.passwordChangedAt.getTime() / 1000;
            if (userAccessToken.iat < changedTimeStamp) {
                throw new common_1.UnauthorizedException('Password has been changed recently please login again!');
            }
        }
        return user;
    }
};
JwtAuthGuard = __decorate([
    (0, common_1.Injectable)()
], JwtAuthGuard);
exports.JwtAuthGuard = JwtAuthGuard;
//# sourceMappingURL=jwt.guard.js.map