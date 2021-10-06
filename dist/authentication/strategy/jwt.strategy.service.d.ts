import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { PrismaClientService } from 'src/prisma-client/prisma-client.service';
import { Jwt } from '../interface/jwt.interface';
declare const JwtStrategyService_base: new (...args: any[]) => Strategy;
export declare class JwtStrategyService extends JwtStrategyService_base {
    readonly configService: ConfigService<{
        auth: {
            ACCESS_TOKEN_SECRET_KEY: string;
        };
    }>;
    private prismaClientService;
    constructor(configService: ConfigService<{
        auth: {
            ACCESS_TOKEN_SECRET_KEY: string;
        };
    }>, prismaClientService: PrismaClientService);
    validate(payload: Jwt): Promise<{
        id: string;
        email: string;
        isLocked: boolean;
        passwordChangedAt: Date;
    }>;
}
export {};
