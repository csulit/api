"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const bcrypt_1 = require("bcrypt");
const prisma_client_service_1 = require("../prisma-client/prisma-client.service");
let AuthenticationService = class AuthenticationService {
    constructor(prismaClientService, jwtService, config) {
        this.prismaClientService = prismaClientService;
        this.jwtService = jwtService;
        this.config = config;
        this.refreshTokenSecretKey = this.config.get('auth.refreshTokenSecretKey', {
            infer: true,
        });
        this.refreshTokenSecretKeyExpiresIn = this.config.get('auth.refreshTokenSecretKeyExpiresIn', {
            infer: true,
        });
        this.issuer = this.config.get('auth.issuer', {
            infer: true,
        });
    }
    async createRefreshToken(id) {
        return await this.jwtService.signAsync({ id }, {
            secret: this.refreshTokenSecretKey,
            expiresIn: this.refreshTokenSecretKeyExpiresIn,
            issuer: this.issuer,
        });
    }
    async validateRefreshToken(token) {
        const [refreshToken, error] = await this.jwtService.verifyAsync(token, {
            secret: this.refreshTokenSecretKey,
            ignoreExpiration: false,
            issuer: this.issuer,
        });
        if (error) {
            throw new common_1.UnauthorizedException('Session has expired please login again.');
        }
        return refreshToken;
    }
    async signAccessToken(id) {
        return await this.jwtService.signAsync({ id });
    }
    async register() {
        return await this.prismaClientService.user.create({
            data: {
                email: 'chrisgelosulit@gmail.com',
                password: await (0, bcrypt_1.hash)('Love2eat', 10),
            },
        });
    }
};
AuthenticationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_client_service_1.PrismaClientService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthenticationService);
exports.AuthenticationService = AuthenticationService;
//# sourceMappingURL=authentication.service.js.map