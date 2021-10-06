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
const cookie_config_1 = require("./config/cookie.config");
let AuthenticationService = class AuthenticationService {
    constructor(prismaClientService, jwtService, config) {
        this.prismaClientService = prismaClientService;
        this.jwtService = jwtService;
        this.config = config;
        this.FIFTEEN_MINUTES = 900000;
        this.REFRESH_TOKEN_SECRET_KEY = this.config.get('auth.REFRESH_TOKEN_SECRET_KEY', {
            infer: true,
        });
        this.REFRESH_TOKEN_SECRET_KEY_EXPIRES_IN = this.config.get('auth.REFRESH_TOKEN_SECRET_KEY_EXPIRES_IN', {
            infer: true,
        });
        this.JWT_ISSUER = this.config.get('auth.JWT_ISSUER', {
            infer: true,
        });
    }
    async createRefreshToken(id) {
        return await this.jwtService.signAsync({ id }, {
            secret: this.REFRESH_TOKEN_SECRET_KEY,
            expiresIn: this.REFRESH_TOKEN_SECRET_KEY_EXPIRES_IN,
            issuer: this.JWT_ISSUER,
        });
    }
    async validateRefreshToken(token, res) {
        if (!token) {
            throw new common_1.NotFoundException('Refresh token not found.');
        }
        const { exp } = await this.jwtService.verifyAsync(token, {
            secret: this.REFRESH_TOKEN_SECRET_KEY,
            ignoreExpiration: true,
            issuer: this.JWT_ISSUER,
        });
        const user = await this.prismaClientService.user.findUnique({
            where: {
                refreshToken: token,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found.');
        }
        const accessToken = await this.signAccessToken(user.id);
        if (user.refreshTokenRevoked) {
            throw new common_1.UnauthorizedException('Token is suspended.');
        }
        if (Date.now() <= exp * 1000) {
            res.cookie('accessToken', accessToken, (0, cookie_config_1.cookieConfig)(this.FIFTEEN_MINUTES));
            return {
                id: user.id,
                message: 'Token refreshed.',
            };
        }
        throw new common_1.UnauthorizedException('Session has expired please login again.');
    }
    async signAccessToken(id) {
        return await this.jwtService.signAsync({ id });
    }
    async register(data) {
        const { email, password } = data;
        const hashedPassword = await (0, bcrypt_1.hash)(password, 10);
        return await this.prismaClientService.user.create({
            data: {
                email,
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
            },
        });
    }
    async setClientCookies(id, res) {
        const SEVEN_DAYS = 6.048e8;
        const accessToken = await this.signAccessToken(id);
        const refreshToken = await this.createRefreshToken(id);
        const user = await this.prismaClientService.user.findUnique({
            where: { id },
        });
        if (user) {
            await this.prismaClientService.user.update({
                where: { id },
                data: { refreshToken },
            });
        }
        res.cookie('accessToken', accessToken, (0, cookie_config_1.cookieConfig)(this.FIFTEEN_MINUTES));
        res.cookie('refreshToken', refreshToken, (0, cookie_config_1.cookieConfig)(SEVEN_DAYS));
    }
    async clearTokens(res) {
        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');
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