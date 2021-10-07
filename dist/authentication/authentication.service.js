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
const email_service_1 = require("../email/email.service");
const prisma_client_service_1 = require("../prisma-client/prisma-client.service");
const cookie_config_1 = require("./config/cookie.config");
let AuthenticationService = class AuthenticationService {
    constructor(emailService, prismaClientService, jwtService, config) {
        this.emailService = emailService;
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
        const newUser = await this.prismaClientService.user.create({
            data: {
                email,
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
            },
        });
        if (newUser) {
            await this.emailService.sendEmail({
                to: email,
                copy: 'christian.sulit@kmc.solutions',
                subject: 'HDF Account',
                body: `
          <p>Email: ${email}</p>
          <p>Password: ${password}</p>
        `,
            });
        }
        return newUser;
    }
    generateRandomOtp() {
        return Math.floor(Math.random() * 90000) + 10000;
    }
    async createOtpCode(userId) {
        const dbSelect = {
            otp: true,
            user: {
                select: {
                    email: true,
                },
            },
        };
        let otpCode;
        const unUsedOtpCode = await this.prismaClientService.otpCode.findFirst({
            where: { AND: [{ used: false }, { user: { id: userId } }] },
            select: dbSelect,
        });
        if (unUsedOtpCode) {
            otpCode = unUsedOtpCode;
        }
        else {
            const newOtpCode = await this.prismaClientService.otpCode.create({
                data: { otp: this.generateRandomOtp(), userId },
                select: dbSelect,
            });
            otpCode = newOtpCode;
        }
        await this.emailService.sendEmail({
            to: otpCode.user.email,
            copy: 'christian.sulit@kmc.solutions',
            subject: 'HDF OTP CODE',
            body: `OTP code: <b>${otpCode.otp}</b>`,
        });
    }
    async sendOtpCode(email) {
        const isRegistered = await this.prismaClientService.user.findUnique({
            where: { email },
        });
        if (isRegistered) {
            await this.createOtpCode(isRegistered.id);
            return null;
        }
        const hashedPassword = await (0, bcrypt_1.hash)('Love2Work!', 10);
        const newUser = await this.prismaClientService.user.create({
            data: { email, password: hashedPassword },
        });
        await this.createOtpCode(newUser.id);
        return null;
    }
    async otpAuth(data) {
        const { email, otp } = data;
        const otpIsValid = await this.prismaClientService.otpCode.findFirst({
            where: { AND: [{ otp, used: false }, { user: { email } }] },
        });
        if (otpIsValid) {
            await this.prismaClientService.otpCode.update({
                where: { id: otpIsValid.id },
                data: { used: true },
            });
            return await this.prismaClientService.user.findUnique({
                where: { email },
                select: {
                    id: true,
                    email: true,
                    profile: {
                        select: {
                            firstName: true,
                            lastName: true,
                            address: true,
                            phoneNumber: true,
                            organization: true,
                        },
                    },
                },
            });
        }
        throw new common_1.UnauthorizedException('OTP has expired or not found.');
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
    __metadata("design:paramtypes", [email_service_1.EmailService,
        prisma_client_service_1.PrismaClientService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthenticationService);
exports.AuthenticationService = AuthenticationService;
//# sourceMappingURL=authentication.service.js.map