"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const authentication_module_1 = require("./authentication/authentication.module");
const auth_config_1 = require("./common/config/auth.config");
const email_config_1 = require("./common/config/email.config");
const email_module_1 = require("./email/email.module");
const prisma_client_module_1 = require("./prisma-client/prisma-client.module");
const visitor_module_1 = require("./visitor/visitor.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [auth_config_1.default, email_config_1.default],
            }),
            prisma_client_module_1.PrismaClientModule,
            authentication_module_1.AuthenticationModule,
            visitor_module_1.VisitorModule,
            email_module_1.EmailModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map