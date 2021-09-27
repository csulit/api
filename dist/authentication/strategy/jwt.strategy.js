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
exports.JwtStrategyService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const prisma_client_service_1 = require("../../prisma-client/prisma-client.service");
let JwtStrategyService = class JwtStrategyService extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(config, prismaClientService) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromExtractors([
                (req) => {
                    var _a;
                    if ((_a = req === null || req === void 0 ? void 0 : req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken) {
                        return req.cookies.accessToken;
                    }
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: config.get('auth.accessTokenSecretKey', {
                infer: true,
            }),
        });
        this.config = config;
        this.prismaClientService = prismaClientService;
    }
    async validate(payload) {
        return await this.prismaClientService.user.findUnique({
            where: { id: payload.id },
            select: {
                id: true,
                isLocked: true,
                passwordChangedAt: true,
            },
        });
    }
};
JwtStrategyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_client_service_1.PrismaClientService])
], JwtStrategyService);
exports.JwtStrategyService = JwtStrategyService;
//# sourceMappingURL=jwt.strategy.js.map