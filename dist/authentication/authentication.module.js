"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const nestjs_rate_limiter_1 = require("nestjs-rate-limiter");
const rate_limit_response_1 = require("../common/serializer/response/rate-limit.response");
const prisma_client_module_1 = require("../prisma-client/prisma-client.module");
const authentication_controller_1 = require("./authentication.controller");
const authentication_service_1 = require("./authentication.service");
const jwt_strategy_service_1 = require("./strategy/jwt.strategy.service");
const local_auth_strategy_service_1 = require("./strategy/local-auth.strategy.service");
let AuthenticationModule = class AuthenticationModule {
};
AuthenticationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_client_module_1.PrismaClientModule,
            nestjs_rate_limiter_1.RateLimiterModule.register({
                keyPrefix: 'global-auth',
                points: 100,
                duration: 300,
                customResponseSchema: () => (0, rate_limit_response_1.rateLimitExceeded)(),
            }),
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => ({
                    secret: configService.get('auth.accessTokenSecretKey'),
                    signOptions: {
                        expiresIn: configService.get('auth.accessTokenExpires'),
                    },
                }),
            }),
        ],
        controllers: [authentication_controller_1.AuthenticationController],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: nestjs_rate_limiter_1.RateLimiterGuard,
            },
            authentication_service_1.AuthenticationService,
            local_auth_strategy_service_1.LocalStrategyService,
            jwt_strategy_service_1.JwtStrategyService,
        ],
    })
], AuthenticationModule);
exports.AuthenticationModule = AuthenticationModule;
//# sourceMappingURL=authentication.module.js.map