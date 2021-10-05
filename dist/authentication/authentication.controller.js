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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const authentication_service_1 = require("./authentication.service");
const login_classes_1 = require("./classes/login.classes");
const login_dto_1 = require("./dto/login.dto");
const register_dto_1 = require("./dto/register.dto");
const local_auth_guard_1 = require("./guard/local.auth.guard");
let AuthenticationController = class AuthenticationController {
    constructor(authenticationService) {
        this.authenticationService = authenticationService;
    }
    async login(req, res) {
        const { id, email } = req.user;
        await this.authenticationService.setClientCookies(id, res);
        return {
            id,
            email,
        };
    }
    async register(data, res) {
        const user = await this.authenticationService.register(data);
        await this.authenticationService.setClientCookies(user.id, res);
        return user;
    }
    async refreshToken(req, res) {
        const validatedRefreshToken = await this.authenticationService.validateRefreshToken(req.cookies['refreshToken'], res);
        return validatedRefreshToken;
    }
    logout(res) {
        res.clearCookie('refreshToken');
        return {
            message: 'Logout successfully,',
        };
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Login user',
        description: 'Some description here...',
    }),
    (0, swagger_1.ApiBasicAuth)(),
    (0, swagger_1.ApiBody)({ type: login_dto_1.LoginUserDTO }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'User successfully login.',
        type: () => login_classes_1.LoginUserClass,
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized.',
    }),
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(200),
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "login", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Register user',
        description: 'If api successfully created the user the access token will be available in the cookie.',
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'User successfully created.',
        type: () => login_classes_1.LoginUserClass,
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Duplicate user.',
    }),
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [register_dto_1.RegisterUserDTO, Object]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "register", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Refresh token',
        description: 'Nothing to include in the request body the api will automatically read request cookies and validate.',
    }),
    (0, swagger_1.ApiCookieAuth)(),
    (0, common_1.Post)('refresh-token'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthenticationController.prototype, "refreshToken", null);
__decorate([
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthenticationController.prototype, "logout", null);
AuthenticationController = __decorate([
    (0, swagger_1.ApiTags)('Authentication'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [authentication_service_1.AuthenticationService])
], AuthenticationController);
exports.AuthenticationController = AuthenticationController;
//# sourceMappingURL=authentication.controller.js.map