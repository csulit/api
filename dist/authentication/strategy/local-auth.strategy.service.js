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
exports.LocalStrategyService = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const bcrypt_1 = require("bcrypt");
const passport_local_1 = require("passport-local");
const prisma_client_service_1 = require("../../prisma-client/prisma-client.service");
let LocalStrategyService = class LocalStrategyService extends (0, passport_1.PassportStrategy)(passport_local_1.Strategy) {
    constructor(prismaClientService) {
        super({ usernameField: 'email' });
        this.prismaClientService = prismaClientService;
    }
    async validate(email, password) {
        const user = await this.prismaClientService.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true,
                isLocked: true,
            },
        });
        if (user) {
            if (user.isLocked) {
                throw new common_1.UnauthorizedException('Your account is locked.');
            }
            if (await (0, bcrypt_1.compare)(password, user.password)) {
                return user;
            }
        }
        throw new common_1.UnauthorizedException('Invalid credentials.');
    }
};
LocalStrategyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_client_service_1.PrismaClientService])
], LocalStrategyService);
exports.LocalStrategyService = LocalStrategyService;
//# sourceMappingURL=local-auth.strategy.service.js.map