"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const hpp = require("hpp");
const xss = require("xss-clean");
const app_module_1 = require("./app.module");
const transform_interceptor_1 = require("./common/interceptor/transform.interceptor");
const http_exception_1 = require("./common/serializer/exception/http.exception");
const prisma_exception_1 = require("./common/serializer/exception/prisma.exception");
const prisma_client_service_1 = require("./prisma-client/prisma-client.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalFilters(new http_exception_1.HttpExceptionFilter());
    app.useGlobalFilters(new prisma_exception_1.PrismaExceptionFilter());
    app.useGlobalInterceptors(new transform_interceptor_1.TransformInterceptor());
    if (process.env.NODE_ENV === 'development') {
        app.setGlobalPrefix('api');
    }
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    app.enableCors({
        origin: ['*'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
        credentials: true,
    });
    app.use(hpp({
        whitelist: [],
    }));
    app.use(cookieParser());
    app.use(helmet());
    app.use(xss());
    app.use(compression());
    const prismaClientService = app.get(prisma_client_service_1.PrismaClientService);
    prismaClientService.enableShutdownHooks(app);
    await app.listen(4001);
}
bootstrap();
//# sourceMappingURL=main.js.map